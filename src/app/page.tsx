// 📱 Health Guidance Simulation - Main Page

'use client'

import { useState, useEffect } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { HealthGuidanceScenario } from '@/types'
import { type ScenarioId, loadScenario } from '@/scenarios'
import { useChat } from '@/hooks/useChat'
import { activeSessionStorage } from '@/lib/storage'
import ResumeSelection from '@/components/ResumeSelection'
import ChatInterface from '@/components/ChatInterface'
import SettingsModal from '@/components/SettingsModal'
import ChatHistoryModal from '@/components/ChatHistoryModal'

type AppState = 'resume-selection' | 'interview'

export default function HomePage() {
  const { settings, updateSettings, isValidApiKey, isLoaded } = useSettings()
  const [appState, setAppState] = useState<AppState>('resume-selection')
  const [currentResume, setCurrentResume] = useState<HealthGuidanceScenario | null>(null)
  const [forceNewSession, setForceNewSession] = useState(false)

  // Modal states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Chat hook for history access (skip initial session creation)
  const chat = useChat({ settings, updateSettings, skipInitialSession: true })

  // Force refresh sessions after delete
  const [sessionsRefreshKey, setSessionsRefreshKey] = useState(0)

  // Load current scenario when settings change
  useEffect(() => {
    if (isLoaded && settings.selectedResume) {
      try {
        const scenario = loadScenario(settings.selectedResume as ScenarioId)
        if (scenario) {
          setCurrentResume(scenario)
        } else {
          setCurrentResume(null)
        }
      } catch (error) {
        console.error('Failed to load scenario:', error)
        setCurrentResume(null)
      }
    } else {
      setCurrentResume(null)
    }
  }, [settings.selectedResume, isLoaded])

  // Handle scenario selection and navigation to interview
  const handleSelectResume = (scenarioId: ScenarioId) => {
    try {
      const scenario = loadScenario(scenarioId)
      if (scenario) {
        // Update settings with selected scenario
        updateSettings({ selectedResume: scenarioId })
        setCurrentResume(scenario)
        // Clear active session before starting new interview
        activeSessionStorage.clear()
        // Force new session creation when starting interview
        setForceNewSession(true)
        setAppState('interview')
      }
    } catch (error) {
      console.error('Failed to load scenario:', error)
    }
  }

  // Handle back to home navigation
  const handleBackToHome = () => {
    setAppState('resume-selection')
  }

  // Handle new session created
  const handleNewSessionCreated = () => {
    setForceNewSession(false)
  }

  // Handle session deletion with immediate refresh
  const handleDeleteSession = (sessionId: string) => {
    console.log('Deleting session:', sessionId)
    chat.deleteSession(sessionId)
    // Force refresh by incrementing the key
    setSessionsRefreshKey(prev => prev + 1)
    console.log('Session deleted and list refreshed')
  }

  // Show loading screen while initializing
  if (!isLoaded) {
    return (
      <div className="
        flex items-center justify-center
        min-h-screen bg-gray-50 dark:bg-gray-900
      ">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
        </div>
      </div>
    )
  }

  // Render appropriate screen based on app state
  return (
    <>
      {appState === 'resume-selection' ? (
        <ResumeSelection
          settings={settings}
          onUpdateSettings={updateSettings}
          onSelectResume={handleSelectResume}
          isValidApiKey={isValidApiKey}
          onOpenSettings={() => {
            console.log('Opening settings from page level')
            setIsSettingsOpen(true)
          }}
          onOpenHistory={() => {
            console.log('Opening history from page level')
            setIsHistoryOpen(true)
          }}
        />
      ) : (
        <ChatInterface
          settings={settings}
          updateSettings={updateSettings}
          isValidApiKey={isValidApiKey}
          isLoaded={isLoaded}
          onBackToHome={handleBackToHome}
          currentResume={currentResume}
          forceNewSession={forceNewSession}
          onNewSessionCreated={handleNewSessionCreated}
        />
      )}


      {/* Original Modals - Now Working */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          console.log('Settings modal closing from page level')
          setIsSettingsOpen(false)
        }}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      <ChatHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => {
          console.log('History modal closing from page level')
          setIsHistoryOpen(false)
        }}
        sessions={chat.getAllSessions()}
        key={`history-modal-${sessionsRefreshKey}`}
        onLoadSession={(sessionId) => {
          chat.loadSession(sessionId)
          setIsHistoryOpen(false)
          setAppState('interview')
        }}
        onDeleteSession={handleDeleteSession}
        onBackToHome={() => {
          setIsHistoryOpen(false)
          setAppState('resume-selection')
        }}
      />
    </>
  )
}
