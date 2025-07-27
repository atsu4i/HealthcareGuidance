// 📱 Personal AI Assistant - Chat History Modal Component

'use client'

import { useState } from 'react'
import { ChatSession } from '@/types'
import { formatDate } from '@/lib/storage'
import { showNotification } from '@/lib/utils'

interface ChatHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  sessions: ChatSession[]
  onLoadSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
}

export default function ChatHistoryModal({ 
  isOpen, 
  onClose, 
  sessions,
  onLoadSession,
  onDeleteSession
}: ChatHistoryModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  if (!isOpen) return null

  const handleLoadSession = (sessionId: string) => {
    onLoadSession(sessionId)
    onClose()
    showNotification('会話を再開しました', 'success')
  }

  const handleDeleteSession = (sessionId: string) => {
    onDeleteSession(sessionId)
    setShowDeleteConfirm(null)
    showNotification('会話を削除しました', 'success')
  }

  const getPreviewText = (session: ChatSession): string => {
    const userMessages = session.messages.filter(m => m.role === 'user')
    if (userMessages.length === 0) return 'システムメッセージのみ'
    return userMessages[0].content.slice(0, 50) + (userMessages[0].content.length > 50 ? '...' : '')
  }

  const getMessageCount = (session: ChatSession): { user: number, total: number } => {
    const userCount = session.messages.filter(m => m.role === 'user').length
    return { user: userCount, total: session.messages.length }
  }

  return (
    <div className="
      fixed inset-0 z-50 
      bg-white dark:bg-gray-900 
      h-full w-full 
      flex flex-col
      animate-fade-in
    ">
      {/* Header */}
      <header className="
        flex items-center justify-between 
        px-4 py-4
        bg-white dark:bg-gray-900
        border-b border-gray-200 dark:border-gray-700
        shadow-sm
      ">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          会話履歴
        </h1>
        <button
          onClick={onClose}
          className="
            p-2 rounded-full
            hover:bg-gray-100 dark:hover:bg-gray-800
            active:scale-95
            transition-all duration-150
            text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
          "
          title="閉じる"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Content */}
      <div className="
        flex-1 overflow-y-auto p-4
        bg-gray-50 dark:bg-gray-800
        max-w-md mx-auto w-full
      ">
        {sessions.length === 0 ? (
          /* Empty State */
          <div className="
            flex flex-col items-center justify-center
            h-full text-center py-12
          ">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              会話履歴がありません
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              チャットを開始すると<br />
              履歴がここに表示されます
            </p>
          </div>
        ) : (
          /* History List */
          <div className="space-y-3">
            {sessions.map((session) => {
              const counts = getMessageCount(session)
              return (
                <div
                  key={session.id}
                  className="
                    bg-white dark:bg-gray-700 
                    rounded-xl p-4 
                    shadow-sm border border-gray-200 dark:border-gray-600
                    hover:shadow-md transition-shadow
                  "
                >
                  {/* Session Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {session.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(session.updatedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => handleLoadSession(session.id)}
                        className="
                          flex items-center gap-1 px-3 py-2 rounded-lg
                          bg-blue-500 hover:bg-blue-600
                          text-white text-xs font-medium
                          transition-colors shadow-sm
                        "
                        title="会話を再開"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7-7h8a2 2 0 012 2v8M5 3a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
                        </svg>
                        <span>再開</span>
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(session.id)}
                        className="
                          flex items-center gap-1 px-3 py-2 rounded-lg
                          bg-red-500 hover:bg-red-600
                          text-white text-xs font-medium
                          transition-colors shadow-sm
                        "
                        title="会話を削除"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>削除</span>
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {getPreviewText(session)}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      💬 {counts.user}件の質問
                    </span>
                    <span>
                      📝 {counts.total}メッセージ
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mx-4 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              会話を削除しますか？
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              この操作は取り消せません。<br />
              会話履歴が完全に削除されます。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="
                  flex-1 px-4 py-2
                  border border-gray-300 dark:border-gray-600
                  text-gray-700 dark:text-gray-300
                  rounded-lg
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors
                  font-medium
                "
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDeleteSession(showDeleteConfirm)}
                className="
                  flex-1 px-4 py-2
                  bg-red-500 hover:bg-red-600
                  text-white
                  rounded-lg
                  transition-colors
                  font-medium
                "
              >
                削除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}