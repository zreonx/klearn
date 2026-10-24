import { LearningItem } from '../learning/types';

export type QuizQuestionType =
  | 'korean_to_english'
  | 'english_to_korean'
  | 'listening_recognition'
  | 'acoustic_discrimination'
  | 'hangul_to_romanization'
  | 'particle_fill'
  | 'sentence_assembly';

export interface QuizGenerationConfig {
  questionCount?: number;
  types?: QuizQuestionType[];
  starredOnly?: boolean;
}

export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  itemId: string;
  type: QuizQuestionType;
  prompt: string;
  subPrompt?: string;
  speakText?: string; // Text for speech if applicable
  options: QuizOption[];
  correctAnswerId: string;
  correctAnswerText?: string;
  tiles?: string[]; // Scrambled tiles for sentence assembly
  explanation?: string;
}

export interface QuizAnswerSubmission {
  questionId: string;
  selectedOptionId?: string;
  assembledSentence?: string;
}

export interface EvaluatedQuizAnswer {
  question: QuizQuestion;
  selectedOptionId?: string;
  assembledSentence?: string;
  isCorrect: boolean;
}

export interface QuizSessionResult {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  accuracy: number; // 0 to 100
  mistakeItems: LearningItem[];
  completedAt: string;
}
