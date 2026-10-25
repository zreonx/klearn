import { CHOSEONG_LIST, JUNGSEONG_LIST, JONGSEONG_LIST } from '@/domain/hangul/syllableBuilder';

export interface SyllableComparison {
  targetChar: string;
  spokenChar?: string;
  isMatch: boolean;
}

export interface PronunciationEvaluationResult {
  score: number; // 0 to 100
  rating: 'perfect' | 'great' | 'good' | 'retry';
  feedback: string;
  targetClean: string;
  spokenClean: string;
  syllableBreakdown: SyllableComparison[];
}

const HANGUL_BASE = 0xac00;
const JUNG_COUNT = 21;
const JONG_COUNT = 28;

/**
 * Decomposes a Hangul syllable into its constituent Jamo [initial, medial, final].
 * If the character is not Hangul, returns [char, '', ''].
 */
export function decomposeHangulToJamos(char: string): string[] {
  const code = char.charCodeAt(0);
  if (code < HANGUL_BASE || code > 0xd7a3) {
    return [char];
  }

  const offset = code - HANGUL_BASE;
  const choseongIdx = Math.floor(offset / (JUNG_COUNT * JONG_COUNT));
  const jungseongIdx = Math.floor((offset % (JUNG_COUNT * JONG_COUNT)) / JONG_COUNT);
  const jongseongIdx = offset % JONG_COUNT;

  const initial = CHOSEONG_LIST[choseongIdx]?.jamo ?? '';
  const medial = JUNGSEONG_LIST[jungseongIdx]?.jamo ?? '';
  const final = jongseongIdx > 0 ? (JONGSEONG_LIST[jongseongIdx]?.jamo ?? '') : '';

  return final ? [initial, medial, final] : [initial, medial];
}

/**
 * Converts a Korean string into a full decomposed Jamo string for fine-grained phonetic comparison.
 */
export function stringToJamoSequence(str: string): string {
  const clean = str.replace(/\s+/g, '');
  let result = '';
  for (const char of clean) {
    result += decomposeHangulToJamos(char).join('');
  }
  return result;
}

/**
 * Standard Levenshtein distance on strings.
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Evaluates spoken Korean against a target phrase.
 * Computes Jamo-level phonetic accuracy (0-100%) and returns actionable feedback.
 */
export function evaluatePronunciation(
  target: string,
  spoken: string
): PronunciationEvaluationResult {
  const cleanTarget = target.trim().replace(/[.,?!~]/g, '');
  const cleanSpoken = spoken.trim().replace(/[.,?!~]/g, '');

  if (!cleanSpoken) {
    return {
      score: 0,
      rating: 'retry',
      feedback: 'No speech was detected. Tap the microphone and speak clearly.',
      targetClean: cleanTarget,
      spokenClean: '',
      syllableBreakdown: Array.from(cleanTarget.replace(/\s+/g, '')).map((char) => ({
        targetChar: char,
        isMatch: false,
      })),
    };
  }

  // Jamo-level similarity
  const targetJamos = stringToJamoSequence(cleanTarget);
  const spokenJamos = stringToJamoSequence(cleanSpoken);

  const maxJamoLen = Math.max(targetJamos.length, spokenJamos.length);
  const distance = levenshteinDistance(targetJamos, spokenJamos);

  let score = 0;
  if (maxJamoLen > 0) {
    score = Math.max(0, Math.round((1 - distance / maxJamoLen) * 100));
  }

  // Exact full match boost
  if (cleanTarget.replace(/\s+/g, '') === cleanSpoken.replace(/\s+/g, '')) {
    score = 100;
  }

  // Syllable-level comparison
  const targetChars = Array.from(cleanTarget.replace(/\s+/g, ''));
  const spokenChars = Array.from(cleanSpoken.replace(/\s+/g, ''));

  const syllableBreakdown: SyllableComparison[] = targetChars.map((tChar, idx) => {
    const sChar = spokenChars[idx];
    const isMatch = sChar === tChar;
    return {
      targetChar: tChar,
      spokenChar: sChar,
      isMatch,
    };
  });

  let rating: 'perfect' | 'great' | 'good' | 'retry' = 'retry';
  let feedback = '';

  if (score >= 95) {
    rating = 'perfect';
    feedback = '🎉 Perfect! Natural and accurate native-like pronunciation.';
  } else if (score >= 80) {
    rating = 'great';
    feedback = '👏 Great job! Clear and easily understood by native speakers.';
  } else if (score >= 60) {
    rating = 'good';
    feedback = '👍 Good effort! Listen to the native audio and focus on the highlighted syllables.';
  } else {
    rating = 'retry';
    feedback = '💡 Let’s try again! Shadow the audio slowly and tap the microphone to speak.';
  }

  return {
    score,
    rating,
    feedback,
    targetClean: cleanTarget,
    spokenClean: cleanSpoken,
    syllableBreakdown,
  };
}
