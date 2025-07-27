// 📱 Personal AI Assistant - Utility Functions

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind CSS class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Notification utility (simplified version from original project)
export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // Create notification element
  const notification = document.createElement('div')
  notification.className = `
    fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm
    ${type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'}
    transform transition-all duration-300 translate-x-full opacity-0
  `
  notification.textContent = message

  document.body.appendChild(notification)

  // Animate in
  requestAnimationFrame(() => {
    notification.classList.remove('translate-x-full', 'opacity-0')
  })

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.add('translate-x-full', 'opacity-0')
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Debounce utility
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Sleep utility
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    showNotification('クリップボードにコピーしました', 'success')
    return true
  } catch (error) {
    showNotification('コピーに失敗しました', 'error')
    return false
  }
}

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Escape HTML
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Generate title from message
export const generateTitleFromMessage = (message: string): string => {
  const cleaned = message.replace(/[^\w\s]/g, '').trim()
  const words = cleaned.split(/\s+/).slice(0, 6)
  return words.join(' ') || '新しいチャット'
}

// Detect mobile device
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// Detect iOS
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

// Detect standalone PWA
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         // @ts-expect-error - iOS Safari PWA detection
         window.navigator.standalone === true
}

// Get device info
export const getDeviceInfo = () => {
  return {
    isMobile: isMobile(),
    isIOS: isIOS(),
    isPWA: isPWA(),
    userAgent: navigator.userAgent,
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight
  }
}

// Console debug helper
export const debug = {
  log: (label: string, data: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 ${label}:`, data)
    }
  },
  error: (label: string, error: unknown) => {
    console.error(`❌ ${label}:`, error)
  },
  warn: (label: string, data: unknown) => {
    console.warn(`⚠️ ${label}:`, data)
  }
}