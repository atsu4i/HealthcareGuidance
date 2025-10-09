// 📱 Personal AI Assistant - Type Definitions

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  scenarioId?: string
}

export interface GeminiConfig {
  apiKey: string
  model: 'gemini-2.5-pro' | 'gemini-2.5-flash' | 'gemini-2.5-flash-lite'
  temperature: number
  maxTokens: number
}

export interface Resume {
  id: string
  name: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    dateOfBirth?: string
  }
  education: {
    school: string
    degree: string
    major: string
    graduationYear: string
    gpa?: string
  }[]
  experience: {
    company: string
    position: string
    startDate: string
    endDate: string
    description: string[]
  }[]
  skills: {
    technical: string[]
    languages: string[]
    certifications: string[]
  }
  projects: {
    name: string
    description: string
    technologies: string[]
    duration: string
  }[]
  interests: string[]
  selfIntroduction: string
}

// 保健指導シナリオの型定義
export interface HealthGuidanceScenario {
  id: string
  name: string
  description: string
  personalInfo: {
    fullName: string
    age: number
    gender: '男性' | '女性'
    occupation: string
    familyStructure: string
    address?: string
  }
  healthCheckResults: {
    date: string
    height: number
    weight: number
    bmi: number
    waistCircumference: number
    bloodPressure: {
      systolic: number
      diastolic: number
    }
    bloodTest: {
      fastingBloodSugar: number
      hba1c: number
      ldlCholesterol: number
      hdlCholesterol: number
      triglycerides: number
      ast: number
      alt: number
      gammaGtp: number
      creatinine?: number
      uricAcid?: number
    }
    urineTest?: {
      protein: string
      sugar: string
    }
  }
  lifestyle: {
    diet: {
      pattern: string
      details: string[]
      problems: string[]
    } | string
    exercise: {
      frequency: string
      details: string[]
      barriers: string[]
    } | string
    alcohol: {
      frequency: string
      amount: string
      details: string[]
    } | string
    smoking: {
      status: '非喫煙' | '喫煙中' | '過去喫煙'
      details?: string
    } | string
    sleep: {
      duration: string
      quality: string
      problems: string[]
    } | string
    stress: {
      level: '低' | '中' | '高'
      sources: string[]
      copingMethods: string[]
    } | string
  }
  medicalHistory: {
    currentDiseases: string[]
    pastDiseases: string[]
    medications: string[]
    familyHistory: string | string[]
  }
  psychologicalProfile: {
    personality: string
    responseStyle: '協力的' | '防衛的' | '無関心' | '知識あり実行なし' | '複雑な背景'
    motivationLevel: '高' | '中' | '低'
    healthLiteracy: '高' | '中' | '低'
    concerns: string[]
    strengths: string[]
  } | {
    attitudeTowardGuidance: string
    motivationLevel: string
    healthAwareness: string
    changeReadiness: string
    communicationStyle: string
    copingMechanism: string
  }
  backgroundStory: string
  guidanceGoals: string[]
  expectedChallenges: string[]
  responseStyle?: string
  difficulty?: string
}

export interface AppSettings {
  geminiConfig: GeminiConfig
  darkMode: boolean
  saveHistory: boolean
  autoTitle: boolean
  selectedResume: string | null
  enableStreaming: boolean
  streamingSpeed: 'fast' | 'normal' | 'slow'
}

export interface GeminiRequest {
  contents: {
    role: 'user' | 'model'
    parts: { text: string }[]
  }[]
  generationConfig: {
    temperature: number
    maxOutputTokens: number
    topP: number
    topK: number
    thinkingConfig?: {
      thinkingBudget: number
    }
  }
  safetySettings: {
    category: string
    threshold: string
  }[]
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
      role: string
    }
    finishReason: string
  }[]
}

export interface ApiError {
  error: string
  details?: string
  status?: number
}

export type ChatState = 'idle' | 'loading' | 'streaming' | 'error'

export interface UseChat {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  state: ChatState
}

export interface UseSettings {
  settings: AppSettings
  updateSettings: (updates: Partial<AppSettings>) => void
  resetSettings: () => void
  isValidApiKey: boolean
}