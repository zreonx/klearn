import { useState, useEffect, useCallback } from 'react';
import { services } from '@/application/services';
import { LearningUseCases } from '@/application/useCases/learningUseCases';
import { Curriculum, Lesson } from '@/domain/curriculum/types';
import { LearningRecord, LearningItem } from '@/domain/learning/types';

const learningUseCases = new LearningUseCases(services);

export function useLearn() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [recordsMap, setRecordsMap] = useState<Map<string, LearningRecord>>(new Map());
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const curr = services.catalog.getCurriculum();
      const records = await services.learningRepo.getAllAsMap();
      setCurriculum(curr);
      setRecordsMap(records);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const markItemLearned = async (itemId: string) => {
    await learningUseCases.markItemLearned(itemId);
    const updatedMap = await services.learningRepo.getAllAsMap();
    setRecordsMap(updatedMap);
  };

  const speak = (text: string) => services.speech.speak(text);

  return {
    curriculum,
    recordsMap,
    loading,
    refresh: loadData,
    markItemLearned,
    speak,
    getLessonDetails: (lessonId: string) => learningUseCases.getLessonDetails(lessonId),
  };
}
