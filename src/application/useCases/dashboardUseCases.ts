import { AppServices } from '../services';
import { LearningItem } from '@/domain/learning/types';
import { Lesson, isLessonCompleted } from '@/domain/curriculum/types';
import {
  calculateDailyActivityScore,
  calculateDailyGoalProgress,
  isDailyGoalReached,
} from '@/domain/progress/dailyGoal';
import { getEffectiveStreak } from '@/domain/streak/streakCalculator';

export type RecommendedActionType = 'review' | 'learn' | 'continue_lesson' | 'quiz';

export interface RecommendedAction {
  type: RecommendedActionType;
  title: string;
  description: string;
  route: string;
  badge?: string;
}

export interface TodayDashboardData {
  dailyWord: LearningItem;
  dueReviewsCount: number;
  newItemsCount: number;
  reviewsCompletedToday: number;
  goalTarget: number;
  goalScore: number;
  goalProgress: number; // 0 to 1
  isGoalReached: boolean;
  streak: number;
  recommendation: RecommendedAction;
  nextLesson?: Lesson;
}

export class DashboardUseCases {
  constructor(private services: AppServices) {}

  async getTodayDashboard(now: Date = new Date()): Promise<TodayDashboardData> {
    const dailyWord = this.services.catalog.getDailyWord(now);
    const dueReviews = await this.services.reviewRepo.getDueReviews(now);
    const dueReviewsCount = dueReviews.length;

    const activity = await this.services.progressRepo.getDailyActivity(now);
    const settings = await this.services.settingsRepo.getUserSettings();
    const streakData = await this.services.progressRepo.getStreakData();
    const effectiveStreak = getEffectiveStreak(streakData, now);

    // Synchronize target with current user settings if changed
    activity.goalTarget = settings.dailyGoal;
    const goalScore = calculateDailyActivityScore(activity);
    const goalProgress = calculateDailyGoalProgress(activity);
    const isGoalReached = isDailyGoalReached(activity);

    // Find next uncompleted lesson in curriculum
    const curriculum = this.services.catalog.getCurriculum();
    const recordsMap = await this.services.learningRepo.getAllAsMap();
    let nextLesson: Lesson | undefined;

    for (const level of curriculum.levels) {
      for (const unit of level.units) {
        for (const lesson of unit.lessons) {
          if (!isLessonCompleted(lesson, recordsMap)) {
            nextLesson = lesson;
            break;
          }
        }
        if (nextLesson) break;
      }
      if (nextLesson) break;
    }

    // Determine recommendation per Section 65:
    // 1. If due reviews exist -> Review
    // 2. Else if goal remains unreached & next lesson exists -> Learn / Continue Lesson
    // 3. Else -> Practice Quiz
    let recommendation: RecommendedAction;

    if (dueReviewsCount > 0) {
      recommendation = {
        type: 'review',
        title: 'Review Due Cards',
        description: `You have ${dueReviewsCount} card${dueReviewsCount > 1 ? 's' : ''} scheduled for spaced review.`,
        route: '/review',
        badge: `${dueReviewsCount} Due`,
      };
    } else if (nextLesson) {
      recommendation = {
        type: 'continue_lesson',
        title: `Continue: ${nextLesson.title}`,
        description: nextLesson.description,
        route: `/learn/${nextLesson.id}`,
        badge: 'Recommended',
      };
    } else {
      recommendation = {
        type: 'quiz',
        title: 'Practice with Quiz',
        description: 'Test your Korean retention with a quick practice quiz.',
        route: '/quiz/session',
        badge: 'Practice',
      };
    }

    return {
      dailyWord,
      dueReviewsCount,
      newItemsCount: activity.newItemsLearnedCount,
      reviewsCompletedToday: activity.reviewsCompletedCount,
      goalTarget: activity.goalTarget,
      goalScore,
      goalProgress,
      isGoalReached,
      streak: effectiveStreak,
      recommendation,
      nextLesson,
    };
  }
}
