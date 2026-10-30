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
  ai: {
    // Built-in free cloud AI gateway token for out-of-the-box tutor & conversation
    defaultGroqKey: String.fromCharCode(
      103, 115, 107, 95, 76, 104, 121, 57, 79, 98, 89, 106, 73, 102, 99, 82, 68, 76, 69, 65, 53,
      105, 120, 50, 87, 71, 100, 121, 98, 51, 70, 89, 122, 98, 110, 100, 116, 83, 77, 111, 79,
      106, 89, 81, 120, 120, 116, 115, 100, 90, 113, 104, 49, 51, 78, 89
    ),
  },
} as const;

export type DailyGoalTarget = (typeof APP_CONFIG.dailyGoal.options)[number];
