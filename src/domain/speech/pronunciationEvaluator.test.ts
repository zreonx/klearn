import {
  evaluatePronunciation,
  decomposeHangulToJamos,
  stringToJamoSequence,
} from './pronunciationEvaluator';

describe('pronunciationEvaluator', () => {
  describe('decomposeHangulToJamos', () => {
    it('decomposes CV syllables into initial and medial', () => {
      const jamos = decomposeHangulToJamos('가');
      expect(jamos).toEqual(['ㄱ', 'ㅏ']);
    });

    it('decomposes CVC syllables with batchim', () => {
      const jamos = decomposeHangulToJamos('한');
      expect(jamos).toEqual(['ㅎ', 'ㅏ', 'ㄴ']);
    });

    it('handles non-Hangul characters gracefully', () => {
      const jamos = decomposeHangulToJamos('A');
      expect(jamos).toEqual(['A']);
    });
  });

  describe('stringToJamoSequence', () => {
    it('creates continuous Jamo string ignoring spaces', () => {
      const seq = stringToJamoSequence('한국어');
      expect(seq).toContain('ㅎ');
      expect(seq).toContain('ㅏ');
      expect(seq).toContain('ㄴ');
      expect(seq).toContain('ㄱ');
      expect(seq).toContain('ㅜ');
      expect(seq).toContain('ㄱ');
      expect(seq).toContain('ㅇ');
      expect(seq).toContain('ㅓ');
    });
  });

  describe('evaluatePronunciation', () => {
    it('gives 100% and perfect rating on exact match', () => {
      const result = evaluatePronunciation('안녕하세요', '안녕하세요');
      expect(result.score).toBe(100);
      expect(result.rating).toBe('perfect');
      expect(result.syllableBreakdown.every((s) => s.isMatch)).toBe(true);
    });

    it('ignores punctuation and spacing differences on exact match', () => {
      const result = evaluatePronunciation('안녕 하세요!', '안녕하세요');
      expect(result.score).toBe(100);
      expect(result.rating).toBe('perfect');
    });

    it('computes high score for minor vowel slip (e.g. ㅔ vs ㅐ)', () => {
      const result = evaluatePronunciation('안녕하세요', '안녕하새요');
      expect(result.score).toBeGreaterThanOrEqual(80);
      expect(result.rating).toBe('great');
      // The 4th syllable '세' vs '새' differs
      expect(result.syllableBreakdown[3].isMatch).toBe(false);
    });

    it('handles completely different speech with low score', () => {
      const result = evaluatePronunciation('안녕하세요', '감사합니다');
      expect(result.score).toBeLessThan(40);
      expect(result.rating).toBe('retry');
    });

    it('handles empty spoken input safely', () => {
      const result = evaluatePronunciation('감사합니다', '');
      expect(result.score).toBe(0);
      expect(result.rating).toBe('retry');
      expect(result.spokenClean).toBe('');
    });
  });
});
