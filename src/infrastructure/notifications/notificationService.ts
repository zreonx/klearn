import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { ReminderSettings } from '@/domain/settings/types';
import { logger } from '@/lib/logger';

// Expo Go on Android removed native push/notification handlers in SDK 53+
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let notificationsModule: typeof import('expo-notifications') | null = null;
let hasInitializedHandler = false;

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

  async scheduleDailyReminder(settings: ReminderSettings, dailySentenceKorean?: string): Promise<void> {
    const notifications = getNotifications();
    if (!notifications) {
      logger.info('Daily reminder simulated (local notifications disabled in Expo Go Android / Web)');
      return;
    }

    try {
      await notifications.cancelAllScheduledNotificationsAsync();

      if (!settings.enabled) return;

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      const notificationBody = dailySentenceKorean
        ? `Today's Korean: "${dailySentenceKorean}" — Tap to practice and keep your streak alive!`
        : 'Keep your streak alive. Review due words and practice today!';

      await notifications.scheduleNotificationAsync({
        content: {
          title: 'Daily Korean Sentence 🇰🇷',
          body: notificationBody,
          sound: true,
        },
        trigger: {
          type: notifications.SchedulableTriggerInputTypes.DAILY,
          hour: settings.hour,
          minute: settings.minute,
        },
      });
      logger.info(`Scheduled daily sentence notification for ${settings.hour}:${settings.minute}`);
    } catch (err) {
      logger.error('Failed to schedule daily reminder', err);
    }
  }

  async sendInstantSentenceNotification(sentenceKorean: string, translation: string): Promise<void> {
    const notifications = getNotifications();
    if (!notifications) return;

    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await notifications.scheduleNotificationAsync({
        content: {
          title: 'Today\'s Korean Sentence 🇰🇷',
          body: `${sentenceKorean} — ${translation}`,
          sound: true,
        },
        trigger: null, // triggers immediately
      });
    } catch (err) {
      logger.error('Failed to send immediate notification', err);
    }
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
