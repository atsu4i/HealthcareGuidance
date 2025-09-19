// 📱 Personal AI Assistant - Chat Hook

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message, ChatSession, ChatState, AppSettings } from '@/types'
import { sessionsStorage, activeSessionStorage, generateId } from '@/lib/storage'
import { generateTitleFromMessage } from '@/lib/utils'
import { showNotification } from '@/lib/utils'
import { getResumeInfo } from '@/resumes'

export function useChat(settings: AppSettings) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [state, setState] = useState<ChatState>('idle')
  const [error, setError] = useState<string | null>(null)

  // Initialize or load session
  useEffect(() => {
    const activeSessionId = activeSessionStorage.get()
    if (activeSessionId) {
      loadSession(activeSessionId)
    } else {
      createNewSession()
    }
  }, [])

  // Create new session with initial system message
  const createNewSession = useCallback(() => {
    const sessionId = generateId()

    // Generate initial message based on resume selection
    let initialContent = '現在、面接用の履歴書が選択されていません。\n\n設定画面（⚙️）から履歴書を選択してください。履歴書を選択すると、その情報に基づいた模擬面接が始まります。'

    if (settings.selectedResume) {
      const resumeInfo = getResumeInfo(settings.selectedResume as any)
      if (resumeInfo) {
        initialContent = `こんにちは。${resumeInfo.name}です。\n\n本日はお忙しい中、面接のお時間をいただきありがとうございます。どうぞよろしくお願いいたします。`
      }
    }

    // Create initial system message
    const initialMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: initialContent,
      timestamp: new Date()
    }
    
    const session: ChatSession = {
      id: sessionId,
      title: '新しいチャット',
      messages: [initialMessage],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    sessionsStorage.add(session)
    activeSessionStorage.set(sessionId)
    setCurrentSessionId(sessionId)
    setMessages([initialMessage])
    setError(null)
  }, [settings.selectedResume])

  // Load existing session
  const loadSession = useCallback((sessionId: string) => {
    const sessions = sessionsStorage.getAll()
    const session = sessions.find(s => s.id === sessionId)
    
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
      activeSessionStorage.set(sessionId)
    } else {
      createNewSession()
    }
  }, [createNewSession])

  // Save current session
  const saveCurrentSession = useCallback(() => {
    if (!currentSessionId) return

    const sessions = sessionsStorage.getAll()
    const sessionIndex = sessions.findIndex(s => s.id === currentSessionId)
    
    if (sessionIndex >= 0) {
      // Update existing session
      const title = messages.length > 0 ? generateTitleFromMessage(messages[0].content) : '新しいチャット'
      
      sessionsStorage.update(currentSessionId, {
        title,
        messages,
        updatedAt: new Date()
      })
    }
  }, [currentSessionId, messages])

  // Auto-save when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveCurrentSession()
    }
  }, [messages, saveCurrentSession])

  // Send message to API
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state === 'loading') return
    if (!settings.geminiConfig.apiKey) {
      setError('APIキーが設定されていません')
      showNotification('APIキーを設定してください', 'error')
      return
    }

    // Create user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    // Create empty assistant message for streaming
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date()
    }

    // Add both user and empty assistant message at once
    const newMessages = [...messages, userMessage]
    setMessages([...newMessages, assistantMessage])
    setState('loading')
    setError(null)

    try {
      if (settings.enableStreaming) {
        // Real streaming request with character-by-character display
        setState('streaming')
        const response = await fetch('/api/chat?stream=true', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: newMessages,
            config: settings.geminiConfig,
            selectedResume: settings.selectedResume,
            streamingSpeed: settings.streamingSpeed
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'APIエラーが発生しました')
        }

        // Handle streaming response with character-by-character display
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('ストリーミングレスポンスが読み取れません')
        }

        const decoder = new TextDecoder()
        let buffer = ''
        let displayedContent = ''
        let pendingContent = ''

        // 速度設定に応じた遅延時間
        const getCharDelay = (speed: string) => {
          switch (speed) {
            case 'fast': return 20   // 20ms (高速)
            case 'slow': return 60   // 60ms (ゆっくり)
            default: return 40       // 40ms (普通)
          }
        }
        const charDelay = getCharDelay(settings.streamingSpeed || 'normal')

        const displayCharacterByCharacter = async (newContent: string) => {
          if (newContent.length <= displayedContent.length) return

          const newChars = newContent.slice(displayedContent.length)
          for (const char of newChars) {
            displayedContent += char

            setMessages(prev => prev.map(msg =>
              msg.id === assistantMessage.id
                ? { ...msg, content: displayedContent }
                : msg
            ))

            await new Promise(resolve => setTimeout(resolve, charDelay))
          }
        }

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonStr = line.slice(6)
                  const data = JSON.parse(jsonStr)

                  if (data.error) {
                    throw new Error(data.error)
                  }

                  if (data.completed) {
                    setState('idle')
                    break
                  }

                  if (data.content !== undefined) {
                    // Display characters one by one with delay
                    await displayCharacterByCharacter(data.content)
                  }
                } catch (parseError) {
                  console.error('Error parsing streaming chunk:', parseError)
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
        }

      } else {
        // Non-streaming request with simulated streaming effect
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: newMessages,
            config: settings.geminiConfig,
            selectedResume: settings.selectedResume,
            streamingSpeed: settings.streamingSpeed
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'APIエラーが発生しました')
        }

        // Simulate smooth streaming effect
        setState('streaming')
        const fullContent = data.content
        const words = fullContent.split('')
        let currentContent = ''

        for (let i = 0; i < words.length; i++) {
          currentContent += words[i]

          // Update message with accumulated content
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: currentContent }
              : msg
          ))

          // Add delay for streaming effect (adjust speed here)
          if (i % 3 === 0) { // Every 3 characters
            await new Promise(resolve => setTimeout(resolve, 30)) // 30ms delay
          }
        }

        setState('idle')
      }
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessage = err instanceof Error ? err.message : 'チャットエラーが発生しました'
      setError(errorMessage)
      setState('error')
      showNotification(errorMessage, 'error')
    }
  }, [messages, state, settings.geminiConfig, settings.selectedResume])

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    setState('idle')
    createNewSession()
  }, [createNewSession])

  // Get all sessions
  const getAllSessions = useCallback(() => {
    return sessionsStorage.getAll().sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }, [])

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    sessionsStorage.delete(sessionId)
    
    if (currentSessionId === sessionId) {
      createNewSession()
    }
  }, [currentSessionId, createNewSession])

  return {
    messages,
    currentSessionId,
    state,
    error,
    isLoading: state === 'loading',
    sendMessage,
    clearMessages,
    createNewSession,
    loadSession,
    getAllSessions,
    deleteSession
  }
}