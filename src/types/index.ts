// 📱 Personal AI Assistant - Type Definitions

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface GeminiConfig {
  apiKey: string
  model: 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite'
  temperature: number
  maxTokens: number
}

export interface AppSettings {
  geminiConfig: GeminiConfig
  darkMode: boolean
  saveHistory: boolean
  autoTitle: boolean
}

export interface GeminiRequest {
  contents: {
    role: 'user' | 'model'
    parts: { text: string }[]
  }[]
  generationConfig: {
    temperature: number
    maxOutputTokens: number
    topP: number
    topK: number
  }
  safetySettings: {
    category: string
    threshold: string
  }[]
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
      role: string
    }
    finishReason: string
  }[]
}

export interface ApiError {
  error: string
  details?: string
  status?: number
}

export type ChatState = 'idle' | 'loading' | 'streaming' | 'error'

export interface UseChat {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  state: ChatState
}

export interface UseSettings {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  resetSettings: () => void
  isValidApiKey: boolean
}