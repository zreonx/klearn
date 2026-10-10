import { LearningItem, LearningRecord } from '../learning/types';

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  koreanTitle?: string;
  description: string;
  order: number;
  itemIds: string[];
}

export interface Unit {
  id: string;
  levelId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Level {
  id: string;
  title: string;
  description: string;
  order: number;
  units: Unit[];
}

export interface Curriculum {
  levels: Level[];
}

/**
 * Checks if a lesson is completed based on learning records.
 * A lesson is considered completed if all of its itemIds are recorded as learned/reviewing/mastered.
 */
export function isLessonCompleted(lesson: Lesson, recordsMap: Map<string, LearningRecord>): boolean {
  if (lesson.itemIds.length === 0) return true;
  return lesson.itemIds.every((id) => {
    const record = recordsMap.get(id);
    return record && record.status !== 'unseen';
  });
}

/**
 * Calculates percentage completion for a lesson (0 to 1).
 */
export function getLessonProgress(lesson: Lesson, recordsMap: Map<string, LearningRecord>): number {
  if (lesson.itemIds.length === 0) return 1;
  const completedCount = lesson.itemIds.filter((id) => {
    const record = recordsMap.get(id);
    return record && record.status !== 'unseen';
  }).length;
  return completedCount / lesson.itemIds.length;
}
