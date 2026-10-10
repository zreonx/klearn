import { APP_CONFIG, DailyGoalTarget } from '@/config';

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

export interface SpeechSettings {
  autoPlay: boolean;
  rate: number; // 0.75 (slow) to 1.0 (normal)
}

export interface UserSettings {
  dailyGoal: DailyGoalTarget;
  reminder: ReminderSettings;
  speech: SpeechSettings;
  hasCompletedOnboarding: boolean;
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
    hasCompletedOnboarding: false,
  };
}
