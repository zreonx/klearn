import { evaluateAchievements } from './evaluator';
import { createInitialLearningRecord } from '../learning/types';

describe('Achievements Evaluator', () => {
  it('correctly unlocks achievements based on learner milestones', () => {
    const records = [
      createInitialLearningRecord('item-1'),
      createInitialLearningRecord('item-2'),
      createInitialLearningRecord('item-3'),
    ];
    records[0].isStarred = true;
    records[1].isStarred = true;
    records[2].isStarred = true;

    const streak = {
      currentStreak: 4,
      longestStreak: 4,
      lastActiveDate: '2026-10-24',
      activeDates: ['2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24'],
    };

    const achievements = evaluateAchievements({
      records,
      streak,
      totalReviewsDone: 30,
    });

    const firstStep = achievements.find((a) => a.id === 'ach-first-step');
    expect(firstStep?.isUnlocked).toBe(true);

    const streak3 = achievements.find((a) => a.id === 'ach-streak-3');
    expect(streak3?.isUnlocked).toBe(true);

    const collector = achievements.find((a) => a.id === 'ach-collector');
    expect(collector?.isUnlocked).toBe(true);

    const reviewer = achievements.find((a) => a.id === 'ach-active-reviewer');
    expect(reviewer?.isUnlocked).toBe(true);

    // 7-day streak still locked
    const streak7 = achievements.find((a) => a.id === 'ach-streak-7');
    expect(streak7?.isUnlocked).toBe(false);
  });
});
