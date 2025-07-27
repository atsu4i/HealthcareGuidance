// 📱 Personal AI Assistant - Chat Hook

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message, ChatSession, ChatState, GeminiConfig } from '@/types'
import { sessionsStorage, activeSessionStorage, generateId } from '@/lib/storage'
import { generateTitleFromMessage } from '@/lib/utils'
import { showNotification } from '@/lib/utils'

export function useChat(geminiConfig: GeminiConfig) {
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
    
    // Create initial system message
    const initialMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: 'こんにちは！万事私にお任せ下さい。あなたの献身的なメイドとして、心を込めてお仕えいたします。何かお手伝いできることはございますか？',
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
  }, [])

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
    if (!geminiConfig.apiKey) {
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
      // Call regular API first to get full response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: newMessages,
          config: geminiConfig
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'APIエラーが発生しました')
      }

      // Simulate smooth streaming effect
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
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessage = err instanceof Error ? err.message : 'チャットエラーが発生しました'
      setError(errorMessage)
      setState('error')
      showNotification(errorMessage, 'error')
    }
  }, [messages, state, geminiConfig])

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