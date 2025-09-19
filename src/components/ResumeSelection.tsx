// 📱 AI Mock Interview - Resume Selection Component

'use client'

import { useState, useEffect } from 'react'
import { getAllResumeInfo, type ResumeId, loadResume } from '@/resumes'
import { AppSettings, Resume } from '@/types'
import { useChat } from '@/hooks/useChat'
import ResumeModal from './ResumeModal'

interface ResumeSelectionProps {
  settings: AppSettings
  onUpdateSettings: (updates: Partial<AppSettings>) => void
  onSelectResume: (resumeId: ResumeId) => void
  isValidApiKey: boolean
  onOpenSettings?: () => void
  onOpenHistory?: () => void
}

export default function ResumeSelection({
  settings,
  onUpdateSettings,
  onSelectResume,
  isValidApiKey,
  onOpenSettings,
  onOpenHistory
}: ResumeSelectionProps) {
  const [isResumePreviewOpen, setIsResumePreviewOpen] = useState(false)
  const [previewResume, setPreviewResume] = useState<Resume | null>(null)
  const availableResumes = getAllResumeInfo()

  // Debug state changes
  useEffect(() => {
    console.log('ResumeSelection state changes:', {
      isResumePreviewOpen,
      previewResume: previewResume?.id || null
    })
  }, [isResumePreviewOpen, previewResume])

  const handleRandomSelect = () => {
    const randomIndex = Math.floor(Math.random() * availableResumes.length)
    const randomResume = availableResumes[randomIndex]
    onSelectResume(randomResume.id as ResumeId)
  }

  const handlePreviewResume = async (resumeId: ResumeId) => {
    console.log('Resume preview button clicked for:', resumeId)
    try {
      const resume = await loadResume(resumeId)
      console.log('Resume loaded:', resume)
      setPreviewResume(resume)
      setIsResumePreviewOpen(true)
      console.log('Modal should be open now')
    } catch (error) {
      console.error('Failed to load resume for preview:', error)
    }
  }

  return (
    <>
      <div className="
        min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
        flex flex-col
      ">
        {/* Header */}
        <div className="
          flex items-center justify-between
          px-6 py-4 pt-safe-top
          bg-white/80 dark:bg-gray-900/80
          backdrop-blur-md
          border-b border-gray-200/20 dark:border-gray-700/20
        ">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              🎯 模擬面接
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              履歴書を選択して面接を開始
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                console.log('History button clicked')
                if (onOpenHistory) {
                  onOpenHistory()
                }
              }}
              className="
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                bg-white/90 dark:bg-gray-800/90
                hover:bg-white dark:hover:bg-gray-700
                active:scale-95
                transition-all duration-150
                text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
                shadow-sm border border-gray-200/50 dark:border-gray-600/50
              "
              title="面接履歴"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="text-xs font-medium">履歴</span>
            </button>
            <button
              onClick={() => {
                console.log('Settings button clicked')
                if (onOpenSettings) {
                  onOpenSettings()
                }
              }}
              className="
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                bg-white/90 dark:bg-gray-800/90
                hover:bg-white dark:hover:bg-gray-700
                active:scale-95
                transition-all duration-150
                text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
                shadow-sm border border-gray-200/50 dark:border-gray-600/50
              "
              title="設定"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-medium">設定</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="
          flex-1 overflow-y-auto
          px-6 py-8
          max-w-lg mx-auto w-full
        ">
          {/* API Key Warning */}
          {!isValidApiKey && (
            <div className="
              mb-8 p-6 rounded-xl
              bg-amber-50 dark:bg-amber-900/20
              border border-amber-200 dark:border-amber-800
            ">
              <div className="flex items-start gap-3">
                <div className="text-amber-600 dark:text-amber-400 mt-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                    Gemini APIキーが必要です
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                    面接を開始するには、設定からGemini APIキーを入力してください。
                  </p>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="
                      px-4 py-2 rounded-lg
                      bg-amber-600 hover:bg-amber-700
                      text-white text-sm font-medium
                      transition-colors
                    "
                  >
                    設定を開く
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Random Selection */}
          <div className="mb-8">
            <button
              onClick={handleRandomSelect}
              disabled={!isValidApiKey}
              className="
                w-full p-6 rounded-xl
                bg-gradient-to-r from-purple-500 to-pink-500
                hover:from-purple-600 hover:to-pink-600
                disabled:from-gray-300 disabled:to-gray-400
                disabled:cursor-not-allowed
                text-white
                active:scale-98
                transition-all duration-200
                shadow-lg hover:shadow-xl
              "
            >
              <div className="flex items-center justify-center gap-3">
                <div className="text-2xl">🎲</div>
                <div>
                  <div className="font-bold text-lg">ランダム選択</div>
                  <div className="text-sm opacity-90">履歴書をランダムに選んで面接開始</div>
                </div>
              </div>
            </button>
          </div>

          {/* Resume List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              📋 履歴書を選択
            </h2>

            {availableResumes.map((resume) => (
              <div
                key={resume.id}
                className="
                  w-full p-6 rounded-xl
                  bg-white dark:bg-gray-800
                  border-2 border-gray-200 dark:border-gray-700
                  shadow-sm hover:shadow-md
                  transition-all duration-200
                "
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl mt-1">
                    {resume.id === 'entry-level-engineer' ? '🌱' : '⭐'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {resume.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {resume.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handlePreviewResume(resume.id as ResumeId)}
                        className="
                          flex items-center gap-2 px-4 py-2 rounded-lg
                          bg-gray-100 dark:bg-gray-700
                          hover:bg-gray-200 dark:hover:bg-gray-600
                          text-gray-700 dark:text-gray-300
                          text-sm font-medium
                          transition-colors
                        "
                        title="履歴書を確認"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        確認
                      </button>

                      <button
                        onClick={() => onSelectResume(resume.id as ResumeId)}
                        disabled={!isValidApiKey}
                        className="
                          flex items-center gap-2 px-4 py-2 rounded-lg
                          bg-blue-500 hover:bg-blue-600
                          disabled:bg-gray-300 disabled:cursor-not-allowed
                          text-white text-sm font-medium
                          transition-colors
                        "
                        title="面接を開始"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7-7h8a2 2 0 012 2v8M5 3a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                        </svg>
                        面接開始
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Space */}
          <div className="h-8"></div>
        </div>
      </div>

      {/* Resume Preview Modal - Keep only this one local */}
      <ResumeModal
        isOpen={isResumePreviewOpen}
        onClose={() => {
          console.log('Resume modal closing')
          setIsResumePreviewOpen(false)
        }}
        resume={previewResume}
      />
    </>
  )
}