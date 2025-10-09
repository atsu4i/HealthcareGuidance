// 📱 Health Guidance Simulation - Feedback API Route

import { NextRequest, NextResponse } from 'next/server'
import { GeminiClient } from '@/lib/gemini-client'
import { Message, GeminiConfig } from '@/types'
import { loadScenario, type ScenarioId } from '@/scenarios'

const FEEDBACK_PROMPT = `あなたは保健師教育の専門家です。以下の保健指導面談の会話ログを分析し、保健師（ユーザー）の対応について、建設的なフィードバックを提供してください。

## フィードバックの観点

### 1. コミュニケーション技術
- 傾聴の姿勢（オープンクエスチョン、共感的応答）
- ラポール形成
- 非言語的メッセージへの配慮

### 2. 動機づけ面接技法
- 対象者の準備性の見極め
- 自己効力感の向上
- 変化への意欲の引き出し方

### 3. 情報提供と教育
- 健康情報の正確性
- 説明のわかりやすさ
- 対象者のレベルに合わせた説明

### 4. 目標設定と行動計画
- 具体的で実現可能な目標設定
- 対象者主体の計画立案
- 障壁への対処

### 5. 対応の適切性
- 対象者の応答スタイルへの対応
- 防衛的態度への対処
- タイミングと優先順位

## フィードバック形式

以下の形式でフィードバックを提供してください：

**良かった点（2-3点）**
- 具体的な発言や対応を引用して評価

**改善点（2-3点）**
- より良いアプローチの提案
- 具体的な代替案や例示

**総合評価**
- 全体的な面談の質
- 特に注目すべき点

フィードバックは建設的で、具体的で、実践的なアドバイスを含めてください。`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { messages, config, selectedResume }: {
      messages: Message[]
      config: GeminiConfig
      selectedResume?: string | null
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

    // Get scenario information
    let scenarioContext = ''
    if (selectedResume) {
      try {
        const scenario = loadScenario(selectedResume as ScenarioId)
        if (scenario) {
          scenarioContext = `
## 対象者のプロフィール
- 名前: ${scenario.personalInfo.fullName}
${'responseStyle' in scenario.psychologicalProfile ? `- 応答スタイル: ${scenario.psychologicalProfile.responseStyle}
- 性格: ${scenario.psychologicalProfile.personality}` : `- 指導への態度: ${'attitudeTowardGuidance' in scenario.psychologicalProfile ? scenario.psychologicalProfile.attitudeTowardGuidance : ''}`}
- 動機づけレベル: ${scenario.psychologicalProfile.motivationLevel}

## このシナリオの特徴
${scenario.backgroundStory}

## 期待される指導目標
${scenario.guidanceGoals.join('、')}

## 想定される課題
${scenario.expectedChallenges.join('、')}
`
        }
      } catch (error) {
        console.error('Failed to load scenario:', error)
      }
    }

    // Format conversation for feedback
    const conversationLog = messages
      .map(msg => {
        const role = msg.role === 'user' ? '保健師' : '対象者'
        return `**${role}**: ${msg.content}`
      })
      .join('\n\n')

    // Create feedback request
    const feedbackRequest: Message[] = [
      {
        id: 'feedback-request',
        role: 'user',
        content: `${FEEDBACK_PROMPT}

${scenarioContext}

## 面談の会話ログ

${conversationLog}

上記の面談について、詳細なフィードバックをお願いします。`,
        timestamp: new Date()
      }
    ]

    // Create Gemini client for feedback
    const geminiClient = new GeminiClient(config)

    try {
      const feedback = await geminiClient.sendChatRequest(feedbackRequest)

      return NextResponse.json({
        success: true,
        feedback,
        timestamp: new Date().toISOString()
      })
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)

      return NextResponse.json(
        {
          error: 'フィードバックの生成に失敗しました',
          details: geminiError instanceof Error ? geminiError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Feedback API error:', error)

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
