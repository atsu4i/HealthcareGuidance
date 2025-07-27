// 📱 Personal AI Assistant - Settings Modal Component

'use client'

import { useState } from 'react'
import { AppSettings, GeminiConfig } from '@/types'
import { GEMINI_MODELS, GeminiClient } from '@/lib/gemini-client'
import { showNotification } from '@/lib/utils'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: AppSettings
  onUpdateSettings: (updates: Partial<AppSettings>) => void
}

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings 
}: SettingsModalProps) {
  const [tempApiKey, setTempApiKey] = useState(settings.geminiConfig.apiKey)
  const [tempModel, setTempModel] = useState(settings.geminiConfig.model)
  const [showApiKey, setShowApiKey] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  if (!isOpen) return null

  const handleSave = () => {
    const updates: Partial<AppSettings> = {
      geminiConfig: {
        ...settings.geminiConfig,
        apiKey: tempApiKey,
        model: tempModel
      }
    }

    onUpdateSettings(updates)
    showNotification('設定を保存しました', 'success')
    onClose()
  }

  const handleTestConnection = async () => {
    if (!tempApiKey) {
      showNotification('APIキーを入力してください', 'error')
      return
    }

    setIsTestingConnection(true)
    
    try {
      const testConfig: GeminiConfig = {
        ...settings.geminiConfig,
        apiKey: tempApiKey,
        model: tempModel
      }

      const client = new GeminiClient(testConfig)
      const result = await client.testConnection()

      if (result.success) {
        showNotification('✅ 接続テスト成功', 'success')
      } else {
        showNotification(`❌ 接続テスト失敗: ${result.error}`, 'error')
      }
    } catch (error) {
      showNotification('接続テストでエラーが発生しました', 'error')
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="
      fixed inset-0 z-50 
      bg-white dark:bg-gray-900 
      h-full w-full 
      flex flex-col
      animate-fade-in
    ">
      {/* Settings Header */}
      <header className="
        flex items-center justify-between 
        px-4 py-4
        bg-white dark:bg-gray-900
        border-b border-gray-200 dark:border-gray-700
        shadow-sm
      ">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          設定
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

      {/* Settings Content - Scrollable */}
      <div className="
        flex-1 overflow-y-auto p-6 pb-2
        bg-gray-50 dark:bg-gray-800
        max-w-md mx-auto w-full
      ">
        <div className="space-y-8">
          {/* Gemini API Settings Card */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              🔮 <span>Gemini API</span>
            </h3>
            
            {/* API Key */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                APIキー
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="AIza... で始まるAPIキーを入力"
                    className="
                      w-full px-3 py-3 pr-10
                      border border-gray-300 dark:border-gray-500
                      rounded-lg
                      bg-gray-50 dark:bg-gray-600
                      text-gray-900 dark:text-gray-100
                      placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      text-[16px]
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="
                      absolute right-3 top-1/2 transform -translate-y-1/2
                      text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                      p-1
                    "
                  >
                    {showApiKey ? '🙈' : '👁️'}
                  </button>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingConnection || !tempApiKey}
                  className="
                    px-4 py-3 
                    bg-blue-500 hover:bg-blue-600
                    disabled:bg-gray-300 dark:disabled:bg-gray-600
                    text-white text-sm rounded-lg
                    transition-colors
                    whitespace-nowrap font-medium
                  "
                >
                  {isTestingConnection ? '🔄' : '🔍'}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Google AI Studio
                </a>
                でAPIキーを取得できます
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-3 mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                モデル
              </label>
              <select
                value={tempModel}
                onChange={(e) => setTempModel(e.target.value as 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite')}
                className="
                  w-full px-3 py-3
                  border border-gray-300 dark:border-gray-500
                  rounded-lg
                  bg-gray-50 dark:bg-gray-600
                  text-gray-900 dark:text-gray-100
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-[16px]
                "
              >
                {Object.entries(GEMINI_MODELS).map(([key, model]) => (
                  <option key={key} value={key}>
                    {model.name} (最大{model.maxTokens.toLocaleString()}トークン)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* App Settings Card */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              🎨 <span>アプリ設定</span>
            </h3>
            
            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ダークモード
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ダークテーマに切り替え
                  </p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
                  className={`
                    relative inline-flex h-8 w-16 items-center rounded-full transition-colors shadow-inner
                    ${settings.darkMode ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                >
                  <span className={`
                    inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md border border-gray-200
                    ${settings.darkMode ? 'translate-x-9' : 'translate-x-1'}
                  `} />
                  {/* Toggle labels */}
                  <span className={`
                    absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-medium transition-opacity pointer-events-none
                    ${settings.darkMode ? 'opacity-0' : 'opacity-100 text-gray-600'}
                  `}>
                    OFF
                  </span>
                  <span className={`
                    absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium transition-opacity pointer-events-none
                    ${settings.darkMode ? 'opacity-100 text-white' : 'opacity-0'}
                  `}>
                    ON
                  </span>
                </button>
              </div>

              {/* Save History */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    履歴を保存
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    会話履歴をローカルに保存
                  </p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ saveHistory: !settings.saveHistory })}
                  className={`
                    relative inline-flex h-8 w-16 items-center rounded-full transition-colors shadow-inner
                    ${settings.saveHistory ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}
                  `}
                >
                  <span className={`
                    inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-md border border-gray-200
                    ${settings.saveHistory ? 'translate-x-9' : 'translate-x-1'}
                  `} />
                  {/* Toggle labels */}
                  <span className={`
                    absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-medium transition-opacity pointer-events-none
                    ${settings.saveHistory ? 'opacity-0' : 'opacity-100 text-gray-600'}
                  `}>
                    OFF
                  </span>
                  <span className={`
                    absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium transition-opacity pointer-events-none
                    ${settings.saveHistory ? 'opacity-100 text-white' : 'opacity-0'}
                  `}>
                    ON
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom padding for fixed footer */}
          <div className="h-20"></div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="
        border-t border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-700
        p-4
        max-w-md mx-auto w-full
      ">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="
              flex-1 px-4 py-3
              border border-gray-300 dark:border-gray-500
              text-gray-700 dark:text-gray-300
              rounded-xl
              hover:bg-gray-50 dark:hover:bg-gray-600
              transition-colors
              font-medium
              text-[16px]
            "
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!GeminiClient.isValidApiKey(tempApiKey)}
            className="
              flex-1 px-4 py-3
              bg-blue-500 hover:bg-blue-600
              disabled:bg-gray-300 dark:disabled:bg-gray-600
              text-white
              rounded-xl
              transition-colors
              font-medium
              text-[16px]
              disabled:cursor-not-allowed
            "
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}