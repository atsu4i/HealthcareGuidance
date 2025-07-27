// 📱 Personal AI Assistant - Settings Hook

'use client'

import { useState, useEffect } from 'react'
import { AppSettings } from '@/types'
import { settingsStorage, DEFAULT_SETTINGS } from '@/lib/storage'
import { GeminiClient } from '@/lib/gemini-client'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings on mount
  useEffect(() => {
    const loadedSettings = settingsStorage.get()
    setSettings(loadedSettings)
    setIsLoaded(true)
  }, [])

  // Update settings
  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)
    settingsStorage.set(newSettings)
  }

  // Reset settings
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    settingsStorage.reset()
  }

  // Check if API key is valid
  const isValidApiKey = GeminiClient.isValidApiKey(settings.geminiConfig.apiKey)

  return {
    settings,
    updateSettings,
    resetSettings,
    isValidApiKey,
    isLoaded
  }
}