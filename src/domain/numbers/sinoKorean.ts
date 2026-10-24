/**
 * Pure domain logic for Sino-Korean numbers (한자어 수사).
 * Used for: Money (원), minutes (분), dates (년/월/일), phone numbers, addresses, math.
 */

const SINO_DIGITS: Record<number, { korean: string; rom: string }> = {
  0: { korean: '영', rom: 'yeong' },
  1: { korean: '일', rom: 'il' },
  2: { korean: '이', rom: 'i' },
  3: { korean: '삼', rom: 'sam' },
  4: { korean: '사', rom: 'sa' },
  5: { korean: '오', rom: 'o' },
  6: { korean: '육', rom: 'yuk' },
  7: { korean: '칠', rom: 'chil' },
  8: { korean: '팔', rom: 'pal' },
  9: { korean: '구', rom: 'gu' },
};

/**
 * Converts an integer into Sino-Korean Hangul representation.
 * Supports numbers from 0 up to 999,999,999.
 */
export function toSinoKorean(num: number): string {
  if (!Number.isFinite(num) || num < 0) return '';
  const n = Math.floor(num);
  if (n === 0) return '영';

  const parts: string[] = [];

  // Eok (100,000,000)
  const eok = Math.floor(n / 100000000);
  const remainderAfterEok = n % 100000000;
  if (eok > 0) {
    const eokStr = convertUnder10000(eok);
    parts.push(`${eokStr === '일' ? '' : eokStr}억`);
  }

  // Man (10,000)
  const man = Math.floor(remainderAfterEok / 10000);
  const remainderAfterMan = remainderAfterEok % 10000;
  if (man > 0) {
    const manStr = convertUnder10000(man);
    // For standalone 10,000, Koreans say '만' or '일만'. In prices, '만 원' is standard.
    parts.push(`${parts.length === 0 && manStr === '일' ? '' : manStr}만`);
  }

  // Under 10,000
  if (remainderAfterMan > 0) {
    parts.push(convertUnder10000(remainderAfterMan));
  }

  return parts.join(' ').trim();
}

/**
 * Converts a number strictly between 1 and 9999 to Sino-Korean.
 */
function convertUnder10000(n: number): string {
  if (n <= 0) return '';
  let result = '';

  const thousands = Math.floor(n / 1000);
  const hundreds = Math.floor((n % 1000) / 100);
  const tens = Math.floor((n % 100) / 10);
  const ones = n % 10;

  if (thousands > 0) {
    result += (thousands === 1 ? '' : SINO_DIGITS[thousands].korean) + '천';
  }
  if (hundreds > 0) {
    result += (hundreds === 1 ? '' : SINO_DIGITS[hundreds].korean) + '백';
  }
  if (tens > 0) {
    result += (tens === 1 ? '' : SINO_DIGITS[tens].korean) + '십';
  }
  if (ones > 0) {
    result += SINO_DIGITS[ones].korean;
  }

  return result;
}

/**
 * Common Sino-Korean drill items for high-frequency daily situations.
 */
export interface SinoNumberExample {
  value: number;
  label: string;
  category: 'money' | 'minutes' | 'date' | 'phone';
  korean: string;
  meaning: string;
}

export const SINO_PRESET_EXAMPLES: SinoNumberExample[] = [
  { value: 1000, label: '₩1,000', category: 'money', korean: '천 원', meaning: '1,000 Won' },
  { value: 4500, label: '₩4,500 (Cafe Americano)', category: 'money', korean: '사천오백 원', meaning: '4,500 Won' },
  { value: 10000, label: '₩10,000', category: 'money', korean: '만 원', meaning: '10,000 Won' },
  { value: 50000, label: '₩50,000', category: 'money', korean: '오만 원', meaning: '50,000 Won' },
  { value: 15, label: '15 Minutes', category: 'minutes', korean: '십오 분', meaning: '15 minutes' },
  { value: 30, label: '30 Minutes (Half)', category: 'minutes', korean: '삼십 분', meaning: '30 minutes' },
  { value: 45, label: '45 Minutes', category: 'minutes', korean: '사십오 분', meaning: '45 minutes' },
  { value: 25, label: 'Day 25', category: 'date', korean: '이십오 일', meaning: '25th day of the month' },
];
