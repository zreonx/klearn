import { Achievement } from './types';
import { LearningRecord } from '../learning/types';
import { StreakData } from '../streak/streakCalculator';

export interface AchievementEvaluationInput {
  records: LearningRecord[];
  streak: StreakData;
  totalReviewsDone: number;
}

export function evaluateAchievements(input: AchievementEvaluationInput): Achievement[] {
  const { records, streak, totalReviewsDone } = input;

  const totalLearned = records.filter((r) => r.status !== 'unseen').length;
  const starredCount = records.filter((r) => r.isStarred).length;
  const masteredCount = records.filter((r) => r.status === 'mastered').length;

  return [
    {
      id: 'ach-first-step',
      title: 'First Step',
      koreanTitle: '첫걸음',
      description: 'Learn your first Korean vocabulary or Hangul item.',
      icon: 'flag-outline',
      isUnlocked: totalLearned >= 1,
      progressText: `${Math.min(1, totalLearned)} / 1 item`,
    },
    {
      id: 'ach-streak-3',
      title: '3-Day Fire',
      koreanTitle: '불꽃 열정',
      description: 'Build a 3-day consecutive study streak.',
      icon: 'flame-outline',
      isUnlocked: streak.longestStreak >= 3,
      progressText: `${Math.min(3, streak.longestStreak)} / 3 days`,
    },
    {
      id: 'ach-streak-7',
      title: 'Weekly Warrior',
      koreanTitle: '일주일 완주',
      description: 'Reach a 7-day study streak without breaking the chain.',
      icon: 'trophy-outline',
      isUnlocked: streak.longestStreak >= 7,
      progressText: `${Math.min(7, streak.longestStreak)} / 7 days`,
    },
    {
      id: 'ach-collector',
      title: 'Star Collector',
      koreanTitle: '단어 수집가',
      description: 'Star 3 or more tricky cards for targeted review.',
      icon: 'star-outline',
      isUnlocked: starredCount >= 3,
      progressText: `${Math.min(3, starredCount)} / 3 starred`,
    },
    {
      id: 'ach-srs-master',
      title: 'Memory Master',
      koreanTitle: '기억의 달인',
      description: 'Graduate 5 items into the SRS Mastered tier.',
      icon: 'sparkles-outline',
      isUnlocked: masteredCount >= 5,
      progressText: `${Math.min(5, masteredCount)} / 5 mastered`,
    },
    {
      id: 'ach-active-reviewer',
      title: 'Review Machine',
      koreanTitle: '복습왕',
      description: 'Complete 25 spaced repetition card reviews.',
      icon: 'repeat-outline',
      isUnlocked: totalReviewsDone >= 25,
      progressText: `${Math.min(25, totalReviewsDone)} / 25 reviews`,
    },
  ];
}
