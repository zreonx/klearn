import { LearningItem } from '../learning/types';

export type QuizQuestionType =
  | 'korean_to_english'
  | 'english_to_korean'
  | 'listening_recognition'
  | 'hangul_to_romanization';

export interface QuizGenerationConfig {
  questionCount?: number;
  types?: QuizQuestionType[];
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
  explanation?: string;
}

export interface QuizAnswerSubmission {
  questionId: string;
  selectedOptionId: string;
}

export interface EvaluatedQuizAnswer {
  question: QuizQuestion;
  selectedOptionId: string;
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
