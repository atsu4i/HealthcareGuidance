// 📱 Personal AI Assistant - Chat Hook

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Message, ChatSession, ChatState, AppSettings } from '@/types'
import { sessionsStorage, activeSessionStorage, generateId } from '@/lib/storage'
import { generateTitleFromMessage } from '@/lib/utils'
import { showNotification } from '@/lib/utils'
import { getScenarioInfo, type ScenarioId } from '@/scenarios'

// 面談終了を示すキーワードパターン
const SESSION_END_PATTERNS = [
  /面談.*終了/,
  /今日.*これで.*終/,
  /終わり.*しましょう/,
  /ありがとうございました.*失礼/,
  /お疲れ.*さま.*でした/
]

interface UseChatProps {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  skipInitialSession?: boolean
}

export function useChat({ settings, updateSettings, skipInitialSession = false }: UseChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [state, setState] = useState<ChatState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [sessionEnded, setSessionEnded] = useState(false)

  // Initialize or load session
  useEffect(() => {
    const activeSessionId = activeSessionStorage.get()

    if (skipInitialSession && !activeSessionId) {
      // Skip initial session creation if skipInitialSession is true AND there's no active session
      return
    }

    if (activeSessionId) {
      const sessions = sessionsStorage.getAll()
      const session = sessions.find(s => s.id === activeSessionId)

      if (session) {
        setCurrentSessionId(activeSessionId)
        setMessages(session.messages)
        activeSessionStorage.set(activeSessionId)

        // Restore the scenario selection if available
        if (session.scenarioId && session.scenarioId !== settings.selectedResume) {
          updateSettings({ selectedResume: session.scenarioId })
        }
      } else {
        // Create initial session
        const sessionId = generateId()
        let initialContent = '現在、保健指導のシナリオが選択されていません。\n\n設定画面（⚙️）からシナリオを選択してください。シナリオを選択すると、その対象者との模擬保健指導面談が始まります。'
        let sessionTitle = '新しいチャット'

        if (settings.selectedResume) {
          const scenarioInfo = getScenarioInfo(settings.selectedResume as ScenarioId)
          if (scenarioInfo) {
            initialContent = `こんにちは。\n\n今日は保健指導ということで呼ばれましたが…何の話でしょうか？`
            sessionTitle = scenarioInfo.name
          }
        }

        const initialMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: initialContent,
          timestamp: new Date()
        }

        setSessionEnded(false)

        const session: ChatSession = {
          id: sessionId,
          title: sessionTitle,
          messages: [initialMessage],
          createdAt: new Date(),
          updatedAt: new Date(),
          scenarioId: settings.selectedResume || undefined
        }

        sessionsStorage.add(session)
        activeSessionStorage.set(sessionId)
        setCurrentSessionId(sessionId)
        setMessages([initialMessage])
        setError(null)
      }
    } else {
      // Create initial session
      const sessionId = generateId()
      let initialContent = '現在、保健指導のシナリオが選択されていません。\n\n設定画面（⚙️）からシナリオを選択してください。シナリオを選択すると、その対象者との模擬保健指導面談が始まります。'
      let sessionTitle = '新しいチャット'

      if (settings.selectedResume) {
        const scenarioInfo = getScenarioInfo(settings.selectedResume as ScenarioId)
        if (scenarioInfo) {
          initialContent = `こんにちは。\n\n今日は保健指導ということで呼ばれましたが…何の話でしょうか？`
          sessionTitle = scenarioInfo.name
        }
      }

      const initialMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: initialContent,
        timestamp: new Date()
      }

      setSessionEnded(false)

      const session: ChatSession = {
        id: sessionId,
        title: sessionTitle,
        messages: [initialMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
        scenarioId: settings.selectedResume || undefined
      }

      sessionsStorage.add(session)
      activeSessionStorage.set(sessionId)
      setCurrentSessionId(sessionId)
      setMessages([initialMessage])
      setError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Create new session with initial system message
  const createNewSession = useCallback(() => {
    const sessionId = generateId()

    // Generate initial message and title based on scenario selection
    let initialContent = '現在、保健指導のシナリオが選択されていません。\n\n設定画面（⚙️）からシナリオを選択してください。シナリオを選択すると、その対象者との模擬保健指導面談が始まります。'
    let sessionTitle = '新しいチャット'

    if (settings.selectedResume) {
      // selectedResumeはシナリオIDとして使用
      const scenarioInfo = getScenarioInfo(settings.selectedResume as ScenarioId)
      if (scenarioInfo) {
        initialContent = `こんにちは。\n\n今日は保健指導ということで呼ばれましたが…何の話でしょうか？`
        sessionTitle = scenarioInfo.name
      }
    }

    // Create initial system message
    const initialMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: initialContent,
      timestamp: new Date()
    }

    setSessionEnded(false)

    const session: ChatSession = {
      id: sessionId,
      title: sessionTitle,
      messages: [initialMessage],
      createdAt: new Date(),
      updatedAt: new Date(),
      scenarioId: settings.selectedResume || undefined
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

      // Restore the scenario selection if available
      if (session.scenarioId && session.scenarioId !== settings.selectedResume) {
        updateSettings({ selectedResume: session.scenarioId })
      }
    } else {
      // Session not found, create a new one
      const newSessionId = generateId()
      let initialContent = '現在、保健指導のシナリオが選択されていません。\n\n設定画面（⚙️）からシナリオを選択してください。シナリオを選択すると、その対象者との模擬保健指導面談が始まります。'
      let sessionTitle = '新しいチャット'

      if (settings.selectedResume) {
        const scenarioInfo = getScenarioInfo(settings.selectedResume as ScenarioId)
        if (scenarioInfo) {
          initialContent = `こんにちは。\n\n今日は保健指導ということで呼ばれましたが…何の話でしょうか？`
          sessionTitle = scenarioInfo.name
        }
      }

      const initialMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: initialContent,
        timestamp: new Date()
      }

      setSessionEnded(false)

      const newSession: ChatSession = {
        id: newSessionId,
        title: sessionTitle,
        messages: [initialMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
        scenarioId: settings.selectedResume || undefined
      }

      sessionsStorage.add(newSession)
      activeSessionStorage.set(newSessionId)
      setCurrentSessionId(newSessionId)
      setMessages([initialMessage])
      setError(null)
    }
  }, [settings.selectedResume, updateSettings])

  // Save current session
  const saveCurrentSession = useCallback(() => {
    if (!currentSessionId) return

    const sessions = sessionsStorage.getAll()
    const sessionIndex = sessions.findIndex(s => s.id === currentSessionId)

    if (sessionIndex >= 0) {
      // Update existing session (keep the original title)
      sessionsStorage.update(currentSessionId, {
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

  // Check if message indicates session end
  const checkSessionEnd = (content: string): boolean => {
    return SESSION_END_PATTERNS.some(pattern => pattern.test(content))
  }

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

    // Check if this message indicates session end
    const isEndingSession = checkSessionEnd(content.trim())

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
            streamingSpeed: settings.streamingSpeed,
            isEndingSession
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

        // If session ended, request feedback
        if (isEndingSession) {
          setSessionEnded(true)
          await requestFeedback(newMessages, userMessage, assistantMessage)
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
            streamingSpeed: settings.streamingSpeed,
            isEndingSession
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

        // If session ended, request feedback
        if (isEndingSession) {
          setSessionEnded(true)
          await requestFeedback(newMessages, userMessage, assistantMessage)
        }
      }
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessage = err instanceof Error ? err.message : 'チャットエラーが発生しました'
      setError(errorMessage)
      setState('error')
      showNotification(errorMessage, 'error')
    }
  }, [messages, state, settings.geminiConfig, settings.selectedResume])

  // Request feedback on the session
  const requestFeedback = async (conversationMessages: Message[], userMessage: Message, assistantMessage: Message) => {
    try {
      setState('loading')

      // Add feedback request message with loading indicator
      const feedbackMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '面談は終了しました。\n\n現在フィードバックを作成中です...',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, feedbackMessage])

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: conversationMessages,
          config: settings.geminiConfig,
          selectedResume: settings.selectedResume
        })
      })

      if (!response.ok) {
        throw new Error('フィードバックの生成に失敗しました')
      }

      const data = await response.json()

      // Update feedback message with content
      setMessages(prev => prev.map(msg =>
        msg.id === feedbackMessage.id
          ? { ...msg, content: `## 📊 面談フィードバック\n\n${data.feedback}` }
          : msg
      ))

      setState('idle')
      showNotification('フィードバックを生成しました', 'success')
    } catch (err) {
      console.error('Feedback error:', err)
      showNotification('フィードバックの生成に失敗しました', 'error')
      setState('idle')
    }
  }

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

  // Refresh sessions (force re-read from storage)
  const refreshSessions = useCallback(() => {
    // This is a no-op function that just triggers re-render when needed
    // The actual refresh happens in getAllSessions() which reads from storage
  }, [])

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    sessionsStorage.delete(sessionId)

    if (currentSessionId === sessionId) {
      // Session being deleted is the current one, create a new session
      const newSessionId = generateId()
      let initialContent = '現在、保健指導のシナリオが選択されていません。\n\n設定画面（⚙️）からシナリオを選択してください。シナリオを選択すると、その対象者との模擬保健指導面談が始まります。'
      let sessionTitle = '新しいチャット'

      if (settings.selectedResume) {
        const scenarioInfo = getScenarioInfo(settings.selectedResume as ScenarioId)
        if (scenarioInfo) {
          initialContent = `こんにちは。\n\n今日は保健指導ということで呼ばれましたが…何の話でしょうか？`
          sessionTitle = scenarioInfo.name
        }
      }

      const initialMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: initialContent,
        timestamp: new Date()
      }

      setSessionEnded(false)

      const session: ChatSession = {
        id: newSessionId,
        title: sessionTitle,
        messages: [initialMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
        scenarioId: settings.selectedResume || undefined
      }

      sessionsStorage.add(session)
      activeSessionStorage.set(newSessionId)
      setCurrentSessionId(newSessionId)
      setMessages([initialMessage])
      setError(null)
    }
  }, [currentSessionId, settings.selectedResume])

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
    deleteSession,
    refreshSessions
  }
}