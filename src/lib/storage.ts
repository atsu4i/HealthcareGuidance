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
  autoTitle: true,
  selectedResume: null,
  enableStreaming: true,
  streamingSpeed: 'normal'
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

// Export/Import functionality
export interface ExportData {
  version: string
  exportDate: string
  sessions: ChatSession[]
  settings?: AppSettings
}

export const exportStorage = {
  // Export all chat sessions to JSON file
  exportSessions(): void {
    try {
      const sessions = sessionsStorage.getAll()
      const settings = settingsStorage.get()

      const exportData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        sessions,
        settings: {
          ...settings,
          geminiConfig: {
            ...settings.geminiConfig,
            apiKey: '' // Don't export API key for security
          }
        }
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `health-guidance-sessions-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      throw new Error('エクスポートに失敗しました')
    }
  },

  // Import chat sessions from JSON file
  async importSessions(file: File): Promise<{
    success: boolean
    message: string
    importedCount?: number
  }> {
    try {
      const text = await file.text()
      const importData: ExportData = JSON.parse(text)

      // Validate data structure
      if (!importData.version || !importData.sessions || !Array.isArray(importData.sessions)) {
        throw new Error('無効なファイル形式です')
      }

      // Validate and convert sessions
      const validSessions: ChatSession[] = importData.sessions
        .filter(session => {
          return session.id &&
                 session.title &&
                 session.messages &&
                 Array.isArray(session.messages) &&
                 session.createdAt &&
                 session.updatedAt
        })
        .map(session => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }))

      if (validSessions.length === 0) {
        throw new Error('有効なセッションが見つかりませんでした')
      }

      // Get existing sessions
      const existingSessions = sessionsStorage.getAll()
      const existingIds = new Set(existingSessions.map(s => s.id))

      // Filter out duplicate sessions (by ID)
      const newSessions = validSessions.filter(s => !existingIds.has(s.id))

      // Merge and save
      const allSessions = [...existingSessions, ...newSessions]
      sessionsStorage.save(allSessions)

      return {
        success: true,
        message: `${newSessions.length}件のセッションをインポートしました`,
        importedCount: newSessions.length
      }
    } catch (error) {
      console.error('Import error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'インポートに失敗しました'
      }
    }
  },

  // Export single session
  exportSession(sessionId: string): void {
    try {
      const sessions = sessionsStorage.getAll()
      const session = sessions.find(s => s.id === sessionId)

      if (!session) {
        throw new Error('セッションが見つかりません')
      }

      const exportData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        sessions: [session]
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `session-${session.title.replace(/[/\\?%*:|"<>]/g, '-')}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export session error:', error)
      throw new Error('セッションのエクスポートに失敗しました')
    }
  }
}