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
  onBackToHome?: () => void
}

export default function ChatHistoryModal({
  isOpen,
  onClose,
  sessions,
  onLoadSession,
  onDeleteSession,
  onBackToHome
}: ChatHistoryModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  if (!isOpen) return null

  const handleLoadSession = (sessionId: string) => {
    onLoadSession(sessionId)
    onClose()
    showNotification('会話を再開しました', 'success')
  }

  const handleDeleteSession = (sessionId: string) => {
    console.log('handleDeleteSession called with sessionId:', sessionId)
    onDeleteSession(sessionId)
    setShowDeleteConfirm(null)
    showNotification('会話を削除しました。リストが更新されます。', 'success')
    console.log('Delete session completed')
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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              style={{
                padding: '8px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                transition: 'all 0.15s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="トップページに戻る"
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          )}
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            会話履歴
          </h1>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            transition: 'all 0.15s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          title="閉じる"
        >
          <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
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
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              margin: '16px',
              maxWidth: '384px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
              会話を削除しますか？
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px', lineHeight: '1.5' }}>
              <strong>
                {sessions.find(s => s.id === showDeleteConfirm)?.title || '選択された会話'}
              </strong>
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
              この操作は取り消せません。<br />
              会話履歴が完全に削除されます。
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  console.log('Delete button clicked, sessionId:', showDeleteConfirm)
                  if (showDeleteConfirm) {
                    handleDeleteSession(showDeleteConfirm)
                  }
                }}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'background-color 0.15s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
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