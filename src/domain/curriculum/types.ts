import { LearningRecord } from '../learning/types';

export type SkillType =
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing';

export type StageId =
  | 'stage-foundations'
  | 'stage-everyday'
  | 'stage-independent'
  | 'stage-advanced'
  | 'stage-mastery';

export interface Stage {
  id: StageId;
  order: number;
  title: string;
  subtitle: string;
  topikBenchmark: string;
  practicalOutcome: string;
  colorToken?: string;
  levels: Level[];
}

export interface LessonConceptNote {
  summary: string;
  explanation: string;
  grammarTip?: string;
  formalityLevel?: 'formal' | 'polite' | 'casual';
}

export interface DialogueLine {
  speaker: string; // e.g. "민수", "지우"
  korean: string;
  translation: string;
  romanization?: string;
}

export interface LessonDialogue {
  title: string;
  description: string;
  lines: DialogueLine[];
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  koreanTitle?: string;
  description: string;
  order: number;
  skills?: SkillType[];
  prerequisites?: string[];
  learningObjectives?: string[];
  conceptNote?: LessonConceptNote;
  dialogue?: LessonDialogue;
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
  stageId?: StageId;
  title: string;
  description: string;
  order: number;
  units: Unit[];
}

export interface Curriculum {
  stages?: Stage[];
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
 * Checks if a lesson is unlocked.
 * A lesson is unlocked if it has no prerequisites, or if all prerequisite lessons are completed.
 */
export function isLessonUnlocked(
  lesson: Lesson,
  allLessonsMap: Map<string, Lesson>,
  recordsMap: Map<string, LearningRecord>
): boolean {
  if (!lesson.prerequisites || lesson.prerequisites.length === 0) {
    return true;
  }
  return lesson.prerequisites.every((prereqId) => {
    const prereqLesson = allLessonsMap.get(prereqId);
    if (!prereqLesson) return true;
    return isLessonCompleted(prereqLesson, recordsMap);
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
