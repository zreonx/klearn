import { ReviewState } from '@/domain/srs/types';
import { StorageAdapter } from '../adapter';
import { APP_CONFIG } from '@/config';

export interface ReviewRepository {
  getReviewState(itemId: string): Promise<ReviewState | null>;
  saveReviewState(state: ReviewState): Promise<void>;
  getAllReviewStates(): Promise<ReviewState[]>;
  getDueReviews(now?: Date): Promise<ReviewState[]>;
  batchSave(states: ReviewState[]): Promise<void>;
  clear(): Promise<void>;
}

export class ReviewStorageRepository implements ReviewRepository {
  private adapter: StorageAdapter;
  private storageKey = APP_CONFIG.storage.keys.reviewStates;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  async getAllReviewStates(): Promise<ReviewState[]> {
    const envelope = await this.adapter.getItem<Record<string, ReviewState>>(this.storageKey);
    if (!envelope || !envelope.data) return [];
    return Object.values(envelope.data);
  }

  async getReviewState(itemId: string): Promise<ReviewState | null> {
    const envelope = await this.adapter.getItem<Record<string, ReviewState>>(this.storageKey);
    if (!envelope || !envelope.data) return null;
    return envelope.data[itemId] ?? null;
  }

  async saveReviewState(state: ReviewState): Promise<void> {
    const envelope = await this.adapter.getItem<Record<string, ReviewState>>(this.storageKey);
    const existing = envelope?.data ?? {};
    existing[state.itemId] = state;
    await this.adapter.setItem(this.storageKey, existing, APP_CONFIG.storage.currentVersion);
  }

  async batchSave(states: ReviewState[]): Promise<void> {
    const envelope = await this.adapter.getItem<Record<string, ReviewState>>(this.storageKey);
    const existing = envelope?.data ?? {};
    for (const state of states) {
      existing[state.itemId] = state;
    }
    await this.adapter.setItem(this.storageKey, existing, APP_CONFIG.storage.currentVersion);
  }

  async getDueReviews(now: Date = new Date()): Promise<ReviewState[]> {
    const all = await this.getAllReviewStates();
    const nowIso = now.toISOString();
    return all
      .filter((state) => state.dueDate <= nowIso)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }

  async clear(): Promise<void> {
    await this.adapter.removeItem(this.storageKey);
  }
}
