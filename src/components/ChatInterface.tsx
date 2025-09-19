// 📱 Personal AI Assistant - Chat Interface Component

'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@/hooks/useChat'
import { AppSettings, Resume } from '@/types'
import MessageBubble from './MessageBubble'
import InputArea from './InputArea'
import SettingsModal from './SettingsModal'
import ChatHistoryModal from './ChatHistoryModal'
import ResumeModal from './ResumeModal'
import { isPWA, getDeviceInfo } from '@/lib/utils'

interface ChatInterfaceProps {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  isValidApiKey: boolean
  isLoaded: boolean
  onBackToHome: () => void
  currentResume: Resume | null
  forceNewSession: boolean
  onNewSessionCreated: () => void
}

export default function ChatInterface({
  settings,
  updateSettings,
  isValidApiKey,
  isLoaded,
  onBackToHome,
  currentResume,
  forceNewSession,
  onNewSessionCreated
}: ChatInterfaceProps) {
  const chat = useChat(settings)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages])

  // Apply dark mode
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.toggle('dark', settings.darkMode)
    }
  }, [settings.darkMode, isLoaded])

  // Force new session creation when needed
  useEffect(() => {
    if (forceNewSession && isLoaded) {
      chat.createNewSession()
      onNewSessionCreated()
    }
  }, [forceNewSession, isLoaded, chat, onNewSessionCreated])

  // Open settings if no API key
  useEffect(() => {
    if (isLoaded && !isValidApiKey && chat.messages.length === 0) {
      setIsSettingsOpen(true)
    }
  }, [isLoaded, isValidApiKey, chat.messages.length])

  if (!isLoaded) {
    return (
      <div className="
        flex items-center justify-center 
        min-h-screen bg-gray-50 dark:bg-gray-900
      ">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  const deviceInfo = getDeviceInfo()

  return (
    <div className={`
      flex flex-col h-screen-safe 
      bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800
      ${isPWA() ? 'pt-safe-top' : ''}
    `}>
      {/* Settings Modal - Full Screen */}
      {isSettingsOpen && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={updateSettings}
        />
      )}

      {/* Chat History Modal - Full Screen */}
      {isHistoryOpen && (
        <ChatHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          sessions={chat.getAllSessions()}
          onLoadSession={chat.loadSession}
          onDeleteSession={chat.deleteSession}
          onBackToHome={onBackToHome}
        />
      )}

      {/* Resume Modal */}
      {isResumeOpen && (
        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
          resume={currentResume}
        />
      )}

      {/* Main Chat Interface - Hidden when modals are open */}
      {!isSettingsOpen && !isHistoryOpen && !isResumeOpen && (
        <>
          {/* Header - LINE Style */}
          <header className="
            flex items-center justify-between
            px-4 py-4
            bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg
            border-b border-gray-200/50 dark:border-gray-700/50
            shadow-lg shadow-gray-100/50 dark:shadow-gray-900/50
          ">
            {/* Left side - Back to Home Button */}
            <div className="flex items-center">
              <button
                onClick={onBackToHome}
                className="
                  flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                  hover:bg-gray-100 dark:hover:bg-gray-700/50
                  active:scale-95
                  transition-all duration-150
                  text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
                "
                title="履歴書選択に戻る"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-xs font-medium">戻る</span>
              </button>
            </div>

            {/* Center - Interview Title */}
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                🎯 模擬面接
              </h1>
              {currentResume && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {currentResume.personalInfo.fullName}
                </p>
              )}
            </div>

            {/* Right side - Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Resume Button */}
              {currentResume && (
                <button
                  onClick={() => setIsResumeOpen(true)}
                  className="
                    flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                    hover:bg-gray-100 dark:hover:bg-gray-700/50
                    active:scale-95
                    transition-all duration-150
                    text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
                  "
                  title="履歴書を表示"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs font-medium">履歴書</span>
                </button>
              )}

              {/* History Button */}
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="
                  flex flex-col items-center gap-1 px-3 py-2 rounded-xl
                  hover:bg-gray-100 dark:hover:bg-gray-700/50
                  active:scale-95
                  transition-all duration-150
                  text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
                "
                title="履歴"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <span className="text-xs font-medium">履歴</span>
              </button>

          {/* New Chat Button */}
          <button
            onClick={chat.createNewSession}
            className="
              flex flex-col items-center gap-1 px-3 py-2 rounded-xl
              hover:bg-gray-100 dark:hover:bg-gray-700/50
              active:scale-95
              transition-all duration-150
              text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
            "
            title="新しいチャット"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-xs font-medium">新規</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="
              flex flex-col items-center gap-1 px-3 py-2 rounded-xl
              hover:bg-gray-100 dark:hover:bg-gray-700/50
              active:scale-95
              transition-all duration-150
              text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200
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
      </header>

      {/* Messages Area */}
      <main 
        className="flex-1 overflow-y-auto py-4"
        style={{
          background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 50%, #f3e8ff 100%)'
        }}
      >
        {!isValidApiKey ? (
          /* Setup Required Screen */
          <div className="
            flex flex-col items-center justify-center
            h-full px-4 py-8
            min-h-0
          ">
            {/* API Key Setup Required */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl mb-4 mx-auto overflow-hidden">
                <img 
                  src="/ai-avatar-rem.png" 
                  alt="AI Avatar" 
                  className="w-12 h-12 object-cover object-center rounded-full"
                  style={{ 
                    imageRendering: 'crisp-edges',
                    maxWidth: '48px',
                    maxHeight: '48px'
                  }}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                設定が必要です
              </h2>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-200/50 dark:border-gray-700/50 max-w-xs mx-auto mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  チャットを開始するには<br />
                  Gemini APIキーの<br />
                  設定が必要です
                </p>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="
                  px-6 py-3 
                  bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600
                  text-white rounded-full
                  transition-all duration-200
                  font-medium text-sm
                  shadow-lg hover:shadow-xl
                  transform hover:scale-105 active:scale-95
                "
              >
                🚀 設定を始める
              </button>
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="max-w-4xl mx-auto">
            {chat.messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLatest={index === chat.messages.length - 1}
              />
            ))}
            
            {/* Loading indicator - Speech Bubble Style */}
            {chat.isLoading && (
              <div className="flex items-end gap-2 mb-3 px-4">
                {/* AI Avatar */}
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

                {/* Typing Bubble - Rounded with Border */}
                <div 
                  style={{
                    borderRadius: '24px',
                    padding: '16px 20px',
                    background: '#ffffff',
                    borderColor: '#e5e7eb',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

          {/* Input Area */}
          <InputArea
            onSendMessage={chat.sendMessage}
            isLoading={chat.isLoading}
            state={chat.state}
            disabled={!isValidApiKey}
          />
        </>
      )}
    </div>
  )
}