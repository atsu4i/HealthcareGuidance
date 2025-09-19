// 📱 Personal AI Assistant - Chat API Route

import { NextRequest, NextResponse } from 'next/server'
import { GeminiClient } from '@/lib/gemini-client'
import { Message, GeminiConfig } from '@/types'
import { loadResume } from '@/resumes'
import { generateInterviewPrompt, DEFAULT_PROMPT } from '@/lib/system-prompt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const useStreaming = searchParams.get('stream') === 'true'

    const { messages, config, selectedResume, streamingSpeed }: {
      messages: Message[]
      config: GeminiConfig
      selectedResume?: string | null
      streamingSpeed?: 'fast' | 'normal' | 'slow'
    } = body

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      )
    }

    if (!config || !config.apiKey) {
      return NextResponse.json(
        { error: 'Gemini API設定が必要です' },
        { status: 400 }
      )
    }

    // Validate API key format
    if (!GeminiClient.isValidApiKey(config.apiKey)) {
      return NextResponse.json(
        { error: 'APIキーの形式が正しくありません' },
        { status: 400 }
      )
    }

    // Generate system prompt based on selected resume
    let systemPrompt = DEFAULT_PROMPT
    if (selectedResume) {
      try {
        const resume = await loadResume(selectedResume as any)
        if (resume) {
          systemPrompt = generateInterviewPrompt(resume)
        }
      } catch (error) {
        console.error('Failed to load resume:', error)
        // Continue with default prompt
      }
    }

    // Create Gemini client
    const geminiClient = new GeminiClient(config, systemPrompt)

    try {
      if (useStreaming) {
        // Real streaming response
        const stream = new ReadableStream({
          async start(controller) {
            try {
              let fullContent = ''

              await geminiClient.sendStreamingChatRequest(
                messages,
                (chunk: string) => {
                  fullContent += chunk
                  // Send the full accumulated content as Server-Sent Events
                  const data = JSON.stringify({
                    content: fullContent,
                    timestamp: new Date().toISOString()
                  })
                  controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
                }
              )

              // Send completion signal
              controller.enqueue(
                new TextEncoder().encode(`data: {"completed": true}\n\n`)
              )
              controller.close()
            } catch (error) {
              console.error('Streaming error:', error)
              const errorData = JSON.stringify({
                error: 'AI応答の生成に失敗しました',
                details: error instanceof Error ? error.message : 'Unknown error'
              })
              controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`))
              controller.close()
            }
          },
        })

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          },
        })
      } else {
        // Non-streaming response (existing behavior)
        const response = await geminiClient.sendChatRequest(messages)

        return NextResponse.json({
          success: true,
          content: response,
          timestamp: new Date().toISOString()
        })
      }
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)

      if (useStreaming) {
        return new Response(
          JSON.stringify({
            error: 'AI応答の生成に失敗しました',
            details: geminiError instanceof Error ? geminiError.message : 'Unknown error'
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      } else {
        return NextResponse.json(
          {
            error: 'AI応答の生成に失敗しました',
            details: geminiError instanceof Error ? geminiError.message : 'Unknown error'
          },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error('Chat API error:', error)
    
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}