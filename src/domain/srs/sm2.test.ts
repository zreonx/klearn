import { SM2Algorithm } from './sm2';
import { ReviewRating } from './types';

describe('SM2Algorithm', () => {
  const srs = new SM2Algorithm(2.5, 1.3);
  const baseDate = new Date('2026-10-10T12:00:00Z');

  it('initializes a fresh review state correctly', () => {
    const state = srs.initialize('item-1', baseDate);
    expect(state.itemId).toBe('item-1');
    expect(state.repetition).toBe(0);
    expect(state.intervalDays).toBe(1);
    expect(state.easeFactor).toBe(2.5);
    expect(new Date(state.dueDate).toISOString()).toBe('2026-10-11T12:00:00.000Z');
  });

  it('progresses intervals on consecutive Good ratings', () => {
    let state = srs.initialize('item-1', baseDate);

    // First review: Good -> repetition 1, interval 1
    state = srs.review(state, ReviewRating.Good, baseDate);
    expect(state.repetition).toBe(1);
    expect(state.intervalDays).toBe(1);
    expect(state.easeFactor).toBe(2.5);

    // Second review: Good -> repetition 2, interval 6
    const day2 = new Date('2026-10-11T12:00:00Z');
    state = srs.review(state, ReviewRating.Good, day2);
    expect(state.repetition).toBe(2);
    expect(state.intervalDays).toBe(6);

    // Third review: Good -> repetition 3, interval 6 * 2.5 = 15
    const day8 = new Date('2026-10-17T12:00:00Z');
    state = srs.review(state, ReviewRating.Good, day8);
    expect(state.repetition).toBe(3);
    expect(state.intervalDays).toBe(15);
  });

  it('resets repetition and interval on Again rating', () => {
    let state = srs.initialize('item-1', baseDate);
    // Build up repetitions
    state = srs.review(state, ReviewRating.Good, baseDate);
    state = srs.review(state, ReviewRating.Good, baseDate);
    expect(state.repetition).toBe(2);

    // Review Again
    state = srs.review(state, ReviewRating.Again, baseDate);
    expect(state.repetition).toBe(0);
    expect(state.intervalDays).toBe(1);
    expect(state.easeFactor).toBe(2.3); // 2.5 - 0.2
  });

  it('respects minimum ease factor floor of 1.3', () => {
    let state = srs.initialize('item-1', baseDate);
    // Multiple consecutive failures
    for (let i = 0; i < 10; i++) {
      state = srs.review(state, ReviewRating.Again, baseDate);
    }
    expect(state.easeFactor).toBe(1.3);
  });

  it('increases ease factor and gives interval bonus on Easy rating', () => {
    let state = srs.initialize('item-1', baseDate);
    state = srs.review(state, ReviewRating.Easy, baseDate);
    expect(state.repetition).toBe(1);
    expect(state.intervalDays).toBe(3);
    expect(state.easeFactor).toBe(2.65);
  });
});
