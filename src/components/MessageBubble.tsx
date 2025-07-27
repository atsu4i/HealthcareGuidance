// 📱 Personal AI Assistant - LINE-style Message Bubble

'use client'

import { Message } from '@/types'
import { formatDate } from '@/lib/storage'
import { copyToClipboard } from '@/lib/utils'
import { useState } from 'react'

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
}

export default function MessageBubble({ message, isLatest = false }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    copyToClipboard(message.content)
    setShowActions(false)
  }

  const handleLongPress = () => {
    setShowActions(!showActions)
  }

  return (
    <div className={`
      flex items-end gap-2 mb-3 px-4
      ${isUser ? 'justify-end pr-6' : 'justify-start'}
      ${isLatest ? 'animate-slide-up' : ''}
      group
    `}>
      {/* AI Avatar (left side only) */}
      {!isUser && (
        <div className="flex-shrink-0 w-24 h-24 mb-1">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg overflow-hidden">
            <img 
              src="/ai-avatar-rem.png" 
              alt="AI Avatar" 
              className="w-20 h-20 object-cover object-center rounded-full"
              style={{ 
                imageRendering: 'auto',
                maxWidth: '80px',
                maxHeight: '80px'
              }}
            />
          </div>
        </div>
      )}

      {/* Message Container */}
      <div className={`
        relative max-w-[75%] sm:max-w-[65%]
        ${isUser ? 'order-1' : 'order-2'}
      `}>
        {/* Message Bubble - Rounded with Border */}
        <div 
          onClick={handleLongPress}
          className={`
            shadow-md relative border
            transform transition-all duration-200 hover:scale-[1.02]
            cursor-pointer select-text
            ${isUser 
              ? 'text-gray-800' 
              : 'text-gray-900 dark:text-gray-100'
            }
          `}
          style={{
            borderRadius: '24px',
            padding: '16px 20px',
            background: isUser 
              ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' 
              : '#ffffff',
            borderColor: isUser 
              ? 'rgba(147, 197, 253, 0.8)' 
              : '#e5e7eb',
            borderWidth: '1px',
            borderStyle: 'solid',
            boxShadow: isUser 
              ? '0 4px 6px -1px rgba(59, 130, 246, 0.15)' 
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Message Content */}
          <div className="text-[15px] leading-[1.4] whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        {/* Message Time (outside bubble) */}
        <div className={`text-xs text-gray-400 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
          {isUser && <span className="ml-1">✓</span>}
        </div>

        {/* Action Menu */}
        {showActions && (
          <div className={`
            absolute top-full mt-2 z-10
            ${isUser ? 'right-0' : 'left-0'}
          `}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[120px]">
              <button
                onClick={handleCopy}
                className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">📋</span>
                <span className="text-gray-900 dark:text-gray-100">コピー</span>
              </button>
              <button
                onClick={() => setShowActions(false)}
                className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <span className="text-gray-600 dark:text-gray-400">❌</span>
                <span className="text-gray-900 dark:text-gray-100">閉じる</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close actions */}
      {showActions && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  )
}