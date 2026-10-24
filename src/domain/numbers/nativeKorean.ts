/**
 * Pure domain logic for Native Korean numbers (고유어 수사).
 * Used for: Counting items (개), people (명), bottles (병), cups (잔), age (살), hours of the clock (시).
 * Native Korean numbers are traditionally used from 1 to 99.
 */

const NATIVE_ONES_STANDALONE: Record<number, string> = {
  1: '하나',
  2: '둘',
  3: '셋',
  4: '넷',
  5: '다섯',
  6: '여섯',
  7: '일곱',
  8: '여덟',
  9: '아홉',
};

const NATIVE_ONES_COUNTER: Record<number, string> = {
  1: '한',
  2: '두',
  3: '세',
  4: '네',
  5: '다섯',
  6: '여섯',
  7: '일곱',
  8: '여덟',
  9: '아홉',
};

const NATIVE_TENS: Record<number, string> = {
  10: '열',
  20: '스물',
  30: '서른',
  40: '마흔',
  50: '쉰',
  60: '예순',
  70: '일흔',
  80: '여든',
  90: '아흔',
};

/**
 * Converts a number from 1 to 99 into Native Korean.
 * @param num Number between 1 and 99.
 * @param isBeforeCounter True if immediately preceding a counter noun (triggers 한, 두, 세, 네, 스무).
 */
export function toNativeKorean(num: number, isBeforeCounter: boolean = false): string {
  if (!Number.isFinite(num) || num < 1 || num > 99) {
    return '';
  }

  const n = Math.floor(num);

  // Exact 20 before counter contracts to "스무" (e.g. 스무 살)
  if (n === 20 && isBeforeCounter) {
    return '스무';
  }

  const tens = Math.floor(n / 10) * 10;
  const ones = n % 10;

  if (tens === 0) {
    return isBeforeCounter ? NATIVE_ONES_COUNTER[ones] : NATIVE_ONES_STANDALONE[ones];
  }

  const tensStr = NATIVE_TENS[tens] || '';
  if (ones === 0) {
    return tensStr;
  }

  const onesStr = isBeforeCounter ? NATIVE_ONES_COUNTER[ones] : NATIVE_ONES_STANDALONE[ones];
  return `${tensStr}${onesStr}`;
}

export interface NativeNumberExample {
  value: number;
  counter: string;
  category: 'time' | 'people' | 'items' | 'age';
  korean: string;
  meaning: string;
}

export const NATIVE_PRESET_EXAMPLES: NativeNumberExample[] = [
  { value: 1, counter: '시', category: 'time', korean: '한 시', meaning: '1:00 (One o\'clock)' },
  { value: 2, counter: '잔', category: 'items', korean: '커피 두 잔', meaning: 'Two cups of coffee' },
  { value: 3, counter: '명', category: 'people', korean: '친구 세 명', meaning: 'Three friends' },
  { value: 4, counter: '개', category: 'items', korean: '사과 네 개', meaning: 'Four apples' },
  { value: 5, counter: '병', category: 'items', korean: '물 다섯 병', meaning: 'Five bottles of water' },
  { value: 20, counter: '살', category: 'age', korean: '스무 살', meaning: '20 years old (adulthood in Korea)' },
  { value: 25, counter: '살', category: 'age', korean: '스물다섯 살', meaning: '25 years old' },
];
