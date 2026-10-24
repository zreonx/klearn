import { AppServices } from '../services';
import {
  QuizQuestion,
  QuizSessionResult,
  QuizGenerationConfig,
} from '@/domain/quiz/types';
import { generateQuizQuestions } from '@/domain/quiz/generator';
import { LearningItem } from '@/domain/learning/types';

export class QuizUseCases {
  constructor(private services: AppServices) {}

  async createQuizSession(
    config: QuizGenerationConfig = {}
  ): Promise<{ questions: QuizQuestion[]; items: LearningItem[] }> {
    const allCatalog = this.services.catalog.getAllItems();
    const learnedRecords = await this.services.learningRepo.getAll();

    let targetItems: LearningItem[] = [];

    if (learnedRecords.length > 0) {
      targetItems = learnedRecords
        .map((r) => this.services.catalog.getItemById(r.itemId))
        .filter((item): item is LearningItem => item !== undefined);
    }

    // Fallback: If learner has no learned records yet, use the first 6 items from catalog
    if (targetItems.length === 0) {
      targetItems = allCatalog.slice(0, 6);
    }

    if (config.starredOnly) {
      const starredIds = await this.services.learningRepo.getStarredItemIds();
      const starredItems = starredIds
        .map((id) => this.services.catalog.getItemById(id))
        .filter((item): item is LearningItem => item !== undefined);
      if (starredItems.length > 0) {
        targetItems = starredItems;
      }
    }

    const questions = generateQuizQuestions(targetItems, allCatalog, config);

    return {
      questions,
      items: targetItems,
    };
  }

  async recordQuizCompleted(result: QuizSessionResult, now: Date = new Date()): Promise<void> {
    const activity = await this.services.progressRepo.getDailyActivity(now);
    activity.quizzesCompletedCount += 1;
    await this.services.progressRepo.saveDailyActivity(activity);
  }
}
