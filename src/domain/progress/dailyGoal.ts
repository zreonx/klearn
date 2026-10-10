import { format } from 'date-fns';
import { APP_CONFIG, DailyGoalTarget } from '@/config';

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  newItemsLearnedCount: number;
  reviewsCompletedCount: number;
  quizzesCompletedCount: number;
  goalTarget: number;
}

export function createInitialDailyActivity(
  date = new Date(),
  goalTarget: DailyGoalTarget = APP_CONFIG.dailyGoal.defaultTarget
): DailyActivityRecord {
  return {
    date: format(date, 'yyyy-MM-dd'),
    newItemsLearnedCount: 0,
    reviewsCompletedCount: 0,
    quizzesCompletedCount: 0,
    goalTarget,
  };
}

/**
 * Total learning activity units completed towards today's goal.
 * By default: (new items learned) + (reviews completed).
 */
export function calculateDailyActivityScore(activity: DailyActivityRecord): number {
  return activity.newItemsLearnedCount + activity.reviewsCompletedCount;
}

/**
 * Returns completion ratio (0.0 to 1.0+).
 */
export function calculateDailyGoalProgress(activity: DailyActivityRecord): number {
  if (activity.goalTarget <= 0) return 1;
  const score = calculateDailyActivityScore(activity);
  return Math.min(score / activity.goalTarget, 1);
}

export function isDailyGoalReached(activity: DailyActivityRecord): boolean {
  return calculateDailyActivityScore(activity) >= activity.goalTarget;
}
