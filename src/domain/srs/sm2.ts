import { addDays } from 'date-fns';
import { ReviewRating, ReviewState, SpacedRepetitionAlgorithm } from './types';
import { APP_CONFIG } from '@/config';

export class SM2Algorithm implements SpacedRepetitionAlgorithm {
  private readonly defaultEaseFactor: number;
  private readonly minEaseFactor: number;

  constructor(
    defaultEaseFactor = APP_CONFIG.srs.defaultEaseFactor,
    minEaseFactor = APP_CONFIG.srs.minEaseFactor
  ) {
    this.defaultEaseFactor = defaultEaseFactor;
    this.minEaseFactor = minEaseFactor;
  }

  initialize(itemId: string, now: Date = new Date()): ReviewState {
    const due = addDays(now, APP_CONFIG.srs.initialIntervalDays);
    return {
      itemId,
      repetition: 0,
      intervalDays: APP_CONFIG.srs.initialIntervalDays,
      easeFactor: this.defaultEaseFactor,
      dueDate: due.toISOString(),
      lastReviewedAt: undefined,
    };
  }

  review(state: ReviewState, rating: ReviewRating, reviewedAt: Date = new Date()): ReviewState {
    let nextRepetition = state.repetition;
    let nextIntervalDays = state.intervalDays;
    let nextEaseFactor = state.easeFactor;

    switch (rating) {
      case ReviewRating.Again: {
        // Failed recall: reset repetitions, interval to 1 day, reduce ease factor
        nextRepetition = 0;
        nextIntervalDays = 1;
        nextEaseFactor = Math.max(this.minEaseFactor, state.easeFactor - 0.2);
        break;
      }

      case ReviewRating.Hard: {
        // Recalled with effort: repetition continues, modest interval growth
        nextRepetition = state.repetition + 1;
        if (state.repetition === 0) {
          nextIntervalDays = 1;
        } else if (state.repetition === 1) {
          nextIntervalDays = 3;
        } else {
          nextIntervalDays = Math.max(state.intervalDays + 1, Math.round(state.intervalDays * 1.2));
        }
        nextEaseFactor = Math.max(this.minEaseFactor, state.easeFactor - 0.15);
        break;
      }

      case ReviewRating.Good: {
        // Standard SM-2 progression
        nextRepetition = state.repetition + 1;
        if (state.repetition === 0) {
          nextIntervalDays = APP_CONFIG.srs.initialIntervalDays; // 1
        } else if (state.repetition === 1) {
          nextIntervalDays = APP_CONFIG.srs.secondIntervalDays; // 6
        } else {
          nextIntervalDays = Math.round(state.intervalDays * state.easeFactor);
        }
        // SM-2 quality q = 4: EF change = 0.1 - (5 - 4)*(0.08 + (5 - 4)*0.02) = 0.1 - 0.10 = 0
        // Ease factor remains stable
        break;
      }

      case ReviewRating.Easy: {
        // Instant recall: increase interval bonus & ease factor
        nextRepetition = state.repetition + 1;
        if (state.repetition === 0) {
          nextIntervalDays = 3;
        } else if (state.repetition === 1) {
          nextIntervalDays = 8;
        } else {
          nextIntervalDays = Math.round(state.intervalDays * state.easeFactor * 1.3);
        }
        // SM-2 quality q = 5: EF change = 0.1 - 0 = +0.10
        nextEaseFactor = Math.min(3.0, state.easeFactor + 0.15);
        break;
      }
    }

    const nextDueDate = addDays(reviewedAt, nextIntervalDays);

    return {
      itemId: state.itemId,
      repetition: nextRepetition,
      intervalDays: nextIntervalDays,
      easeFactor: Number(nextEaseFactor.toFixed(2)),
      dueDate: nextDueDate.toISOString(),
      lastReviewedAt: reviewedAt.toISOString(),
    };
  }

  getNextReviewDate(state: ReviewState): Date {
    return new Date(state.dueDate);
  }
}

export const defaultSRS: SpacedRepetitionAlgorithm = new SM2Algorithm();
