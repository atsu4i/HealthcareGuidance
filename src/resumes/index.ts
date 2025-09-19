// 履歴書管理ユーティリティ
import { Resume } from '@/types'

// 利用可能な履歴書のリスト
export const AVAILABLE_RESUMES = [
  {
    id: 'entry-level-engineer',
    name: '新卒エンジニア（田中太郎）',
    description: '新卒のソフトウェアエンジニア向けの履歴書'
  },
  {
    id: 'senior-engineer',
    name: '中途エンジニア（佐藤花子）',
    description: '経験豊富なシニアエンジニア向けの履歴書'
  }
] as const

export type ResumeId = typeof AVAILABLE_RESUMES[number]['id']

// 履歴書を動的にロードする関数
export async function loadResume(resumeId: ResumeId): Promise<Resume | null> {
  try {
    switch (resumeId) {
      case 'entry-level-engineer': {
        const module = await import('./entry-level-engineer')
        return module.entryLevelEngineerResume
      }
      case 'senior-engineer': {
        const module = await import('./senior-engineer')
        return module.seniorEngineerResume
      }
      default:
        console.warn(`Unknown resume ID: ${resumeId}`)
        return null
    }
  } catch (error) {
    console.error(`Failed to load resume ${resumeId}:`, error)
    return null
  }
}

// 履歴書情報を取得する関数
export function getResumeInfo(resumeId: ResumeId) {
  return AVAILABLE_RESUMES.find(resume => resume.id === resumeId) || null
}

// 全ての履歴書情報を取得する関数
export function getAllResumeInfo() {
  return AVAILABLE_RESUMES
}