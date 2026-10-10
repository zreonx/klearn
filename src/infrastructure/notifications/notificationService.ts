import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ReminderSettings } from '@/domain/settings/types';
import { logger } from '@/lib/logger';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (err) {
      logger.error('Failed to request notification permission', err);
      return false;
    }
  }

  async scheduleDailyReminder(settings: ReminderSettings): Promise<void> {
    if (Platform.OS === 'web') return;

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (!settings.enabled) return;

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for Korean! 🇰🇷',
          body: 'Keep your streak alive. Review due words and learn today.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: settings.hour,
          minute: settings.minute,
        },
      });
      logger.info(`Scheduled daily reminder for ${settings.hour}:${settings.minute}`);
    } catch (err) {
      logger.error('Failed to schedule daily reminder', err);
    }
  }

  async cancelReminders(): Promise<void> {
    if (Platform.OS === 'web') return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      logger.error('Failed to cancel notifications', err);
    }
  }
}

export const notificationService = new NotificationService();
