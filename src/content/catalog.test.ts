import { contentCatalog } from './catalog';

describe('ContentCatalog', () => {
  it('contains all items and resolves every curriculum lesson item', () => {
    const curriculum = contentCatalog.getCurriculum();
    expect(curriculum.levels.length).toBeGreaterThan(0);

    for (const level of curriculum.levels) {
      for (const unit of level.units) {
        for (const lesson of unit.lessons) {
          expect(lesson.itemIds.length).toBeGreaterThan(0);
          for (const itemId of lesson.itemIds) {
            const item = contentCatalog.getItemById(itemId);
            expect(item).toBeDefined();
            expect(item?.korean).toBeTruthy();
          }
        }
      }
    }
  });

  it('provides deterministic daily word for the same date', () => {
    const date1 = new Date(2026, 9, 10, 8, 0, 0); // Oct 10 8:00 AM
    const date2 = new Date(2026, 9, 10, 21, 30, 0); // Oct 10 9:30 PM

    const word1 = contentCatalog.getDailyWord(date1);
    const word2 = contentCatalog.getDailyWord(date2);

    expect(word1.id).toBe(word2.id);
  });

  it('provides deterministic daily phrase of type phrase for the same date', () => {
    const date1 = new Date(2026, 9, 10, 8, 0, 0);
    const date2 = new Date(2026, 9, 10, 21, 30, 0);

    const phrase1 = contentCatalog.getDailyPhrase(date1);
    const phrase2 = contentCatalog.getDailyPhrase(date2);

    expect(phrase1.id).toBe(phrase2.id);
    expect(phrase1.type).toBe('phrase');
  });
});

