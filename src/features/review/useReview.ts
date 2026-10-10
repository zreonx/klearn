import { useState, useEffect, useCallback } from 'react';
import { services } from '@/application/services';
import { ReviewUseCases, DueReviewEntry } from '@/application/useCases/reviewUseCases';
import { useReviewSessionStore } from '@/app/store/useSessionStore';
import { ReviewRating } from '@/domain/srs/types';

const reviewUseCases = new ReviewUseCases(services);

export function useReview() {
  const [loading, setLoading] = useState(false);
  const session = useReviewSessionStore();

  const loadDueQueue = useCallback(async (): Promise<DueReviewEntry[]> => {
    return await reviewUseCases.getDueReviewQueue();
  }, []);

  const startSession = async () => {
    setLoading(true);
    try {
      const queue = await reviewUseCases.getDueReviewQueue();
      session.startSession(queue);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (rating: ReviewRating) => {
    const currentEntry = session.queue[session.currentIndex];
    if (!currentEntry) return;

    await reviewUseCases.submitReview(currentEntry.item.id, rating);

    if (session.currentIndex + 1 >= session.queue.length) {
      session.resetSession();
    } else {
      session.nextCard();
    }
  };

  const speak = (text: string) => services.speech.speak(text);

  return {
    ...session,
    currentCard: session.queue[session.currentIndex] ?? null,
    loading,
    loadDueQueue,
    startSession,
    submitRating,
    speak,
  };
}
