# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Essential Commands:**
```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build production version
npm run start    # Start production server
npm run lint     # Run ESLint for code quality
```

**Testing:** No test framework is currently configured. Check with user before adding testing capabilities.

## Architecture Overview

This is a **Next.js 14 PWA** (Progressive Web App) that provides an AI-powered **health guidance simulation app** optimized for iPhone. The app helps public health nurses practice guidance interviews with simulated patients who have metabolic syndrome and other lifestyle-related conditions. Key architectural decisions:

### Core Technologies
- **Frontend:** Next.js 14 with App Router, TypeScript, Tailwind CSS
- **AI Integration:** Google Gemini API (2.5-pro, 2.5-flash, 2.5-flash-lite models)
- **PWA Features:** Service Worker, offline capabilities, installable on mobile
- **State Management:** React hooks with localStorage persistence
- **Scenario Management:** TypeScript-based patient scenario definitions
- **Deployment:** Vercel and Docker (for Synology NAS)

### Key Design Patterns

**Mobile-First Architecture:**
- iPhone-optimized PWA with portrait orientation focus
- Touch-friendly UI with safe area handling
- LINE-style chat interface for health guidance conversations

**Scenario-Based Simulation System:**
- TypeScript scenario definitions in `src/scenarios/`
- 13 diverse patient scenarios with different psychological profiles and health conditions
- Dynamic system prompt generation based on selected scenario
- AI roleplays as the patient based on scenario data (health metrics, lifestyle, psychological profile)

**Client-Side State Management:**
- `useChat` hook manages guidance sessions and message state
- `useSettings` hook handles Gemini API configuration and scenario selection
- Local storage persistence for session history and settings
- `scenarioId` linked to chat sessions for tracking which scenario was used

