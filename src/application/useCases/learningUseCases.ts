import { AppServices } from '../services';
import { createInitialLearningRecord, LearningRecord } from '@/domain/learning/types';
import { calculateUpdatedStreak } from '@/domain/streak/streakCalculator';
import { Lesson, isLessonCompleted, getLessonProgress } from '@/domain/curriculum/types';

export class LearningUseCases {
  constructor(private services: AppServices) {}

  async markItemLearned(itemId: string, now: Date = new Date()): Promise<void> {
    const existing = await this.services.learningRepo.getByItemId(itemId);
    const nowIso = now.toISOString();

    if (!existing) {
      // Create fresh learning record
      const record = createInitialLearningRecord(itemId, nowIso);
      await this.services.learningRepo.save(record);

      // Initialize spaced repetition schedule
      const srsState = this.services.srs.initialize(itemId, now);
      await this.services.reviewRepo.saveReviewState(srsState);

      // Update today's daily activity
      const activity = await this.services.progressRepo.getDailyActivity(now);
      activity.newItemsLearnedCount += 1;
      await this.services.progressRepo.saveDailyActivity(activity);

      // Update streak
      const streak = await this.services.progressRepo.getStreakData();
      const updatedStreak = calculateUpdatedStreak(streak, now);
      await this.services.progressRepo.saveStreakData(updatedStreak);
    }
  }

  async getLessonDetails(lessonId: string) {
    const lesson = this.services.catalog.getLessonById(lessonId);
    if (!lesson) return null;

    const recordsMap = await this.services.learningRepo.getAllAsMap();
    const items = lesson.itemIds
      .map((id) => this.services.catalog.getItemById(id))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);

    const progress = getLessonProgress(lesson, recordsMap);
    const isCompleted = isLessonCompleted(lesson, recordsMap);

    return {
      lesson,
      items,
      recordsMap,
      progress,
      isCompleted,
    };
  }

  async toggleStar(itemId: string): Promise<boolean> {
    return this.services.learningRepo.toggleStar(itemId);
  }

  async isItemStarred(itemId: string): Promise<boolean> {
    const record = await this.services.learningRepo.getByItemId(itemId);
    return Boolean(record?.isStarred);
  }

  async getStarredItems() {
    const ids = await this.services.learningRepo.getStarredItemIds();
    return ids
      .map((id) => this.services.catalog.getItemById(id))
      .filter((item): item is NonNullable<typeof item> => item !== undefined);
  }
}
