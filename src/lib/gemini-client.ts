// 📱 Personal AI Assistant - Gemini API Client

import { 
  Message, 
  GeminiConfig, 
  GeminiRequest, 
  GeminiResponse, 
  ApiError 
} from '@/types'
import { debug } from './utils'
import { SYSTEM_PROMPT } from './system-prompt'

// Gemini API models configuration
export const GEMINI_MODELS = {
  'gemini-2.5-pro': {
    name: '🔮 Gemini 2.5 Pro',
    endpoint: '/v1beta/models/gemini-2.5-pro:generateContent',
    maxTokens: 4000
  },
  'gemini-2.5-flash': {
    name: '⚡ Gemini 2.5 Flash', 
    endpoint: '/v1beta/models/gemini-2.5-flash:generateContent',
    maxTokens: 8000
  },
  'gemini-2.5-flash-lite': {
    name: '💨 Gemini 2.5 Flash Lite',
    endpoint: '/v1beta/models/gemini-2.5-flash-lite:generateContent', 
    maxTokens: 8000
  }
} as const

// Default safety settings
const DEFAULT_SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_NONE"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_NONE"
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", 
    threshold: "BLOCK_NONE"
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_NONE"
  }
]

export class GeminiClient {
  private baseUrl = 'https://generativelanguage.googleapis.com'

  constructor(private config: GeminiConfig) {
    debug.log('GeminiClient initialized', {
      model: config.model,
      hasApiKey: !!config.apiKey
    })
  }

  // Update configuration
  updateConfig(config: Partial<GeminiConfig>) {
    this.config = { ...this.config, ...config }
    debug.log('GeminiClient config updated', this.config)
  }

  // Convert OpenAI-style messages to Gemini format with system prompt
  private convertToGeminiFormat(messages: Message[]) {
    const geminiMessages = []
    
    // Add system prompt only for the first user message in conversation
    let isFirstUserMessage = true
    
    for (const msg of messages) {
      if (msg.role === 'user' && isFirstUserMessage) {
        // First user message - prepend system prompt
        geminiMessages.push({
          role: 'user' as const,
          parts: [{ text: `${SYSTEM_PROMPT}\n\n---\n\nユーザー: ${msg.content}` }]
        })
        isFirstUserMessage = false
      } else {
        // Regular message conversion
        geminiMessages.push({
          role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
          parts: [{ text: msg.content }]
        })
      }
    }
    
    return geminiMessages
  }

  // Build request body
  private buildRequestBody(messages: Message[]): GeminiRequest {
    const geminiMessages = this.convertToGeminiFormat(messages)
    
    return {
      contents: geminiMessages,
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: GEMINI_MODELS[this.config.model].maxTokens,
        topP: 0.92,
        topK: 50
      },
      safetySettings: DEFAULT_SAFETY_SETTINGS
    }
  }

  // Test API connection
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.config.apiKey) {
        return { success: false, error: 'APIキーが設定されていません' }
      }

      const testUrl = `${this.baseUrl}/v1beta/models?key=${this.config.apiKey}`
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        debug.log('Gemini connection test successful', response.status)
        return { success: true }
      } else {
        const errorText = await response.text()
        debug.error('Gemini connection test failed', errorText)
        return { 
          success: false, 
          error: `接続エラー: ${response.status} ${response.statusText}` 
        }
      }
    } catch (error) {
      debug.error('Gemini connection test error', error)
      return { 
        success: false, 
        error: `接続エラー: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }
    }
  }

  // Send chat request
  async sendChatRequest(messages: Message[]): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Gemini APIキーが設定されていません')
    }

    const modelConfig = GEMINI_MODELS[this.config.model]
    const url = `${this.baseUrl}${modelConfig.endpoint}?key=${this.config.apiKey}`
    const requestBody = this.buildRequestBody(messages)

    debug.log('Gemini API request', {
      url: url.replace(this.config.apiKey, '***'),
      model: this.config.model,
      messagesCount: messages.length
    })

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        debug.error('Gemini API error', { status: response.status, error: errorText })
        throw new Error(`Gemini API エラー: ${response.status} - ${errorText}`)
      }

      const data: GeminiResponse = await response.json()
      debug.log('Gemini API response', data)

      // Extract response content
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (!content) {
        throw new Error('Gemini APIからの応答が空です')
      }

      return content
    } catch (error) {
      debug.error('Gemini API request failed', error)
      
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error('Gemini API リクエストに失敗しました')
      }
    }
  }

  // Send real streaming chat request
  async sendStreamingChatRequest(
    messages: Message[],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    if (!this.config.apiKey) {
      throw new Error('Gemini APIキーが設定されていません')
    }

    const modelConfig = GEMINI_MODELS[this.config.model]
    const url = `${this.baseUrl}${modelConfig.endpoint}?alt=sse&key=${this.config.apiKey}`
    const requestBody = this.buildRequestBody(messages)

    debug.log('Gemini Streaming API request', {
      url: url.replace(this.config.apiKey, '***'),
      model: this.config.model,
      messagesCount: messages.length
    })

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        debug.error('Gemini Streaming API error', { status: response.status, error: errorText })
        throw new Error(`Gemini Streaming API エラー: ${response.status} - ${errorText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('ストリーミングレスポンスが読み取れません')
      }

      const decoder = new TextDecoder()
      let buffer = ''

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
              if (jsonStr.trim() === '[DONE]') continue
              
              const data = JSON.parse(jsonStr)
              const content = data.candidates?.[0]?.content?.parts?.[0]?.text
              
              if (content) {
                onChunk(content)
              }
            } catch (parseError) {
              debug.error('Error parsing streaming chunk', parseError)
            }
          }
        }
      }

      reader.releaseLock()
    } catch (error) {
      debug.error('Gemini Streaming API request failed', error)
      
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error('Gemini Streaming API リクエストに失敗しました')
      }
    }
  }

  // Get available models
  getAvailableModels() {
    return Object.keys(GEMINI_MODELS).map(key => ({
      id: key,
      name: GEMINI_MODELS[key as keyof typeof GEMINI_MODELS].name
    }))
  }

  // Validate API key format
  static isValidApiKey(apiKey: string): boolean {
    return apiKey.length > 10 && apiKey.startsWith('AIza')
  }
}