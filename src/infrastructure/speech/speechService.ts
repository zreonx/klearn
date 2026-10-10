import * as Speech from 'expo-speech';
import { logger } from '@/lib/logger';

export interface SpeechOptions {
  rate?: number; // 0.5 to 1.5
  language?: string; // default 'ko-KR'
}

export class SpeechService {
  private isSpeaking = false;

  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    try {
      if (this.isSpeaking) {
        await Speech.stop();
      }

      this.isSpeaking = true;
      Speech.speak(text, {
        language: options.language ?? 'ko-KR',
        rate: options.rate ?? 0.9,
        onDone: () => {
          this.isSpeaking = false;
        },
        onError: (err) => {
          this.isSpeaking = false;
          logger.warn('Speech error', err);
        },
      });
    } catch (err) {
      this.isSpeaking = false;
      logger.error('Failed to trigger speech', err);
    }
  }

  async stop(): Promise<void> {
    try {
      this.isSpeaking = false;
      await Speech.stop();
    } catch (err) {
      logger.error('Failed to stop speech', err);
    }
  }
}

export const speechService = new SpeechService();
