import { useState, useCallback } from 'react';
import { services } from '@/application/services';
import { QuizUseCases } from '@/application/useCases/quizUseCases';
import { useQuizSessionStore } from '@/app/store/useSessionStore';
import { QuizSessionResult, QuizGenerationConfig } from '@/domain/quiz/types';
import { LearningItem } from '@/domain/learning/types';

const quizUseCases = new QuizUseCases(services);

export function useQuiz() {
  const [loading, setLoading] = useState(false);
  const session = useQuizSessionStore();

  const startQuiz = async (config?: QuizGenerationConfig) => {
    setLoading(true);
    try {
      const { questions } = await quizUseCases.createQuizSession(config);
      session.startQuiz(questions);
    } finally {
      setLoading(false);
    }
  };

  const finishQuiz = async () => {
    const totalQuestions = session.questions.length;
    const correctCount = session.correctAnswers;
    const incorrectCount = totalQuestions - correctCount;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const mistakeItems = session.mistakes
      .map((id) => services.catalog.getItemById(id))
      .filter((item): item is LearningItem => item !== undefined);

    const result: QuizSessionResult = {
      totalQuestions,
      correctCount,
      incorrectCount,
      accuracy,
      mistakeItems,
      completedAt: new Date().toISOString(),
    };

    await quizUseCases.recordQuizCompleted(result);
    session.setResult(result);
  };

  const nextStep = () => {
    if (session.currentIndex + 1 >= session.questions.length) {
      finishQuiz();
    } else {
      session.nextQuestion();
    }
  };

  const speak = (text: string) => services.speech.speak(text);

  return {
    ...session,
    currentQuestion: session.questions[session.currentIndex] ?? null,
    loading,
    startQuiz,
    nextStep,
    speak,
  };
}
