import { UserSettings, createDefaultUserSettings } from '@/domain/settings/types';
import { StorageAdapter } from '../adapter';
import { APP_CONFIG } from '@/config';

export interface SettingsRepository {
  getUserSettings(): Promise<UserSettings>;
  saveUserSettings(settings: UserSettings): Promise<void>;
  clear(): Promise<void>;
}

export class SettingsStorageRepository implements SettingsRepository {
  private adapter: StorageAdapter;
  private settingsKey = APP_CONFIG.storage.keys.userSettings;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  async getUserSettings(): Promise<UserSettings> {
    const envelope = await this.adapter.getItem<UserSettings>(this.settingsKey);
    if (envelope?.data) return envelope.data;
    return createDefaultUserSettings();
  }

  async saveUserSettings(settings: UserSettings): Promise<void> {
    await this.adapter.setItem(this.settingsKey, settings, APP_CONFIG.storage.currentVersion);
  }

  async clear(): Promise<void> {
    await this.adapter.removeItem(this.settingsKey);
  }
}
