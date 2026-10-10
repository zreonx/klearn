import { InMemoryStorageAdapter } from '../adapter';
import { LearningStorageRepository } from './learningRepository';
import { ReviewStorageRepository } from './reviewRepository';
import { ProgressStorageRepository } from './progressRepository';
import { SettingsStorageRepository } from './settingsRepository';
import { createInitialLearningRecord } from '@/domain/learning/types';
import { ReviewRating } from '@/domain/srs/types';
import { defaultSRS } from '@/domain/srs/sm2';

describe('Storage Repositories', () => {
  let adapter: InMemoryStorageAdapter;

  beforeEach(() => {
    adapter = new InMemoryStorageAdapter();
  });

  it('saves and retrieves learning records', async () => {
    const repo = new LearningStorageRepository(adapter);
    const record = createInitialLearningRecord('item-123');

    await repo.save(record);
    const retrieved = await repo.getByItemId('item-123');

    expect(retrieved).not.toBeNull();
    expect(retrieved?.itemId).toBe('item-123');
    expect(retrieved?.status).toBe('learning');

    const all = await repo.getAll();
    expect(all.length).toBe(1);
  });

  it('correctly filters due reviews based on date', async () => {
    const repo = new ReviewStorageRepository(adapter);
    const now = new Date('2026-10-10T12:00:00Z');

    const dueItem = defaultSRS.initialize('due-item', new Date('2026-10-08T12:00:00Z'));
    // dueDate is 2026-10-09, which is <= now
    await repo.saveReviewState(dueItem);

    const futureItem = defaultSRS.initialize('future-item', now);
    // dueDate is 2026-10-11, which is > now
    await repo.saveReviewState(futureItem);

    const dueList = await repo.getDueReviews(now);
    expect(dueList.length).toBe(1);
    expect(dueList[0].itemId).toBe('due-item');
  });

  it('persists and retrieves user settings', async () => {
    const repo = new SettingsStorageRepository(adapter);
    const defaults = await repo.getUserSettings();
    expect(defaults.dailyGoal).toBe(10);
    expect(defaults.reminder.enabled).toBe(false);

    await repo.saveUserSettings({
      ...defaults,
      dailyGoal: 20,
      reminder: { enabled: true, hour: 19, minute: 30 },
    });

    const updated = await repo.getUserSettings();
    expect(updated.dailyGoal).toBe(20);
    expect(updated.reminder.enabled).toBe(true);
    expect(updated.reminder.hour).toBe(19);
  });
});
