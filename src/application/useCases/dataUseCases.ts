import { z } from 'zod';
import { AppServices } from '../services';
import { APP_CONFIG } from '@/config';
import { addDays, endOfDay, format, isAfter, isBefore, startOfDay } from 'date-fns';
import {
  calculateLearnerProfile,
  LearnerProfileSnapshot,
} from '@/domain/learning/learnerEngine';
import { LearningRecord } from '@/domain/learning/types';
import { Achievement } from '@/domain/achievements/types';
import { evaluateAchievements } from '@/domain/achievements/evaluator';

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
      isStarred: z.boolean().optional(),
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
    aiTutor: z
      .object({
        provider: z.enum(['offline', 'groq', 'openrouter', 'gemini', 'deepseek']),
        apiKey: z.string().optional(),
        modelName: z.string().optional(),
      })
      .optional(),
  }),
  streakData: z.object({
    currentStreak: z.number(),
    longestStreak: z.number(),
    lastActiveDate: z.string().nullable(),
    activeDates: z.array(z.string()),
  }),
});

export type ExportDataPayload = z.infer<typeof ExportSchema>;

export interface MasteryDistribution {
  unseen: number;
  learning: number;
  reviewing: number;
  mastered: number;
  totalCatalog: number;
}

export interface ReviewForecastDay {
  dateKey: string;
  label: string;
  dueCount: number;
}

export interface LearningStats {
  totalItemsLearned: number;
  totalMastered: number;
  totalReviewsDone: number;
  longestStreak: number;
  currentStreak: number;
  activeLearningDays: number;
  masteryDistribution: MasteryDistribution;
  reviewForecast: ReviewForecastDay[];
  learnerProfile: LearnerProfileSnapshot;
  achievements: Achievement[];
}

export class DataUseCases {
  constructor(private services: AppServices) {}

  async getLearningStats(): Promise<LearningStats> {
    const records = await this.services.learningRepo.getAll();
    const reviewStates = await this.services.reviewRepo.getAllReviewStates();
    const streak = await this.services.progressRepo.getStreakData();
    const allItems = this.services.catalog.getAllItems();

    const totalItemsLearned = records.filter((r) => r.status !== 'unseen').length;
    const totalMastered = records.filter((r) => r.status === 'mastered').length;
    const totalReviewsDone = records.reduce((acc, r) => acc + r.reviewCount, 0);

    const learningCount = records.filter((r) => r.status === 'learning').length;
    const reviewingCount = records.filter((r) => r.status === 'reviewing').length;
    const totalCatalog = allItems.length;
    const unseenCount = Math.max(0, totalCatalog - totalItemsLearned);

    const masteryDistribution: MasteryDistribution = {
      unseen: unseenCount,
      learning: learningCount,
      reviewing: reviewingCount,
      mastered: totalMastered,
      totalCatalog,
    };

    const now = new Date();
    const reviewForecast: ReviewForecastDay[] = [];
    for (let offset = 0; offset < 7; offset++) {
      const targetDay = addDays(now, offset);
      const dayStart = startOfDay(targetDay);
      const dayEnd = endOfDay(targetDay);
      const dateKey = format(targetDay, 'yyyy-MM-dd');
      const label = offset === 0 ? 'Today' : offset === 1 ? 'Tmrw' : format(targetDay, 'EEE');

      const dueCount = reviewStates.filter((state) => {
        const due = new Date(state.dueDate);
        if (offset === 0) {
          return !isAfter(due, dayEnd);
        }
        return !isBefore(due, dayStart) && !isAfter(due, dayEnd);
      }).length;

      reviewForecast.push({ dateKey, label, dueCount });
    }

    const recordsMap = new Map<string, LearningRecord>(records.map((r) => [r.itemId, r]));
    const itemTypeMap = new Map<string, string>(allItems.map((i) => [i.id, i.type]));
    const learnerProfile = calculateLearnerProfile(recordsMap, itemTypeMap);
    const achievements = evaluateAchievements({ records, streak, totalReviewsDone });

    return {
      totalItemsLearned,
      totalMastered,
      totalReviewsDone,
      longestStreak: streak.longestStreak,
      currentStreak: streak.currentStreak,
      activeLearningDays: streak.activeDates.length,
      masteryDistribution,
      reviewForecast,
      learnerProfile,
      achievements,
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
