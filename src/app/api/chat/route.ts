// 📱 Personal AI Assistant - Chat API Route

import { NextRequest, NextResponse } from 'next/server'
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

    // Create Gemini client and send request
    const geminiClient = new GeminiClient(config)
    
    try {
      const response = await geminiClient.sendChatRequest(messages)
      
      return NextResponse.json({
        success: true,
        content: response,
        timestamp: new Date().toISOString()
      })
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      
      return NextResponse.json(
        { 
          error: 'AI応答の生成に失敗しました',
          details: geminiError instanceof Error ? geminiError.message : 'Unknown error'
        },
        { status: 500 }
      )
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