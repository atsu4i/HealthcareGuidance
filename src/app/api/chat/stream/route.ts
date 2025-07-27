// 📱 Personal AI Assistant - Streaming Chat API Route

import { NextRequest } from 'next/server'
import { GeminiClient } from '@/lib/gemini-client'
import { Message, GeminiConfig } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { messages, config }: { 
      messages: Message[]
      config: GeminiConfig 
    } = body

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'メッセージが必要です' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (!config || !config.apiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API設定が必要です' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate API key format
    if (!GeminiClient.isValidApiKey(config.apiKey)) {
      return new Response(
        JSON.stringify({ error: 'APIキーの形式が正しくありません' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Create streaming response
    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const geminiClient = new GeminiClient(config)
          
          let fullContent = ''
          
          await geminiClient.sendStreamingChatRequest(messages, (chunk: string) => {
            fullContent += chunk
            
            // Send chunk as Server-Sent Event
            const data = JSON.stringify({
              type: 'chunk',
              content: fullContent,
              timestamp: new Date().toISOString()
            })
            
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          })
          
          // Send completion signal
          const doneData = JSON.stringify({
            type: 'done',
            content: fullContent,
            timestamp: new Date().toISOString()
          })
          
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`))
          controller.close()
          
        } catch (error) {
          console.error('Streaming error:', error)
          
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown streaming error',
            timestamp: new Date().toISOString()
          })
          
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('Streaming API error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}