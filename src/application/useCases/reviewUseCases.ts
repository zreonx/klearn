import { AppServices } from '../services';
import { ReviewRating, ReviewState } from '@/domain/srs/types';
import { LearningItem } from '@/domain/learning/types';
import { calculateUpdatedStreak } from '@/domain/streak/streakCalculator';

export interface DueReviewEntry {
  item: LearningItem;
  state: ReviewState;
}

export class ReviewUseCases {
  constructor(private services: AppServices) {}

  async getDueReviewQueue(now: Date = new Date()): Promise<DueReviewEntry[]> {
    const dueStates = await this.services.reviewRepo.getDueReviews(now);
    const queue: DueReviewEntry[] = [];

    for (const state of dueStates) {
      const item = this.services.catalog.getItemById(state.itemId);
      if (item) {
        queue.push({ item, state });
      }
    }

    return queue;
  }

  async submitReview(
    itemId: string,
    rating: ReviewRating,
    now: Date = new Date()
  ): Promise<void> {
    const currentState = await this.services.reviewRepo.getReviewState(itemId);
    if (!currentState) return;

    // Apply SRS algorithm
    const nextState = this.services.srs.review(currentState, rating, now);
    await this.services.reviewRepo.saveReviewState(nextState);

    // Update corresponding learning record
    const record = await this.services.learningRepo.getByItemId(itemId);
    if (record) {
      record.reviewCount += 1;
      record.lastReviewedAt = now.toISOString();

      if (rating === ReviewRating.Again) {
        record.incorrectCount += 1;
        record.streak = 0;
      } else {
        record.correctCount += 1;
        record.streak += 1;
        // If spaced repetition interval reaches over 21 days, consider mastered
        if (nextState.intervalDays >= 21) {
          record.status = 'mastered';
        } else {
          record.status = 'reviewing';
        }
      }

      await this.services.learningRepo.save(record);
    }

    // Increment reviews on today's daily activity
    const activity = await this.services.progressRepo.getDailyActivity(now);
    activity.reviewsCompletedCount += 1;
    await this.services.progressRepo.saveDailyActivity(activity);

    // Update learning streak
    const streak = await this.services.progressRepo.getStreakData();
    const updatedStreak = calculateUpdatedStreak(streak, now);
    await this.services.progressRepo.saveStreakData(updatedStreak);
  }
}
