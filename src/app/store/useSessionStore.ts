import { create } from 'zustand';
import { QuizQuestion, QuizSessionResult } from '@/domain/quiz/types';
import { DueReviewEntry } from '@/application/useCases/reviewUseCases';

interface ReviewSessionState {
  isActive: boolean;
  currentIndex: number;
  queue: DueReviewEntry[];
  isFlipped: boolean;
  completedCount: number;
  startSession: (queue: DueReviewEntry[]) => void;
  flipCard: () => void;
  nextCard: () => void;
  resetSession: () => void;
}

export const useReviewSessionStore = create<ReviewSessionState>((set) => ({
  isActive: false,
  currentIndex: 0,
  queue: [],
  isFlipped: false,
  completedCount: 0,

  startSession: (queue) =>
    set({
      isActive: true,
      currentIndex: 0,
      queue,
      isFlipped: false,
      completedCount: 0,
    }),

  flipCard: () => set((state) => ({ isFlipped: !state.isFlipped })),

  nextCard: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      isFlipped: false,
      completedCount: state.completedCount + 1,
    })),

  resetSession: () =>
    set({
      isActive: false,
      currentIndex: 0,
      queue: [],
      isFlipped: false,
      completedCount: 0,
    }),
}));

interface QuizSessionState {
  isActive: boolean;
  currentIndex: number;
  questions: QuizQuestion[];
  selectedOptionId: string | null;
  hasAnswered: boolean;
  correctAnswers: number;
  mistakes: string[]; // itemIds
  result: QuizSessionResult | null;

  startQuiz: (questions: QuizQuestion[]) => void;
  selectOption: (optionId: string) => void;
  submitAnswer: (customIsCorrect?: boolean) => void;
  nextQuestion: () => void;
  setResult: (result: QuizSessionResult) => void;
  resetQuiz: () => void;
}

export const useQuizSessionStore = create<QuizSessionState>((set) => ({
  isActive: false,
  currentIndex: 0,
  questions: [],
  selectedOptionId: null,
  hasAnswered: false,
  correctAnswers: 0,
  mistakes: [],
  result: null,

  startQuiz: (questions) =>
    set({
      isActive: true,
      currentIndex: 0,
      questions,
      selectedOptionId: null,
      hasAnswered: false,
      correctAnswers: 0,
      mistakes: [],
      result: null,
    }),

  selectOption: (optionId) =>
    set((state) => (state.hasAnswered ? {} : { selectedOptionId: optionId })),

  submitAnswer: (customIsCorrect?: boolean) =>
    set((state) => {
      if (state.hasAnswered) return {};
      const currentQ = state.questions[state.currentIndex];
      const isCorrect =
        customIsCorrect !== undefined
          ? customIsCorrect
          : Boolean(state.selectedOptionId && currentQ.correctAnswerId === state.selectedOptionId);

      return {
        hasAnswered: true,
        correctAnswers: isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
        mistakes: isCorrect ? state.mistakes : [...state.mistakes, currentQ.itemId],
      };
    }),

  nextQuestion: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      selectedOptionId: null,
      hasAnswered: false,
    })),

  setResult: (result) => set({ result, isActive: false }),

  resetQuiz: () =>
    set({
      isActive: false,
      currentIndex: 0,
      questions: [],
      selectedOptionId: null,
      hasAnswered: false,
      correctAnswers: 0,
      mistakes: [],
      result: null,
    }),
}));
