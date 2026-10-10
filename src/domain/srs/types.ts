export enum ReviewRating {
  Again = 'again',
  Hard = 'hard',
  Good = 'good',
  Easy = 'easy',
}

export interface ReviewState {
  itemId: string;
  repetition: number;
  intervalDays: number;
  easeFactor: number;
  dueDate: string; // ISO string
  lastReviewedAt?: string; // ISO string
}

export interface SpacedRepetitionAlgorithm {
  initialize(itemId: string, now?: Date): ReviewState;
  review(state: ReviewState, rating: ReviewRating, reviewedAt: Date): ReviewState;
  getNextReviewDate(state: ReviewState): Date;
}
