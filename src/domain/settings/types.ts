import { APP_CONFIG, DailyGoalTarget } from '@/config';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface ReminderPreset {
  id: string;
  label: string;
  sublabel: string;
  hour: number;
  minute: number;
  icon: string;
}

export const REMINDER_PRESETS: ReminderPreset[] = [
  { id: 'morning', label: 'Morning', sublabel: '08:00 AM', hour: 8, minute: 0, icon: 'sunny-outline' },
  { id: 'lunch', label: 'Lunch', sublabel: '12:30 PM', hour: 12, minute: 30, icon: 'restaurant-outline' },
  { id: 'evening', label: 'Evening', sublabel: '06:00 PM', hour: 18, minute: 0, icon: 'partly-sunny-outline' },
  { id: 'night', label: 'Night', sublabel: '08:00 PM', hour: 20, minute: 0, icon: 'moon-outline' },
  { id: 'bedtime', label: 'Bedtime', sublabel: '10:00 PM', hour: 22, minute: 0, icon: 'bed-outline' },
];

export interface SpeechSettings {
  autoPlay: boolean;
  rate: number; // 0.75 (slow) to 1.0 (normal)
}

export type AIProvider = 'offline' | 'groq' | 'openrouter' | 'gemini' | 'deepseek';

export interface AITutorSettings {
  provider: AIProvider;
  apiKey?: string;
  modelName?: string;
}

export interface UserSettings {
  dailyGoal: DailyGoalTarget;
  reminder: ReminderSettings;
  speech: SpeechSettings;
  themeMode: ThemeMode;
  hasCompletedOnboarding: boolean;
  aiTutor?: AITutorSettings;
}

export function createDefaultUserSettings(): UserSettings {
  return {
    dailyGoal: APP_CONFIG.dailyGoal.defaultTarget,
    reminder: {
      enabled: false,
      hour: APP_CONFIG.notifications.defaultHour,
      minute: APP_CONFIG.notifications.defaultMinute,
    },
    speech: {
      autoPlay: false, // Explicitly false per Section 19
      rate: 0.9,
    },
    themeMode: 'system',
    hasCompletedOnboarding: false,
    aiTutor: {
      provider: 'groq',
      apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY || APP_CONFIG.ai.defaultGroqKey,
    },
  };
}
