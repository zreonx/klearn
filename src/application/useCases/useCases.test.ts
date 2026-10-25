import { InMemoryStorageAdapter } from '@/infrastructure/storage/adapter';
import { LearningStorageRepository } from '@/infrastructure/storage/repositories/learningRepository';
import { ReviewStorageRepository } from '@/infrastructure/storage/repositories/reviewRepository';
import { ProgressStorageRepository } from '@/infrastructure/storage/repositories/progressRepository';
import { SettingsStorageRepository } from '@/infrastructure/storage/repositories/settingsRepository';
import { defaultSRS } from '@/domain/srs/sm2';
import { contentCatalog } from '@/content/catalog';
import { AppServices } from '../services';
import { LearningUseCases } from './learningUseCases';
import { ReviewUseCases } from './reviewUseCases';
import { DashboardUseCases } from './dashboardUseCases';
import { DataUseCases } from './dataUseCases';
import { ReviewRating } from '@/domain/srs/types';

describe('Application Use Cases', () => {
  let mockServices: AppServices;
  let adapter: InMemoryStorageAdapter;

  beforeEach(() => {
    adapter = new InMemoryStorageAdapter();
    mockServices = {
      learningRepo: new LearningStorageRepository(adapter),
      reviewRepo: new ReviewStorageRepository(adapter),
      progressRepo: new ProgressStorageRepository(adapter),
      settingsRepo: new SettingsStorageRepository(adapter),
      aiChatRepo: { getMessages: jest.fn().mockResolvedValue([]), saveMessages: jest.fn(), clearMessages: jest.fn() } as any,
      srs: defaultSRS,
      catalog: contentCatalog,
      speech: { speak: jest.fn(), stop: jest.fn() } as any,
      voiceRecognition: { isListening: jest.fn(), startListening: jest.fn(), stopListening: jest.fn(), cancelListening: jest.fn() } as any,
      aiTutor: { generateReply: jest.fn().mockResolvedValue(null) } as any,
      aiChat: { askTutor: jest.fn().mockResolvedValue({ content: 'Mock answer', provider: 'offline' }) } as any,
    };
  });

  it('marks item as learned, schedules SRS review, and updates streak', async () => {
    const learningUseCases = new LearningUseCases(mockServices);
    const day1 = new Date('2026-10-10T12:00:00Z');

    await learningUseCases.markItemLearned('voc-greet-1', day1);

    // Verify learning record
    const record = await mockServices.learningRepo.getByItemId('voc-greet-1');
    expect(record).not.toBeNull();
    expect(record?.status).toBe('learning');

    // Verify SRS schedule
    const srsState = await mockServices.reviewRepo.getReviewState('voc-greet-1');
    expect(srsState).not.toBeNull();
    expect(srsState?.repetition).toBe(0);

    // Verify daily activity & streak
    const activity = await mockServices.progressRepo.getDailyActivity(day1);
    expect(activity.newItemsLearnedCount).toBe(1);

    const streak = await mockServices.progressRepo.getStreakData();
    expect(streak.currentStreak).toBe(1);
  });

  it('submits review rating, advances SM-2 schedule, and records progress', async () => {
    const learningUseCases = new LearningUseCases(mockServices);
    const reviewUseCases = new ReviewUseCases(mockServices);

    const learnDate = new Date('2026-10-08T12:00:00Z');
    await learningUseCases.markItemLearned('voc-greet-1', learnDate);

    // Check due review on 2026-10-10
    const reviewDate = new Date('2026-10-10T12:00:00Z');
    const queue = await reviewUseCases.getDueReviewQueue(reviewDate);
    expect(queue.length).toBe(1);
    expect(queue[0].item.id).toBe('voc-greet-1');

    // Submit Good rating
    await reviewUseCases.submitReview('voc-greet-1', ReviewRating.Good, reviewDate);

    const updatedState = await mockServices.reviewRepo.getReviewState('voc-greet-1');
    expect(updatedState?.repetition).toBe(1);

    const updatedRecord = await mockServices.learningRepo.getByItemId('voc-greet-1');
    expect(updatedRecord?.reviewCount).toBe(1);
    expect(updatedRecord?.correctCount).toBe(1);
  });

  it('computes Today Dashboard data with appropriate recommendations', async () => {
    const dashboardUseCases = new DashboardUseCases(mockServices);
    const now = new Date('2026-10-10T12:00:00Z');

    const data = await dashboardUseCases.getTodayDashboard(now);
    expect(data.dailyWord).toBeDefined();
    expect(data.goalTarget).toBe(10);
    expect(data.isGoalReached).toBe(false);
    expect(data.recommendation.type).toBe('continue_lesson');
  });

  it('exports learning data and successfully validates and imports JSON', async () => {
    const learningUseCases = new LearningUseCases(mockServices);
    const dataUseCases = new DataUseCases(mockServices);

    await learningUseCases.markItemLearned('voc-greet-1');
    const exportedJson = await dataUseCases.exportJsonData();
    expect(exportedJson).toContain('voc-greet-1');

    // Clear data
    await dataUseCases.resetAllData();
    const recordsAfterReset = await mockServices.learningRepo.getAll();
    expect(recordsAfterReset.length).toBe(0);

    // Import data back
    const result = await dataUseCases.importJsonData(exportedJson);
    expect(result.success).toBe(true);

    const restoredRecords = await mockServices.learningRepo.getAll();
    expect(restoredRecords.length).toBe(1);
    expect(restoredRecords[0].itemId).toBe('voc-greet-1');
  });

  it('rejects invalid JSON import with descriptive error', async () => {
    const dataUseCases = new DataUseCases(mockServices);
    const result = await dataUseCases.importJsonData('{ "invalid": true }');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid data format');
  });

  it('computes SRS mastery distribution, 7-day review forecast, and 6-skill profile in getLearningStats', async () => {
    const learningUseCases = new LearningUseCases(mockServices);
    const dataUseCases = new DataUseCases(mockServices);

    await learningUseCases.markItemLearned('voc-greet-1');
    const stats = await dataUseCases.getLearningStats();

    expect(stats.totalItemsLearned).toBe(1);
    expect(stats.masteryDistribution.learning).toBe(1);
    expect(stats.masteryDistribution.totalCatalog).toBeGreaterThan(50);
    expect(stats.reviewForecast.length).toBe(7);
    expect(stats.reviewForecast[0].label).toBe('Today');
    expect(stats.learnerProfile.skills.vocabulary).toBeDefined();
    expect(stats.learnerProfile.skills.grammar).toBeDefined();
    expect(stats.achievements.length).toBeGreaterThanOrEqual(5);
    expect(stats.achievements[0].isUnlocked).toBe(true); // 'First Step' unlocked
  });
});
