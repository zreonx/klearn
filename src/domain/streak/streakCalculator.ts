import { differenceInCalendarDays, parseISO, format } from 'date-fns';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // formatted as YYYY-MM-DD
  activeDates: string[]; // List of unique YYYY-MM-DD dates where goal/activity was met
}

export function createInitialStreakData(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    activeDates: [],
  };
}

/**
 * Updates the user streak when learning activity criteria is met on a given date.
 * Pure domain function with deterministic date inputs.
 */
export function calculateUpdatedStreak(
  currentData: StreakData,
  activityDate: Date
): StreakData {
  const dateKey = format(activityDate, 'yyyy-MM-dd');

  // Same day activity: streak does not increment again
  if (currentData.lastActiveDate === dateKey) {
    return currentData;
  }

  const activeDatesSet = new Set(currentData.activeDates);
  activeDatesSet.add(dateKey);
  const updatedActiveDates = Array.from(activeDatesSet).sort();

  if (!currentData.lastActiveDate) {
    // First active day ever
    return {
      currentStreak: 1,
      longestStreak: Math.max(1, currentData.longestStreak),
      lastActiveDate: dateKey,
      activeDates: updatedActiveDates,
    };
  }

  const lastDate = parseISO(currentData.lastActiveDate);
  const diffDays = differenceInCalendarDays(activityDate, lastDate);

  if (diffDays === 1) {
    // Consecutive day
    const newStreak = currentData.currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentData.longestStreak),
      lastActiveDate: dateKey,
      activeDates: updatedActiveDates,
    };
  } else if (diffDays > 1) {
    // Missed one or more days: streak resets to 1
    return {
      currentStreak: 1,
      longestStreak: currentData.longestStreak,
      lastActiveDate: dateKey,
      activeDates: updatedActiveDates,
    };
  } else {
    // Historical date before last active date: streak count unaffected, record added
    return {
      ...currentData,
      activeDates: updatedActiveDates,
    };
  }
}

/**
 * Checks whether the current streak is still alive given today's date.
 * If more than 1 calendar day has passed since the last active date, the current streak is 0.
 */
export function getEffectiveStreak(currentData: StreakData, currentDate: Date): number {
  if (!currentData.lastActiveDate || currentData.currentStreak === 0) {
    return 0;
  }

  const lastDate = parseISO(currentData.lastActiveDate);
  const diffDays = differenceInCalendarDays(currentDate, lastDate);

  if (diffDays <= 1) {
    return currentData.currentStreak;
  }

  return 0;
}
