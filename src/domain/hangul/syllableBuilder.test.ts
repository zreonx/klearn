import {
  composeHangulSyllable,
  CHOSEONG_LIST,
  JUNGSEONG_LIST,
  JONGSEONG_LIST,
} from './syllableBuilder';

describe('Hangul Syllable Builder Domain', () => {
  it('composes basic CV syllables without batchim (e.g., 가 = ㄱ + ㅏ)', () => {
    const result = composeHangulSyllable(0, 0, 0);
    expect(result.char).toBe('가');
    expect(result.codePoint).toBe(0xac00);
    expect(result.romanization).toBe('ga');
    expect(result.structure).toBe('CV');
    expect(result.formula).toBe('ㄱ + ㅏ = 가');
  });

  it('composes CVC syllables with batchim (e.g., 한 = ㅎ + ㅏ + ㄴ)', () => {
    const result = composeHangulSyllable(18, 0, 4);
    expect(result.char).toBe('한');
    expect(result.romanization).toBe('han');
    expect(result.structure).toBe('CVC');
    expect(result.formula).toBe('ㅎ + ㅏ + ㄴ = 한');
    expect(result.meaningHint).toContain('Korean');
  });

  it('composes silent initial ㅇ syllables properly (e.g., 아 = ㅇ + ㅏ)', () => {
    const result = composeHangulSyllable(11, 0, 0);
    expect(result.char).toBe('아');
    expect(result.romanization).toBe('a');
    expect(result.structure).toBe('CV');
  });

  it('composes the final Unicode Hangul syllable 힣 (ㅎ + ㅣ + ㅎ)', () => {
    const result = composeHangulSyllable(
      CHOSEONG_LIST.length - 1,
      JUNGSEONG_LIST.length - 1,
      JONGSEONG_LIST.length - 1
    );
    expect(result.char).toBe('힣');
    expect(result.codePoint).toBe(0xd7a3);
    expect(result.structure).toBe('CVC');
  });
});
