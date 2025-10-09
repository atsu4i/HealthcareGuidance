// 📱 Personal AI Assistant - Input Area Component

'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatState } from '@/types'

interface InputAreaProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  state: ChatState
  disabled?: boolean
}

export default function InputArea({
  onSendMessage,
  isLoading,
  state,
  disabled = false
}: InputAreaProps) {
  const [input, setInput] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  // Focus on mount
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus()
    }
  }, [disabled])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const sendMessage = () => {
    const message = input.trim()
    if (!message || isLoading || disabled) return

    onSendMessage(message)
    setInput('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // IME変換中はEnterキーを無視
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const isDisabled = disabled || isLoading || state === 'error'

  return (
    <div className="
      bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg
      border-t border-gray-200/50 dark:border-gray-700/50
      px-4 py-4
      safe-area-inset-bottom
      shadow-lg shadow-gray-100/50 dark:shadow-gray-900/50
    ">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        {/* Additional Actions (Left) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="
              p-2.5 rounded-full
              hover:bg-gray-100 dark:hover:bg-gray-700/50
              active:scale-95
              transition-all duration-150
              text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
              disabled:opacity-50
            "
            disabled={isDisabled}
            title="その他"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        {/* Text input container */}
        <div className="flex-1 relative">
          <div 
            className="
              transition-all duration-200
              focus-within:scale-[1.02]
            "
            style={{
              background: '#ffffff',
              border: '2px solid #e5e7eb',
              borderRadius: '28px',
              boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(59, 130, 246, 0.25)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb'
              e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.08)'
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={
                disabled
                  ? 'APIキーを設定してください...'
                  : isLoading
                  ? 'AIが応答中...'
                  : 'メッセージを入力...'
              }
              disabled={isDisabled}
              rows={1}
              className="
                w-full px-6 py-4
                bg-transparent
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
                resize-none
                border-none
                focus:outline-none
                disabled:opacity-50 disabled:cursor-not-allowed
                max-h-32
                text-[16px] leading-[1.4]
              "
              style={{ minHeight: '56px' }}
              onFocus={(e) => {
                const container = e.currentTarget.parentElement
                if (container) {
                  container.style.borderColor = '#3b82f6'
                  container.style.boxShadow = '0 4px 12px -2px rgba(59, 130, 246, 0.25)'
                }
              }}
              onBlur={(e) => {
                const container = e.currentTarget.parentElement
                if (container) {
                  container.style.borderColor = '#e5e7eb'
                  container.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.08)'
                }
              }}
            />
          </div>
          
          {/* Character count */}
          {input.length > 100 && (
            <div className="
              absolute -top-6 right-3 
              text-xs text-gray-400 dark:text-gray-500
              bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
              px-2 py-1 rounded-full
            ">
              {input.length}
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={isDisabled || !input.trim()}
          className="
            w-12 h-12 flex items-center justify-center
            transition-all duration-200
            touch-manipulation
            transform active:scale-95 hover:scale-105
            disabled:cursor-not-allowed
            text-white
            disabled:opacity-50
          "
          style={{
            borderRadius: '24px',
            background: isDisabled || !input.trim() 
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: isDisabled || !input.trim()
              ? 'none'
              : '0 4px 12px -2px rgba(59, 130, 246, 0.4)',
            border: 'none'
          }}
          title="送信 (Enter)"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg 
              className="w-5 h-5 translate-x-0.5" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          )}
        </button>
      </form>

      {/* Status indicator */}
      {state === 'error' && (
        <div className="mt-3 px-2">
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl">
            <span className="text-red-500 text-sm">⚠️</span>
            <span className="text-sm text-red-600 dark:text-red-400">
              エラーが発生しました。再試行してください。
            </span>
          </div>
        </div>
      )}
    </div>
  )
}