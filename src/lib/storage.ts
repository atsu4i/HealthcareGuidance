// 📱 Personal AI Assistant - LocalStorage Management

import { ChatSession, AppSettings, GeminiConfig, Message } from '@/types'

const STORAGE_KEYS = {
  SETTINGS: 'personal_ai_settings',
  CHAT_SESSIONS: 'personal_ai_chat_sessions',
  ACTIVE_SESSION: 'personal_ai_active_session'
} as const

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  geminiConfig: {
    apiKey: '',
    model: 'gemini-2.5-flash',
    temperature: 0.85,
    maxTokens: 4000
  },
  darkMode: false,
  saveHistory: true,
  autoTitle: true
}

// Settings management
export const settingsStorage = {
  get(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (!stored) return DEFAULT_SETTINGS
      
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_SETTINGS, ...parsed }
    } catch (error) {
      console.error('Settings load error:', error)
      return DEFAULT_SETTINGS
    }
  },

  set(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Settings save error:', error)
    }
  },

  update(updates: Partial<AppSettings>): AppSettings {
    const current = this.get()
    const updated = { ...current, ...updates }
    this.set(updated)
    return updated
  },

  reset(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
  }
}

// Chat sessions management
export const sessionsStorage = {
  getAll(): ChatSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS)
      if (!stored) return []
      
      const parsed = JSON.parse(stored)
      return parsed.map((session: ChatSession) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
    } catch (error) {
      console.error('Sessions load error:', error)
      return []
    }
  },

  save(sessions: ChatSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions))
    } catch (error) {
      console.error('Sessions save error:', error)
    }
  },

  add(session: ChatSession): void {
    const sessions = this.getAll()
    sessions.push(session)
    this.save(sessions)
  },

  update(sessionId: string, updates: Partial<ChatSession>): void {
    const sessions = this.getAll()
    const index = sessions.findIndex(s => s.id === sessionId)
    if (index >= 0) {
      sessions[index] = { ...sessions[index], ...updates, updatedAt: new Date() }
      this.save(sessions)
    }
  },

  delete(sessionId: string): void {
    const sessions = this.getAll().filter(s => s.id !== sessionId)
    this.save(sessions)
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.CHAT_SESSIONS)
  }
}

// Active session management
export const activeSessionStorage = {
  get(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION)
  },

  set(sessionId: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, sessionId)
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION)
  }
}

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const isValidApiKey = (apiKey: string): boolean => {
  return apiKey.length > 10 && apiKey.startsWith('AIza')
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}