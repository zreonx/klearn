import { Platform, Vibration } from 'react-native';

export class HapticService {
  /**
   * Subtle tick for tapping word tiles, toggling items, or selecting answers.
   */
  lightTick(): void {
    if (Platform.OS === 'web') return;
    try {
      Vibration.vibrate(15);
    } catch {
      // Safe fallback if unsupported
    }
  }

  /**
   * Celebratory vibration pattern for correct answers and completed dialogues.
   */
  success(): void {
    if (Platform.OS === 'web') return;
    try {
      Vibration.vibrate([0, 30, 40, 30]);
    } catch {
      // Safe fallback
    }
  }

  /**
   * Light double-tick for incorrect answers or invalid actions.
   */
  error(): void {
    if (Platform.OS === 'web') return;
    try {
      Vibration.vibrate([0, 50, 50, 50]);
    } catch {
      // Safe fallback
    }
  }
}

export const hapticService = new HapticService();
