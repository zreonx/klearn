export type LearningItemType =
  | 'hangul_consonant'
  | 'hangul_vowel'
  | 'hangul_syllable'
  | 'vocabulary'
  | 'phrase'
  | 'grammar';

export interface ExampleSentence {
  korean: string;
  translation: string;
  romanization?: string;
}

export interface LearningItem {
  id: string;
  type: LearningItemType;
  korean: string;
  romanization?: string;
  translation: string;
  pronunciation?: string;
  explanation?: string;
  examples?: ExampleSentence[];
  tags?: string[];
  lessonId?: string;
}

export type LearningStatus = 'unseen' | 'learning' | 'reviewing' | 'mastered';

export interface LearningRecord {
  itemId: string;
  status: LearningStatus;
  firstLearnedAt?: string;
  lastReviewedAt?: string;
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  streak: number;
  isStarred?: boolean;
}

export function createInitialLearningRecord(itemId: string, learnedAt = new Date().toISOString()): LearningRecord {
  return {
    itemId,
    status: 'learning',
    firstLearnedAt: learnedAt,
    lastReviewedAt: learnedAt,
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    streak: 0,
    isStarred: false,
  };
}