**API Architecture:**
- `/api/chat/route.ts` - Proxies requests to Gemini API with dynamic system prompts
- `/api/feedback/route.ts` - Generates AI-powered feedback on nurse's guidance performance
- Dynamic system prompt injection based on selected scenario
- Client-side streaming simulation for better UX
- Comprehensive error handling with Japanese error messages

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # PWA metadata, viewport config
│   ├── page.tsx            # Main chat page
│   └── api/
│       ├── chat/route.ts   # Gemini API proxy for chat
│       └── feedback/route.ts # AI feedback generation
├── components/
│   ├── ChatInterface.tsx   # Main guidance UI with mobile optimization
│   ├── MessageBubble.tsx   # Speech bubble messages
│   ├── InputArea.tsx       # Text input with touch optimization
│   ├── SettingsModal.tsx   # API key and scenario selection
│   ├── ResumeModal.tsx     # Scenario details display
│   ├── ResumeSelection.tsx # Scenario picker component
│   └── ChatHistoryModal.tsx # Session management
├── hooks/
│   ├── useChat.ts          # Guidance session state & Gemini API integration
│   └── useSettings.ts      # Configuration and scenario management
├── lib/
│   ├── gemini-client.ts    # Gemini API client with dynamic system prompts
│   ├── storage.ts          # localStorage utilities
│   ├── system-prompt.ts    # Health guidance prompt generation
│   └── utils.ts            # PWA detection, notifications
├── scenarios/              # Patient scenario definitions (13 scenarios)
│   ├── index.ts            # Scenario loading and management utilities
│   ├── cooperative-motivated.ts    # Cooperative patient
│   ├── defensive-denial.ts         # Defensive patient
│   ├── indifferent-busy.ts         # Indifferent patient
│   ├── knowledge-no-action.ts      # Knowledgeable but inactive
│   ├── complex-background.ts       # Complex life circumstances
│   ├── young-prediabetes.ts        # Young prediabetic patient
│   ├── elderly-multiple-conditions.ts # Elderly with comorbidities
│   ├── mental-health-stress.ts     # Mental health & stress issues
│   ├── family-unsupported.ts       # Lack of family support
│   ├── medical-distrust.ts         # Medical distrust
│   ├── economic-difficulty.ts      # Economic barriers
│   ├── shift-work-irregular.ts     # Shift worker
│   └── living-alone-transfer.ts    # Living alone/relocated
└── types/index.ts          # TypeScript definitions (HealthGuidanceScenario, Resume, etc.)
```

## Important Implementation Details

**Gemini API Integration:**
- Supports 3 models: gemini-2.5-pro, gemini-2.5-flash, gemini-2.5-flash-lite
- Dynamic system prompt generation based on selected scenario
- API key validation: must start with "AIza" and be >10 characters
- Safety settings configured to "BLOCK_NONE" for flexibility
- Two distinct modes:
  - **Chat mode**: AI roleplays as the patient based on scenario
  - **Feedback mode**: AI acts as expert instructor evaluating nurse's performance

**PWA Configuration:**
- Manifest at `/public/manifest.json` with mobile icons
- Service Worker auto-generated by Next.js
- Apple-specific meta tags in layout.tsx for iOS optimization

**Scenario System:**
- Scenario data stored as TypeScript files in `src/scenarios/`
- Dynamic loading via `loadScenario()` function
- Type-safe scenario definitions using `HealthGuidanceScenario` interface
- Each scenario includes:
  - Personal info (name, age, gender, occupation, family)
  - Health check results (BMI, blood pressure, blood test values)
  - Lifestyle data (diet, exercise, alcohol, smoking, sleep, stress)
  - Medical history (current/past diseases, medications, family history)
  - Psychological profile (response style, motivation level, health literacy)
  - Background story and expected challenges
- Scenarios cover diverse patient types: cooperative, defensive, indifferent, knowledgeable-but-inactive, complex backgrounds, age variations, comorbidities, mental health issues, economic barriers, etc.

**Data Persistence:**
- Guidance sessions stored in localStorage with auto-titles
- Settings and scenario selection persisted across sessions
- `scenarioId` saved with each chat session for context
- No backend database - fully client-side

**Mobile Optimization:**
- Tailwind classes use safe area insets (`pt-safe-top`, `h-screen-safe`)
- Touch-optimized buttons with active scale animations
- Gradient backgrounds and glassmorphism effects

**AI Feedback System:**
- Analyzes nurse-patient conversation logs
- Evaluates based on communication skills, motivational interviewing, information delivery, goal setting, and appropriateness
- Provides structured feedback: strengths, areas for improvement, overall assessment
- Uses scenario context to give personalized feedback

**Export/Import System:**
- Export all sessions or individual sessions to JSON files
- Import sessions from JSON files (duplicate prevention)
- API keys automatically excluded from exports for security
- Session data validation on import
- File format: `health-guidance-sessions-YYYY-MM-DD.json`

## Development Considerations

**Health Guidance Simulation:** The AI roleplays as a patient based on the selected scenario. Each scenario file defines a complete patient profile (health metrics, lifestyle, psychological traits) that the AI uses to respond consistently throughout the guidance session. The nurse (user) practices counseling skills with these simulated patients.

**Language:** Primary language is Japanese. Error messages, UI text, system prompts, and all patient scenarios are in Japanese. This app is designed for Japanese public health nurses.

**API Keys:** Never commit API keys. The app expects users to input their own Gemini API key via settings.

**Mobile Testing:** Always test on actual iPhone devices or simulator - PWA behavior differs significantly from desktop.

**Docker Deployment:** Configured for Synology NAS deployment with port 3001. See DEPLOYMENT.md for details.

**Scenario Design Philosophy:** Scenarios are designed to represent realistic patient archetypes that public health nurses encounter in metabolic syndrome prevention programs. Each scenario tests different counseling skills (handling resistance, building rapport, motivational interviewing, etc.).

## Common Tasks

**Adding New Scenarios:**
1. Create new TypeScript file in `src/scenarios/` following existing scenario patterns
2. Define complete `HealthGuidanceScenario` object with all required fields
3. Add scenario to `AVAILABLE_SCENARIOS` array in `src/scenarios/index.ts`
4. Add case to the switch statement in `loadScenario()` function
5. Consider patient diversity: age, gender, health conditions, psychological profile, socioeconomic factors

**Modifying Scenario Data:**
- Edit individual scenario files in `src/scenarios/`
- Ensure consistency with `HealthGuidanceScenario` type definition
- Test AI responses reflect the updated scenario characteristics

**Adding New Gemini Models:**
- Update `GEMINI_MODELS` object in `gemini-client.ts`
- Update corresponding TypeScript types in `types/index.ts`

**UI Modifications:**
- Follow existing Tailwind patterns
- Use mobile-first responsive design with touch-friendly sizing
- Maintain LINE-style chat aesthetic

**Error Handling:**
- Add Japanese error messages
- Use `showNotification` utility for user feedback

**Settings Changes:**
- Extend `AppSettings` interface in `types/index.ts`
- Update `useSettings` hook
- Ensure localStorage compatibility

**System Prompt Tuning:**
- Modify `generateHealthGuidancePrompt()` in `system-prompt.ts` to adjust AI patient behavior
- Adjust `BASE_HEALTH_GUIDANCE_PROMPT` to change overall roleplay instructions
- Edit feedback prompt in `/api/feedback/route.ts` to change evaluation criteria

**Feedback System Customization:**
- Modify `FEEDBACK_PROMPT` constant in `src/app/api/feedback/route.ts`
- Add or adjust evaluation criteria (communication, motivational interviewing, etc.)
- Change feedback format structure

**Export/Import Data Management:**
- Export functions in `src/lib/storage.ts` (`exportStorage` object)
- `exportSessions()` - Export all sessions
- `exportSession(sessionId)` - Export single session
- `importSessions(file)` - Import from JSON file
- UI in `ChatHistoryModal` - toolbar buttons for export/import