import { StorageAdapter } from '../adapter';
import { ChatMessage } from '@/domain/aiChat/types';
import { logger } from '@/lib/logger';

const AI_CHAT_KEY = '@klearn_ai_chat_history_v1';

export interface AIChatRepository {
  getMessages(): Promise<ChatMessage[]>;
  saveMessages(messages: ChatMessage[]): Promise<void>;
  clearMessages(): Promise<void>;
}

export class AIChatStorageRepository implements AIChatRepository {
  constructor(private adapter: StorageAdapter) {}

  async getMessages(): Promise<ChatMessage[]> {
    try {
      const envelope = await this.adapter.getItem<ChatMessage[]>(AI_CHAT_KEY);
      if (!envelope || !envelope.data) return [];
      return envelope.data;
    } catch (err) {
      logger.error('Failed to get AI chat messages from storage', err);
      return [];
    }
  }

  async saveMessages(messages: ChatMessage[]): Promise<void> {
    try {
      // Keep most recent 50 messages to preserve performance and storage
      const trimmed = messages.slice(-50);
      await this.adapter.setItem(AI_CHAT_KEY, trimmed);
    } catch (err) {
      logger.error('Failed to save AI chat messages to storage', err);
    }
  }

  async clearMessages(): Promise<void> {
    try {
      await this.adapter.removeItem(AI_CHAT_KEY);
    } catch (err) {
      logger.error('Failed to clear AI chat messages from storage', err);
    }
  }
}
