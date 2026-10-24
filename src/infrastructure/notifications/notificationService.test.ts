const mockScheduleNotificationAsync = jest.fn().mockResolvedValue('mock-notification-id');
const mockCancelAllScheduledNotificationsAsync = jest.fn().mockResolvedValue(undefined);
const mockGetPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });
const mockRequestPermissionsAsync = jest.fn().mockResolvedValue({ status: 'granted' });
const mockSetNotificationChannelAsync = jest.fn().mockResolvedValue(undefined);

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    executionEnvironment: 'bare',
  },
  ExecutionEnvironment: {
    StoreClient: 'storeClient',
  },
}));

jest.mock(
  'expo-notifications',
  () => ({
    __esModule: true,
    setNotificationHandler: jest.fn(),
    scheduleNotificationAsync: mockScheduleNotificationAsync,
    cancelAllScheduledNotificationsAsync: mockCancelAllScheduledNotificationsAsync,
    getPermissionsAsync: mockGetPermissionsAsync,
    requestPermissionsAsync: mockRequestPermissionsAsync,
    setNotificationChannelAsync: mockSetNotificationChannelAsync,
    AndroidImportance: { HIGH: 6 },
    SchedulableTriggerInputTypes: { DAILY: 'daily' },
  }),
  { virtual: true }
);

import {
  formatStudyNotificationContent,
  notificationService,
  STUDY_REMINDER_CHANNEL_ID,
} from './notificationService';
import { REMINDER_PRESETS } from '@/domain/settings/types';

describe('Notification Service & Study Reminders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('formatStudyNotificationContent', () => {
    it('returns default fallback message when content is undefined', () => {
      const result = formatStudyNotificationContent();
      expect(result.title).toBe('Time for Daily Korean! 🇰🇷');
      expect(result.body).toContain('Keep your streak alive');
    });

    it('formats plain string input correctly', () => {
      const result = formatStudyNotificationContent('안녕하세요');
      expect(result.title).toBe('Time for Daily Korean! 🇰🇷');
      expect(result.body).toContain('"안녕하세요"');
      expect(result.body).toContain('Tap to practice');
    });

    it('formats Korean sentence and English translation without streak', () => {
      const result = formatStudyNotificationContent({
        sentenceKorean: '오늘 날씨가 좋아요',
        translation: 'The weather is good today',
      });
      expect(result.title).toBe('Time for Daily Korean! 🇰🇷');
      expect(result.body).toContain('"오늘 날씨가 좋아요" (The weather is good today)');
      expect(result.body).toContain('start today\'s streak');
    });

    it('highlights active streak in notification body', () => {
      const result = formatStudyNotificationContent({
        sentenceKorean: '오늘도 힘내세요',
        translation: 'Cheer up today as well',
        streakDays: 7,
      });
      expect(result.title).toBe('Time for Daily Korean! 🇰🇷');
      expect(result.body).toContain('🔥 7-day streak!');
      expect(result.body).toContain('"오늘도 힘내세요" (Cheer up today as well)');
    });

    it('highlights due reviews count if cards are waiting', () => {
      const result = formatStudyNotificationContent({
        sentenceKorean: '감사합니다',
        translation: 'Thank you',
        dueReviewsCount: 12,
      });
      expect(result.title).toBe('Time for Daily Korean! 🇰🇷');
      expect(result.body).toContain('📚 12 cards waiting!');
      expect(result.body).toContain('"감사합니다" (Thank you)');
    });

    it('handles streak-only reminder when sentence is missing', () => {
      const result = formatStudyNotificationContent({
        streakDays: 4,
      });
      expect(result.title).toBe('Time for Daily Korean! 🇰🇷');
      expect(result.body).toContain('🔥 4-day streak!');
      expect(result.body).toContain('Review today\'s cards');
    });
  });

  describe('REMINDER_PRESETS', () => {
    it('contains all expected study schedule presets', () => {
      const ids = REMINDER_PRESETS.map((p) => p.id);
      expect(ids).toContain('morning');
      expect(ids).toContain('lunch');
      expect(ids).toContain('evening');
      expect(ids).toContain('night');
      expect(ids).toContain('bedtime');
    });

    it('has valid hours and minutes for every preset', () => {
      REMINDER_PRESETS.forEach((preset) => {
        expect(preset.hour).toBeGreaterThanOrEqual(0);
        expect(preset.hour).toBeLessThan(24);
        expect(preset.minute).toBeGreaterThanOrEqual(0);
        expect(preset.minute).toBeLessThan(60);
        expect(preset.label).toBeTruthy();
        expect(preset.sublabel).toBeTruthy();
      });
    });
  });

  describe('NotificationService Execution', () => {
    it('defines the correct Android notification channel id', () => {
      expect(STUDY_REMINDER_CHANNEL_ID).toBe('klearn-study-reminders');
    });

    it('schedules daily reminder via expo-notifications', async () => {
      const res = await notificationService.scheduleDailyReminder(
        {
          enabled: true,
          hour: 20,
          minute: 30,
        },
        {
          sentenceKorean: '오늘 공부해요',
          translation: 'Let\'s study today',
          streakDays: 5,
        }
      );

      expect(res).toBe(true);
      expect(mockCancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(mockSetNotificationChannelAsync).toHaveBeenCalledWith(
        STUDY_REMINDER_CHANNEL_ID,
        expect.objectContaining({
          name: 'Daily Korean Study Reminders',
          importance: 6,
        })
      );
      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Time for Daily Korean! 🇰🇷',
            body: expect.stringContaining('🔥 5-day streak!'),
          }),
          trigger: expect.objectContaining({
            type: 'daily',
            hour: 20,
            minute: 30,
            channelId: STUDY_REMINDER_CHANNEL_ID,
          }),
        })
      );
    });

    it('cancels all reminders when enabled is false', async () => {
      const res = await notificationService.scheduleDailyReminder({
        enabled: false,
        hour: 20,
        minute: 0,
      });

      expect(res).toBe(true);
      expect(mockCancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('delivers instant study test notification', async () => {
      const result = await notificationService.sendInstantStudyNotification({
        sentenceKorean: '내일 봐요',
        translation: 'See you tomorrow',
        streakDays: 3,
      });

      expect(result.success).toBe(true);
      expect(result.isSimulated).toBe(false);
      expect(result.preview.title).toBe('Time for Daily Korean! 🇰🇷');
      expect(result.preview.body).toContain('🔥 3-day streak!');
      expect(result.preview.body).toContain('"내일 봐요" (See you tomorrow)');
      expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Time for Daily Korean! 🇰🇷',
          }),
          trigger: { channelId: STUDY_REMINDER_CHANNEL_ID },
        })
      );
    });

    it('cancels reminders without throwing', async () => {
      await expect(notificationService.cancelReminders()).resolves.toBeUndefined();
      expect(mockCancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });
  });
});
