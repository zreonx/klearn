import { HANGUL_CATEGORIES } from './alphabetData';

describe('Hangul Alphabet Data', () => {
  it('contains all 6 essential phonetic categories', () => {
    expect(HANGUL_CATEGORIES.length).toBe(6);
    const categoryIds = HANGUL_CATEGORIES.map((c) => c.id);
    expect(categoryIds).toContain('basic-consonants');
    expect(categoryIds).toContain('aspirated-consonants');
    expect(categoryIds).toContain('tense-consonants');
    expect(categoryIds).toContain('basic-vowels');
    expect(categoryIds).toContain('compound-vowels');
    expect(categoryIds).toContain('batchim');
  });

  it('ensures every character has valid korean, romanization, and audioText', () => {
    for (const category of HANGUL_CATEGORIES) {
      expect(category.characters.length).toBeGreaterThan(0);
      for (const char of category.characters) {
        expect(char.char).toBeTruthy();
        expect(char.name).toBeTruthy();
        expect(char.romanization).toBeTruthy();
        expect(char.soundDescription).toBeTruthy();
        expect(char.audioText).toBeTruthy();
        if (char.exampleWord) {
          expect(char.exampleWord.korean).toBeTruthy();
          expect(char.exampleWord.romanization).toBeTruthy();
          expect(char.exampleWord.translation).toBeTruthy();
        }
      }
    }
  });
});
