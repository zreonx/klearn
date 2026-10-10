import { z } from 'zod';
import { AppServices } from '../services';
import { APP_CONFIG } from '@/config';
import { format } from 'date-fns';

const ExportSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  learningRecords: z.array(
    z.object({
      itemId: z.string(),
      status: z.enum(['unseen', 'learning', 'reviewing', 'mastered']),
      firstLearnedAt: z.string().optional(),
      lastReviewedAt: z.string().optional(),
      reviewCount: z.number(),
      correctCount: z.number(),
      incorrectCount: z.number(),
      streak: z.number(),
    })
  ),
  reviewStates: z.array(
    z.object({
      itemId: z.string(),
      repetition: z.number(),
      intervalDays: z.number(),
      easeFactor: z.number(),
      dueDate: z.string(),
      lastReviewedAt: z.string().optional(),
    })
  ),
  userSettings: z.object({
    dailyGoal: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20)]),
    reminder: z.object({
      enabled: z.boolean(),
      hour: z.number(),
      minute: z.number(),
    }),
    speech: z.object({
      autoPlay: z.boolean(),
      rate: z.number(),
    }),
    themeMode: z.enum(['system', 'light', 'dark']).optional().default('system'),
    hasCompletedOnboarding: z.boolean(),
  }),
  streakData: z.object({
    currentStreak: z.number(),
    longestStreak: z.number(),
    lastActiveDate: z.string().nullable(),
    activeDates: z.array(z.string()),
  }),
});

export type ExportDataPayload = z.infer<typeof ExportSchema>;

export interface LearningStats {
  totalItemsLearned: number;
  totalMastered: number;
  totalReviewsDone: number;
  longestStreak: number;
  currentStreak: number;
  activeLearningDays: number;
}

export class DataUseCases {
  constructor(private services: AppServices) {}

  async getLearningStats(): Promise<LearningStats> {
    const records = await this.services.learningRepo.getAll();
    const streak = await this.services.progressRepo.getStreakData();

    const totalItemsLearned = records.filter((r) => r.status !== 'unseen').length;
    const totalMastered = records.filter((r) => r.status === 'mastered').length;
    const totalReviewsDone = records.reduce((acc, r) => acc + r.reviewCount, 0);

    return {
      totalItemsLearned,
      totalMastered,
      totalReviewsDone,
      longestStreak: streak.longestStreak,
      currentStreak: streak.currentStreak,
      activeLearningDays: streak.activeDates.length,
    };
  }

  async exportJsonData(): Promise<string> {
    const learningRecords = await this.services.learningRepo.getAll();
    const reviewStates = await this.services.reviewRepo.getAllReviewStates();
    const userSettings = await this.services.settingsRepo.getUserSettings();
    const streakData = await this.services.progressRepo.getStreakData();

    const payload: ExportDataPayload = {
      version: APP_CONFIG.storage.currentVersion,
      exportedAt: new Date().toISOString(),
      learningRecords,
      reviewStates,
      userSettings,
      streakData,
    };

    return JSON.stringify(payload, null, 2);
  }

  async importJsonData(jsonString: string): Promise<{ success: boolean; error?: string }> {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = ExportSchema.safeParse(parsed);

      if (!validation.success) {
        return {
          success: false,
          error: `Invalid data format: ${validation.error.issues.map((i) => i.message).join(', ')}`,
        };
      }

      const validData = validation.data;

      // Restore learning records
      await this.services.learningRepo.clear();
      await this.services.learningRepo.batchSave(validData.learningRecords);

      // Restore SRS review states
      await this.services.reviewRepo.clear();
      await this.services.reviewRepo.batchSave(validData.reviewStates);

      // Restore settings and streak
      await this.services.settingsRepo.saveUserSettings(validData.userSettings);
      await this.services.progressRepo.saveStreakData(validData.streakData);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to parse JSON file.',
      };
    }
  }

  async resetAllData(): Promise<void> {
    await this.services.learningRepo.clear();
    await this.services.reviewRepo.clear();
    await this.services.progressRepo.clear();
    await this.services.settingsRepo.clear();
  }
}
