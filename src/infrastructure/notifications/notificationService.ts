import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { ReminderSettings } from '@/domain/settings/types';
import { logger } from '@/lib/logger';

export const STUDY_REMINDER_CHANNEL_ID = 'klearn-study-reminders';

// Expo Go on Android removed native push/notification handlers in SDK 53+
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let notificationsModule: typeof import('expo-notifications') | null = null;
let hasInitializedHandler = false;
let hasConfiguredChannel = false;

function getNotifications(): typeof import('expo-notifications') | null {
  if (Platform.OS === 'web' || (Platform.OS === 'android' && isExpoGo)) {
    return null;
  }

  if (!notificationsModule) {
    try {
      notificationsModule = require('expo-notifications');
      if (notificationsModule && !hasInitializedHandler) {
        hasInitializedHandler = true;
        notificationsModule.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });
      }
    } catch (err) {
      logger.warn('expo-notifications module could not be loaded in current environment', err);
      return null;
    }
  }

  return notificationsModule;
}

async function ensureAndroidChannel(notifications: typeof import('expo-notifications')): Promise<void> {
  if (Platform.OS === 'android' && !hasConfiguredChannel && notifications.setNotificationChannelAsync) {
    try {
      await notifications.setNotificationChannelAsync(STUDY_REMINDER_CHANNEL_ID, {
        name: 'Daily Korean Study Reminders',
        description: 'Daily notifications reminding you to review cards, practice Korean, and keep your streak alive.',
        importance: notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#176B55',
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
      });
      hasConfiguredChannel = true;
    } catch (err) {
      logger.warn('Failed to configure Android notification channel', err);
    }
  }
}

export interface StudyReminderContent {
  sentenceKorean?: string;
  translation?: string;
  streakDays?: number;
  dueReviewsCount?: number;
}

export interface NotificationDeliveryResult {
  success: boolean;
  isSimulated: boolean;
  message: string;
  preview: {
    title: string;
    body: string;
  };
}

export function formatStudyNotificationContent(content?: StudyReminderContent | string): {
  title: string;
  body: string;
} {
  const title = 'Time for Daily Korean! 🇰🇷';

  if (!content) {
    return {
      title,
      body: 'Keep your streak alive. Review due words and practice today!',
    };
  }

  if (typeof content === 'string') {
    return {
      title,
      body: `Today's Korean: "${content}" — Tap to practice and keep your streak alive!`,
    };
  }

  const { sentenceKorean, translation, streakDays, dueReviewsCount } = content;

  let body = '';
  if (sentenceKorean) {
    const textSnippet = translation ? `"${sentenceKorean}" (${translation})` : `"${sentenceKorean}"`;
    if (streakDays !== undefined && streakDays > 0) {
      body = `🔥 ${streakDays}-day streak! ${textSnippet} — Tap to study today!`;
    } else if (dueReviewsCount !== undefined && dueReviewsCount > 0) {
      body = `📚 ${dueReviewsCount} cards waiting! ${textSnippet} — Tap to review now!`;
    } else {
      body = `${textSnippet} — Tap to practice and start today's streak!`;
    }
  } else {
    if (streakDays !== undefined && streakDays > 0) {
      body = `🔥 ${streakDays}-day streak! Don't let your streak slip away. Review today's cards!`;
    } else if (dueReviewsCount !== undefined && dueReviewsCount > 0) {
      body = `📚 You have ${dueReviewsCount} cards waiting for review. Ready to practice?`;
    } else {
      body = 'Keep your streak alive. Review due words and practice today!';
    }
  }

  return { title, body };
}

export class NotificationService {
  async requestPermissions(): Promise<boolean> {
    const notifications = getNotifications();
    if (!notifications) return false;

    try {
      const { status: existingStatus } = await notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (err) {
      logger.error('Failed to request notification permission', err);
      return false;
    }
  }

  async scheduleDailyReminder(
    settings: ReminderSettings,
    content?: StudyReminderContent | string
  ): Promise<boolean> {
    const notifications = getNotifications();
    const formatted = formatStudyNotificationContent(content);

    if (!notifications) {
      logger.info(
        `Daily reminder simulated for ${settings.hour}:${String(settings.minute).padStart(2, '0')} (local notifications disabled in Expo Go Android / Web)`
      );
      return true;
    }

    try {
      await notifications.cancelAllScheduledNotificationsAsync();

      if (!settings.enabled) return true;

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        logger.warn('Notification permission denied, unable to schedule daily reminder');
        return false;
      }

      await ensureAndroidChannel(notifications);

      await notifications.scheduleNotificationAsync({
        content: {
          title: formatted.title,
          body: formatted.body,
          sound: true,
          color: '#176B55',
          data: { type: 'daily-reminder', url: '/(tabs)/' },
        },
        trigger: {
          type: notifications.SchedulableTriggerInputTypes.DAILY,
          hour: settings.hour,
          minute: settings.minute,
          channelId: STUDY_REMINDER_CHANNEL_ID,
        },
      });
      logger.info(`Scheduled daily study notification for ${settings.hour}:${settings.minute}`);
      return true;
    } catch (err) {
      logger.error('Failed to schedule daily reminder', err);
      return false;
    }
  }

  async sendInstantStudyNotification(params: StudyReminderContent): Promise<NotificationDeliveryResult> {
    const formatted = formatStudyNotificationContent(params);
    const notifications = getNotifications();

    if (!notifications) {
      return {
        success: true,
        isSimulated: true,
        message: 'Preview simulated (Standalone Android APK delivers native OS alerts with sound & vibration).',
        preview: formatted,
      };
    }

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return {
          success: false,
          isSimulated: false,
          message: 'Notification permission is required. Please enable notifications in your device settings.',
          preview: formatted,
        };
      }

      await ensureAndroidChannel(notifications);

      await notifications.scheduleNotificationAsync({
        content: {
          title: formatted.title,
          body: formatted.body,
          sound: true,
          color: '#176B55',
          data: { type: 'instant-study-test' },
        },
        trigger: Platform.OS === 'android' ? { channelId: STUDY_REMINDER_CHANNEL_ID } : null,
      });

      return {
        success: true,
        isSimulated: false,
        message: 'Notification delivered to your device notification tray!',
        preview: formatted,
      };
    } catch (err) {
      logger.error('Failed to send immediate notification', err);
      return {
        success: false,
        isSimulated: false,
        message: 'Failed to send notification. Please try again.',
        preview: formatted,
      };
    }
  }

  async sendInstantSentenceNotification(sentenceKorean: string, translation: string): Promise<void> {
    await this.sendInstantStudyNotification({ sentenceKorean, translation });
  }

  async cancelReminders(): Promise<void> {
    const notifications = getNotifications();
    if (!notifications) return;

    try {
      await notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      logger.error('Failed to cancel notifications', err);
    }
  }
}

export const notificationService = new NotificationService();
