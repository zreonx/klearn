import { format } from 'date-fns';
import { DailyActivityRecord, createInitialDailyActivity } from '@/domain/progress/dailyGoal';
import { StreakData, createInitialStreakData } from '@/domain/streak/streakCalculator';
import { StorageAdapter } from '../adapter';
import { APP_CONFIG } from '@/config';

export interface ProgressRepository {
  getDailyActivity(date?: Date): Promise<DailyActivityRecord>;
  saveDailyActivity(record: DailyActivityRecord): Promise<void>;
  getStreakData(): Promise<StreakData>;
  saveStreakData(streak: StreakData): Promise<void>;
  clear(): Promise<void>;
}

export class ProgressStorageRepository implements ProgressRepository {
  private adapter: StorageAdapter;
  private progressKey = APP_CONFIG.storage.keys.dailyProgress;
  private streakKey = APP_CONFIG.storage.keys.streakData;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  async getDailyActivity(date: Date = new Date()): Promise<DailyActivityRecord> {
    const dateKey = format(date, 'yyyy-MM-dd');
    const envelope = await this.adapter.getItem<Record<string, DailyActivityRecord>>(this.progressKey);
    const stored = envelope?.data?.[dateKey];
    if (stored) return stored;
    return createInitialDailyActivity(date);
  }

  async saveDailyActivity(record: DailyActivityRecord): Promise<void> {
    const envelope = await this.adapter.getItem<Record<string, DailyActivityRecord>>(this.progressKey);
    const existing = envelope?.data ?? {};
    existing[record.date] = record;
    await this.adapter.setItem(this.progressKey, existing, APP_CONFIG.storage.currentVersion);
  }

  async getStreakData(): Promise<StreakData> {
    const envelope = await this.adapter.getItem<StreakData>(this.streakKey);
    if (envelope?.data) return envelope.data;
    return createInitialStreakData();
  }

  async saveStreakData(streak: StreakData): Promise<void> {
    await this.adapter.setItem(this.streakKey, streak, APP_CONFIG.storage.currentVersion);
  }

  async clear(): Promise<void> {
    await this.adapter.removeItem(this.progressKey);
    await this.adapter.removeItem(this.streakKey);
  }
}
