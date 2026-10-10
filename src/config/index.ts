export const APP_CONFIG = {
  appName: 'Klearn',
  version: '1.0.0',
  storage: {
    currentVersion: 1,
    keys: {
      learningRecords: '@klearn_learning_records_v1',
      reviewStates: '@klearn_review_states_v1',
      userSettings: '@klearn_user_settings_v1',
      dailyProgress: '@klearn_daily_progress_v1',
      streakData: '@klearn_streak_data_v1',
      quizHistory: '@klearn_quiz_history_v1',
    },
  },
  srs: {
    defaultEaseFactor: 2.5,
    minEaseFactor: 1.3,
    initialIntervalDays: 1,
    secondIntervalDays: 6,
  },
  dailyGoal: {
    defaultTarget: 10,
    options: [5, 10, 15, 20] as const,
  },
  notifications: {
    defaultHour: 20, // 8:00 PM
    defaultMinute: 0,
  },
} as const;

export type DailyGoalTarget = (typeof APP_CONFIG.dailyGoal.options)[number];
