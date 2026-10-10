import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageEnvelope, wrapInEnvelope } from './envelope';
import { logger } from '@/lib/logger';

export interface StorageAdapter {
  getItem<T>(key: string): Promise<StorageEnvelope<T> | null>;
  setItem<T>(key: string, data: T, version?: number): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class AsyncStorageAdapter implements StorageAdapter {
  async getItem<T>(key: string): Promise<StorageEnvelope<T> | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as StorageEnvelope<T>;
    } catch (err) {
      logger.error(`Error reading key ${key} from AsyncStorage`, err);
      return null;
    }
  }

  async setItem<T>(key: string, data: T, version = 1): Promise<void> {
    try {
      const envelope = wrapInEnvelope(data, version);
      await AsyncStorage.setItem(key, JSON.stringify(envelope));
    } catch (err) {
      logger.error(`Error writing key ${key} to AsyncStorage`, err);
      throw err;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      logger.error(`Error removing key ${key} from AsyncStorage`, err);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (err) {
      logger.error('Error clearing AsyncStorage', err);
    }
  }
}

export class InMemoryStorageAdapter implements StorageAdapter {
  private store = new Map<string, string>();

  async getItem<T>(key: string): Promise<StorageEnvelope<T> | null> {
    const raw = this.store.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as StorageEnvelope<T>;
  }

  async setItem<T>(key: string, data: T, version = 1): Promise<void> {
    const envelope = wrapInEnvelope(data, version);
    this.store.set(key, JSON.stringify(envelope));
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

export const defaultStorageAdapter: StorageAdapter = new AsyncStorageAdapter();
