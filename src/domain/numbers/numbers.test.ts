import { toSinoKorean } from './sinoKorean';
import { toNativeKorean } from './nativeKorean';
import { formatKoreanClockTime, KOREAN_COUNTERS } from './counters';

describe('Korean Number Systems & Counters Engine', () => {
  describe('Sino-Korean Converter (toSinoKorean)', () => {
    it('converts single digits correctly', () => {
      expect(toSinoKorean(0)).toBe('영');
      expect(toSinoKorean(1)).toBe('일');
      expect(toSinoKorean(5)).toBe('오');
      expect(toSinoKorean(9)).toBe('구');
    });

    it('converts 10 to 99 correctly', () => {
      expect(toSinoKorean(10)).toBe('십');
      expect(toSinoKorean(11)).toBe('십일');
      expect(toSinoKorean(20)).toBe('이십');
      expect(toSinoKorean(35)).toBe('삼십오');
      expect(toSinoKorean(99)).toBe('구십구');
    });

    it('converts hundreds and thousands', () => {
      expect(toSinoKorean(100)).toBe('백');
      expect(toSinoKorean(150)).toBe('백오십');
      expect(toSinoKorean(1000)).toBe('천');
      expect(toSinoKorean(4500)).toBe('사천오백');
    });

    it('converts tens of thousands (만) and millions', () => {
      expect(toSinoKorean(10000)).toBe('만');
      expect(toSinoKorean(25000)).toBe('이만 오천');
      expect(toSinoKorean(50000)).toBe('오만');
      expect(toSinoKorean(100000)).toBe('십만');
      expect(toSinoKorean(1000000)).toBe('백만');
    });
  });

  describe('Native Korean Converter (toNativeKorean)', () => {
    it('converts standalone numbers 1-9', () => {
      expect(toNativeKorean(1, false)).toBe('하나');
      expect(toNativeKorean(2, false)).toBe('둘');
      expect(toNativeKorean(3, false)).toBe('셋');
      expect(toNativeKorean(4, false)).toBe('넷');
      expect(toNativeKorean(5, false)).toBe('다섯');
    });

    it('applies contractions before counters (1->한, 2->두, 3->세, 4->네)', () => {
      expect(toNativeKorean(1, true)).toBe('한');
      expect(toNativeKorean(2, true)).toBe('두');
      expect(toNativeKorean(3, true)).toBe('세');
      expect(toNativeKorean(4, true)).toBe('네');
      expect(toNativeKorean(5, true)).toBe('다섯');
    });

    it('converts tens (10, 20, 30...)', () => {
      expect(toNativeKorean(10, false)).toBe('열');
      expect(toNativeKorean(20, false)).toBe('스물');
      expect(toNativeKorean(20, true)).toBe('스무'); // 스무 살
      expect(toNativeKorean(30, false)).toBe('서른');
      expect(toNativeKorean(40, false)).toBe('마흔');
      expect(toNativeKorean(50, false)).toBe('쉰');
    });

    it('converts compound native numbers with contractions', () => {
      expect(toNativeKorean(21, false)).toBe('스물하나');
      expect(toNativeKorean(21, true)).toBe('스물한'); // 스물한 개
      expect(toNativeKorean(32, true)).toBe('서른두'); // 서른두 살
    });
  });

  describe('Clock Time Formatter (formatKoreanClockTime)', () => {
    it('combines Native hours and Sino minutes', () => {
      const time = formatKoreanClockTime(15, 45); // 3:45 PM
      expect(time.period).toBe('오후');
      expect(time.hourPart).toBe('세 시');
      expect(time.minutePart).toBe('사십오 분');
      expect(time.korean).toBe('오후 세 시 사십오 분');
    });

    it('handles half past (반)', () => {
      const time = formatKoreanClockTime(9, 30); // 9:30 AM
      expect(time.period).toBe('오전');
      expect(time.hourPart).toBe('아홉 시');
      expect(time.minutePart).toBe('반');
      expect(time.korean).toBe('오전 아홉 시 반');
    });

    it('handles exact hour (정각)', () => {
      const time = formatKoreanClockTime(12, 0); // 12:00 PM
      expect(time.period).toBe('오후');
      expect(time.hourPart).toBe('열두 시');
      expect(time.minutePart).toBe('정각');
    });
  });

  describe('Korean Counters Catalog', () => {
    it('contains essential daily counters', () => {
      const ids = KOREAN_COUNTERS.map((c) => c.id);
      expect(ids).toContain('gae');
      expect(ids).toContain('myeong');
      expect(ids).toContain('jan');
      expect(ids).toContain('byeong');
      expect(ids).toContain('mari');
      expect(ids).toContain('won');
      expect(ids).toContain('sal');
    });
  });
});
