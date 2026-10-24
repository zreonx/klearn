import { LearningRecord, createInitialLearningRecord } from '@/domain/learning/types';
import { StorageAdapter } from '../adapter';
import { APP_CONFIG } from '@/config';

export interface LearningRepository {
  getByItemId(itemId: string): Promise<LearningRecord | null>;
  save(record: LearningRecord): Promise<void>;
  getAll(): Promise<LearningRecord[]>;
  getAllAsMap(): Promise<Map<string, LearningRecord>>;
  batchSave(records: LearningRecord[]): Promise<void>;
  toggleStar(itemId: string): Promise<boolean>;
  getStarredItemIds(): Promise<string[]>;
  clear(): Promise<void>;
}

export class LearningStorageRepository implements LearningRepository {
  private adapter: StorageAdapter;
  private storageKey = APP_CONFIG.storage.keys.learningRecords;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  async getAll(): Promise<LearningRecord[]> {
    const envelope = await this.adapter.getItem<Record<string, LearningRecord>>(this.storageKey);
    if (!envelope || !envelope.data) return [];
    return Object.values(envelope.data);
  }

  async getAllAsMap(): Promise<Map<string, LearningRecord>> {
    const records = await this.getAll();
    const map = new Map<string, LearningRecord>();
    for (const r of records) {
      map.set(r.itemId, r);
    }
    return map;
  }

  async getByItemId(itemId: string): Promise<LearningRecord | null> {
    const envelope = await this.adapter.getItem<Record<string, LearningRecord>>(this.storageKey);
    if (!envelope || !envelope.data) return null;
    return envelope.data[itemId] ?? null;
  }

  async save(record: LearningRecord): Promise<void> {
    const envelope = await this.adapter.getItem<Record<string, LearningRecord>>(this.storageKey);
    const existing = envelope?.data ?? {};
    existing[record.itemId] = record;
    await this.adapter.setItem(this.storageKey, existing, APP_CONFIG.storage.currentVersion);
  }

  async batchSave(records: LearningRecord[]): Promise<void> {
    const envelope = await this.adapter.getItem<Record<string, LearningRecord>>(this.storageKey);
    const existing = envelope?.data ?? {};
    for (const record of records) {
      existing[record.itemId] = record;
    }
    await this.adapter.setItem(this.storageKey, existing, APP_CONFIG.storage.currentVersion);
  }

  async toggleStar(itemId: string): Promise<boolean> {
    let record = await this.getByItemId(itemId);
    if (!record) {
      record = createInitialLearningRecord(itemId);
    }
    const newStatus = !record.isStarred;
    record.isStarred = newStatus;
    await this.save(record);
    return newStatus;
  }

  async getStarredItemIds(): Promise<string[]> {
    const records = await this.getAll();
    return records.filter((r) => r.isStarred).map((r) => r.itemId);
  }

  async clear(): Promise<void> {
    await this.adapter.removeItem(this.storageKey);
  }
}
