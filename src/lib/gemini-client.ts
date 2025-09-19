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
    streamEndpoint: '/v1beta/models/gemini-2.5-pro:streamGenerateContent',
    maxTokens: 4000
  },
  'gemini-2.5-flash': {
    name: '⚡ Gemini 2.5 Flash',
    endpoint: '/v1beta/models/gemini-2.5-flash:generateContent',
    streamEndpoint: '/v1beta/models/gemini-2.5-flash:streamGenerateContent',
    maxTokens: 8000
  },
  'gemini-2.5-flash-lite': {
    name: '💨 Gemini 2.5 Flash Lite',
    endpoint: '/v1beta/models/gemini-2.5-flash-lite:generateContent',
    streamEndpoint: '/v1beta/models/gemini-2.5-flash-lite:streamGenerateContent',
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
  private systemPrompt: string

  constructor(private config: GeminiConfig, systemPrompt?: string) {
    this.systemPrompt = systemPrompt || SYSTEM_PROMPT
    debug.log('GeminiClient initialized', {
      model: config.model,
      hasApiKey: !!config.apiKey,
      hasCustomPrompt: !!systemPrompt
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
          parts: [{ text: `${this.systemPrompt}\n\n---\n\nユーザー: ${msg.content}` }]
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

    const generationConfig: GeminiRequest['generationConfig'] = {
      temperature: this.config.temperature,
      maxOutputTokens: GEMINI_MODELS[this.config.model].maxTokens,
      topP: 0.92,
      topK: 50,
      // Add thinkingConfig for gemini-2.5-pro to improve response speed
      // Setting to minimum value (128) as per: https://ai.google.dev/gemini-api/docs/thinking
      ...(this.config.model === 'gemini-2.5-pro' && {
        thinkingConfig: {
          thinkingBudget: 128
        }
      })
    }

    if (this.config.model === 'gemini-2.5-pro') {
      console.log('Applied thinkingConfig.thinkingBudget=128 for gemini-2.5-pro to improve response speed')
    }

    return {
      contents: geminiMessages,
      generationConfig,
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
    const url = `${this.baseUrl}${modelConfig.streamEndpoint}?key=${this.config.apiKey}`
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

        // Process complete JSON objects
        let searchIndex = 0
        while (true) {
          const startIndex = buffer.indexOf('{', searchIndex)
          if (startIndex === -1) break

          let braceCount = 0
          let endIndex = -1

          // Find the matching closing brace
          for (let i = startIndex; i < buffer.length; i++) {
            if (buffer[i] === '{') braceCount++
            else if (buffer[i] === '}') {
              braceCount--
              if (braceCount === 0) {
                endIndex = i
                break
              }
            }
          }

          if (endIndex === -1) {
            // Incomplete JSON object, wait for more data
            searchIndex = startIndex + 1
            break
          }

          // Extract and parse complete JSON object
          const jsonString = buffer.slice(startIndex, endIndex + 1)
          try {
            const data = JSON.parse(jsonString)
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text

            if (content) {
              // Send only the delta content - client will accumulate
              onChunk(content)
            }
          } catch (parseError) {
            debug.log('Skipping invalid JSON:', jsonString.substring(0, 100) + '...')
          }

          // Remove processed JSON from buffer
          buffer = buffer.slice(endIndex + 1)
          searchIndex = 0
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