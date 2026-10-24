/**
 * Pure domain utility for Korean Initial Consonant (초성 Choseong) Search.
 * Allows instant matching of Hangul phrases using just initial consonants
 * (e.g., query "ㄱㅅ" matches "감사합니다", query "ㅂㅂㅂ" matches "비빔밥").
 */

export const CHOSEONG_LETTERS: string[] = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

/**
 * Extracts the Choseong (initial consonant) string from any Korean text.
 * Syllables outside the Hangul Syllables range (U+AC00..U+D7A3) are preserved if alphanumeric or spaces.
 */
export function extractChoseong(text: string): string {
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);

    // Complete Hangul syllable block
    if (code >= 0xac00 && code <= 0xd7a3) {
      const choseongIndex = Math.floor((code - 0xac00) / (21 * 28));
      result += CHOSEONG_LETTERS[choseongIndex] ?? '';
    } else {
      // Keep existing standalone jamo consonants (e.g. ㄱ, ㄴ) or alphanumeric
      result += text[i];
    }
  }

  return result;
}

/**
 * Checks if a search query consists exclusively of Korean Choseong consonants.
 */
export function isChoseongOnly(query: string): boolean {
  const trimmed = query.trim().replace(/\s+/g, '');
  if (!trimmed) return false;

  return trimmed.split('').every((char) => CHOSEONG_LETTERS.includes(char));
}

/**
 * Checks if the target Korean text matches a Choseong query.
 * Supports partial matching (e.g., "ㄱㅅ" in "안녕하세요 감사합니다").
 */
export function matchesChoseong(targetKorean: string, query: string): boolean {
  const cleanQuery = query.trim().replace(/\s+/g, '');
  if (!cleanQuery || !isChoseongOnly(cleanQuery)) return false;

  const targetChoseong = extractChoseong(targetKorean).replace(/\s+/g, '');
  return targetChoseong.includes(cleanQuery);
}
