import { extractChoseong, isChoseongOnly, matchesChoseong } from './choseongSearch';

describe('Hangul Choseong (초성) Search Engine', () => {
  it('correctly extracts initial consonants from Hangul syllables', () => {
    expect(extractChoseong('감사합니다')).toBe('ㄱㅅㅎㄴㄷ');
    expect(extractChoseong('비빔밥')).toBe('ㅂㅂㅂ');
    expect(extractChoseong('한글')).toBe('ㅎㄱ');
    expect(extractChoseong('죄송합니다')).toBe('ㅈㅅㅎㄴㄷ');
    expect(extractChoseong('아이스 아메리카노')).toBe('ㅇㅇㅅ ㅇㅁㄹㅋㄴ');
  });

  it('identifies whether query is composed exclusively of Choseong consonants', () => {
    expect(isChoseongOnly('ㄱㅅ')).toBe(true);
    expect(isChoseongOnly('ㅂㅂㅂ')).toBe(true);
    expect(isChoseongOnly('ㅎㄱ')).toBe(true);
    expect(isChoseongOnly('hello')).toBe(false);
    expect(isChoseongOnly('한글')).toBe(false);
    expect(isChoseongOnly('')).toBe(false);
  });

  it('matches Hangul text using partial Choseong search queries', () => {
    expect(matchesChoseong('감사합니다', 'ㄱㅅ')).toBe(true);
    expect(matchesChoseong('비빔밥', 'ㅂㅂㅂ')).toBe(true);
    expect(matchesChoseong('한글', 'ㅎㄱ')).toBe(true);
    expect(matchesChoseong('한국어', 'ㅎㄱ')).toBe(true);
    expect(matchesChoseong('죄송합니다', 'ㅈㅅ')).toBe(true);

    // Negative matches
    expect(matchesChoseong('감사합니다', 'ㄴㅁ')).toBe(false);
    expect(matchesChoseong('사과', 'ㄱㅅ')).toBe(false);
  });
});
