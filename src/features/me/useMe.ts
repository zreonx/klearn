import { useState, useEffect, useCallback } from 'react';
import { services } from '@/application/services';
import { DataUseCases, LearningStats } from '@/application/useCases/dataUseCases';
import { UserSettings } from '@/domain/settings/types';
import { notificationService } from '@/infrastructure/notifications/notificationService';

const dataUseCases = new DataUseCases(services);

export function useMe() {
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [s, cfg] = await Promise.all([
        dataUseCases.getLearningStats(),
        services.settingsRepo.getUserSettings(),
      ]);
      setStats(s);
      setSettings(cfg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSettings = async (updated: Partial<UserSettings>) => {
    if (!settings) return;
    const nextSettings: UserSettings = {
      ...settings,
      ...updated,
    };
    await services.settingsRepo.saveUserSettings(nextSettings);
    setSettings(nextSettings);

    if (updated.reminder) {
      const todaySentence = services.catalog.getDailySentence(new Date());
      await notificationService.scheduleDailyReminder(nextSettings.reminder, todaySentence?.korean);
    }
  };

  const exportData = async () => {
    return await dataUseCases.exportJsonData();
  };

  const importData = async (json: string) => {
    const res = await dataUseCases.importJsonData(json);
    if (res.success) {
      await loadData();
    }
    return res;
  };

  const resetData = async () => {
    await dataUseCases.resetAllData();
    await notificationService.cancelReminders();
    await loadData();
  };

  return {
    stats,
    settings,
    loading,
    refresh: loadData,
    updateSettings,
    exportData,
    importData,
    resetData,
  };
}
