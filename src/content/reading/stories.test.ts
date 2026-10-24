import { CULTURAL_STORIES } from './stories';

describe('Cultural Stories Catalog', () => {
  it('contains curated stories across learning stages', () => {
    expect(CULTURAL_STORIES.length).toBeGreaterThanOrEqual(4);
  });

  it('provides sentences with vocab annotations and valid comprehension checks', () => {
    CULTURAL_STORIES.forEach((story) => {
      expect(story.id).toBeTruthy();
      expect(story.titleKorean).toBeTruthy();
      expect(story.titleEnglish).toBeTruthy();
      expect(story.sentences.length).toBeGreaterThanOrEqual(3);

      story.sentences.forEach((s) => {
        expect(s.korean).toBeTruthy();
        expect(s.translation).toBeTruthy();
        expect(s.vocab.length).toBeGreaterThan(0);
      });

      expect(story.comprehension.options.length).toBe(4);
      expect(story.comprehension.correctAnswerIndex).toBeGreaterThanOrEqual(0);
      expect(story.comprehension.correctAnswerIndex).toBeLessThan(4);
      expect(story.comprehension.explanation).toBeTruthy();
    });
  });
});
