import {
  createInitialStreakData,
  calculateUpdatedStreak,
  getEffectiveStreak,
} from './streakCalculator';

describe('Streak Calculator', () => {
  it('handles first learning day', () => {
    const initial = createInitialStreakData();
    const day1 = new Date(2026, 9, 10, 10, 0, 0); // Oct 10, 2026

    const updated = calculateUpdatedStreak(initial, day1);
    expect(updated.currentStreak).toBe(1);
    expect(updated.longestStreak).toBe(1);
    expect(updated.lastActiveDate).toBe('2026-10-10');
    expect(updated.activeDates).toEqual(['2026-10-10']);
  });

  it('increments streak on consecutive calendar day', () => {
    const initial = createInitialStreakData();
    const day1 = new Date(2026, 9, 10, 21, 0, 0); // Oct 10, 2026 9pm
    const day2 = new Date(2026, 9, 11, 8, 0, 0); // Oct 11, 2026 8am

    const state1 = calculateUpdatedStreak(initial, day1);
    const state2 = calculateUpdatedStreak(state1, day2);

    expect(state2.currentStreak).toBe(2);
    expect(state2.longestStreak).toBe(2);
    expect(state2.lastActiveDate).toBe('2026-10-11');
  });

  it('does not increment streak on multiple activities on the same day', () => {
    const initial = createInitialStreakData();
    const day1Morning = new Date(2026, 9, 10, 9, 0, 0);
    const day1Evening = new Date(2026, 9, 10, 20, 0, 0);

    const state1 = calculateUpdatedStreak(initial, day1Morning);
    const state2 = calculateUpdatedStreak(state1, day1Evening);

    expect(state2.currentStreak).toBe(1);
    expect(state2.longestStreak).toBe(1);
  });

  it('resets streak to 1 after a missed day', () => {
    const initial = createInitialStreakData();
    const day1 = new Date(2026, 9, 10, 12, 0, 0);
    const day3 = new Date(2026, 9, 12, 12, 0, 0); // Missed Oct 11

    const state1 = calculateUpdatedStreak(initial, day1);
    expect(state1.currentStreak).toBe(1);

    const state2 = calculateUpdatedStreak(state1, day3);
    expect(state2.currentStreak).toBe(1);
    expect(state2.longestStreak).toBe(1);
    expect(state2.lastActiveDate).toBe('2026-10-12');
  });

  it('correctly calculates effective streak when checking today', () => {
    let state = createInitialStreakData();
    state = calculateUpdatedStreak(state, new Date(2026, 9, 10, 12, 0, 0));
    state = calculateUpdatedStreak(state, new Date(2026, 9, 11, 12, 0, 0));
    expect(state.currentStreak).toBe(2);

    // On same day Oct 11, effective streak is 2
    expect(getEffectiveStreak(state, new Date(2026, 9, 11, 15, 0, 0))).toBe(2);

    // On next day Oct 12 (pending today's activity), effective streak is still 2
    expect(getEffectiveStreak(state, new Date(2026, 9, 12, 9, 0, 0))).toBe(2);

    // If Oct 12 is skipped and we check on Oct 13, streak is broken -> 0
    expect(getEffectiveStreak(state, new Date(2026, 9, 13, 9, 0, 0))).toBe(0);
  });
});
