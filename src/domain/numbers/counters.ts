/**
 * Korean Counter nouns (단위 명사) reference & practice models.
 */

import { toNativeKorean } from './nativeKorean';
import { toSinoKorean } from './sinoKorean';

export type NumberSystem = 'native' | 'sino';

export interface KoreanCounter {
  id: string;
  hangul: string;
  romanization: string;
  system: NumberSystem;
  usedFor: string;
  exampleKorean: string;
  exampleTranslation: string;
  tip: string;
}

export const KOREAN_COUNTERS: KoreanCounter[] = [
  {
    id: 'gae',
    hangul: '개',
    romanization: 'gae',
    system: 'native',
    usedFor: 'General items & objects',
    exampleKorean: '사과 한 개 주세요.',
    exampleTranslation: 'Please give me one apple.',
    tip: 'The most universal counter in Korean. Use when unsure of specific counter.',
  },
  {
    id: 'myeong',
    hangul: '명',
    romanization: 'myeong',
    system: 'native',
    usedFor: 'People (informal/polite)',
    exampleKorean: '두 명이에요.',
    exampleTranslation: 'There are two of us (at restaurant).',
    tip: 'For honorific contexts (elders, guests), use 분 (bun) instead.',
  },
  {
    id: 'jan',
    hangul: '잔',
    romanization: 'jan',
    system: 'native',
    usedFor: 'Cups and glasses of drinks',
    exampleKorean: '아메리카노 두 잔 부탁해요.',
    exampleTranslation: 'Two iced Americanos, please.',
    tip: 'Essential for cafe & restaurant ordering.',
  },
  {
    id: 'byeong',
    hangul: '병',
    romanization: 'byeong',
    system: 'native',
    usedFor: 'Bottles of liquids',
    exampleKorean: '생수 한 병 사 왔어요.',
    exampleTranslation: 'I bought one bottle of water.',
    tip: 'Used for water, beer, soju bottles.',
  },
  {
    id: 'mari',
    hangul: '마리',
    romanization: 'mari',
    system: 'native',
    usedFor: 'Animals, fish, birds',
    exampleKorean: '고양이 세 마리가 있어요.',
    exampleTranslation: 'There are three cats.',
    tip: 'Used for pets, zoo animals, and fried chicken (한 마리 = 1 whole chicken).',
  },
  {
    id: 'gwon',
    hangul: '권',
    romanization: 'gwon',
    system: 'native',
    usedFor: 'Books, magazines, notebooks',
    exampleKorean: '한국어 책 두 권 샀어요.',
    exampleTranslation: 'I bought two Korean language books.',
    tip: 'Used for bound paper volumes.',
  },
  {
    id: 'sal',
    hangul: '살',
    romanization: 'sal',
    system: 'native',
    usedFor: 'Age (years old)',
    exampleKorean: '스물세 살이에요.',
    exampleTranslation: 'I am 23 years old.',
    tip: 'Formal honorific age uses 세 (se) with Sino-Korean numbers.',
  },
  {
    id: 'si',
    hangul: '시',
    romanization: 'si',
    system: 'native',
    usedFor: 'Clock hours',
    exampleKorean: '지금 네 시예요.',
    exampleTranslation: 'It is 4:00 right now.',
    tip: 'Hours always use Native numbers: 한 시, 두 시, 세 시, 네 시...',
  },
  {
    id: 'bun',
    hangul: '분',
    romanization: 'bun',
    system: 'sino',
    usedFor: 'Clock minutes',
    exampleKorean: '삼십 분 뒤에 만나요.',
    exampleTranslation: 'Let us meet in 30 minutes.',
    tip: 'Minutes always use Sino-Korean numbers: 십 분, 이십 분, 삼십 분...',
  },
  {
    id: 'won',
    hangul: '원',
    romanization: 'won',
    system: 'sino',
    usedFor: 'Korean Currency (KRW)',
    exampleKorean: '만 오천 원입니다.',
    exampleTranslation: 'That will be 15,000 Won.',
    tip: 'Always uses Sino-Korean. 10,000 is 만 (man), 100,000 is 십만 (sip-man).',
  },
  {
    id: 'cheung',
    hangul: '층',
    romanization: 'cheung',
    system: 'sino',
    usedFor: 'Building floors',
    exampleKorean: '삼 층으로 올라가세요.',
    exampleTranslation: 'Please go up to the 3rd floor.',
    tip: 'Ground floor is 1층 (일 층), basement is 지하 1층 (B1).',
  },
  {
    id: 'beon',
    hangul: '번',
    romanization: 'beon',
    system: 'sino',
    usedFor: 'Bus numbers, sequence numbers',
    exampleKorean: '143번 버스를 타세요.',
    exampleTranslation: 'Take bus number 143 (백사십삼 번).',
    tip: 'When counting repetitions (e.g. "three times"), use Native Korean: 세 번.',
  },
];

/**
 * Formats a Korean time string combining Native hours and Sino minutes.
 * e.g., (3, 45) -> "오후 세 시 사십오 분"
 */
export function formatKoreanClockTime(hour: number, minute: number): {
  korean: string;
  hourPart: string;
  minutePart: string;
  period: string;
} {
  const normHour = Math.max(0, Math.min(23, hour));
  const normMinute = Math.max(0, Math.min(59, minute));

  const isPM = normHour >= 12;
  const period = isPM ? '오후' : '오전';

  let displayHour = normHour % 12;
  if (displayHour === 0) displayHour = 12;

  const hourPart = `${toNativeKorean(displayHour, true)} 시`;
  let minutePart = '';
  if (normMinute === 0) {
    minutePart = '정각';
  } else if (normMinute === 30) {
    minutePart = '반';
  } else {
    minutePart = `${toSinoKorean(normMinute)} 분`;
  }

  const korean = `${period} ${hourPart} ${minutePart}`.trim();
  return { korean, hourPart, minutePart, period };
}
