/**
 * Pure domain module for composing Unicode Hangul Syllable Blocks (U+AC00..U+D7A3)
 * from Initial Consonant (초성 Choseong), Medial Vowel (중성 Jungseong),
 * and optional Final Consonant / Batchim (종성 Jongseong).
 */

export interface JamoComponent {
  index: number;
  jamo: string;
  name: string;
  romanization: string;
}

export interface ComposedSyllable {
  char: string;
  codePoint: number;
  choseong: JamoComponent;
  jungseong: JamoComponent;
  jongseong: JamoComponent;
  romanization: string;
  structure: 'CV' | 'CVC';
  formula: string;
  meaningHint?: string;
}

export const CHOSEONG_LIST: JamoComponent[] = [
  { index: 0, jamo: 'ㄱ', name: '기역 (giyeok)', romanization: 'g' },
  { index: 1, jamo: 'ㄲ', name: '쌍기역 (ssanggiyeok)', romanization: 'kk' },
  { index: 2, jamo: 'ㄴ', name: '니은 (nieun)', romanization: 'n' },
  { index: 3, jamo: 'ㄷ', name: '디귿 (digeut)', romanization: 'd' },
  { index: 4, jamo: 'ㄸ', name: '쌍디귿 (ssangdigeut)', romanization: 'tt' },
  { index: 5, jamo: 'ㄹ', name: '리을 (rieul)', romanization: 'r' },
  { index: 6, jamo: 'ㅁ', name: '미음 (mieum)', romanization: 'm' },
  { index: 7, jamo: 'ㅂ', name: '비읍 (bieup)', romanization: 'b' },
  { index: 8, jamo: 'ㅃ', name: '쌍비읍 (ssangbieup)', romanization: 'pp' },
  { index: 9, jamo: 'ㅅ', name: '시옷 (siot)', romanization: 's' },
  { index: 10, jamo: 'ㅆ', name: '쌍시옷 (ssangsiot)', romanization: 'ss' },
  { index: 11, jamo: 'ㅇ', name: '이응 (ieung - silent initial)', romanization: '' },
  { index: 12, jamo: 'ㅈ', name: '지읒 (jieut)', romanization: 'j' },
  { index: 13, jamo: 'ㅉ', name: '쌍지읒 (ssangjieut)', romanization: 'jj' },
  { index: 14, jamo: 'ㅊ', name: '치읓 (chieut)', romanization: 'ch' },
  { index: 15, jamo: 'ㅋ', name: '키읔 (kieuk)', romanization: 'k' },
  { index: 16, jamo: 'ㅌ', name: '티읕 (tieut)', romanization: 't' },
  { index: 17, jamo: 'ㅍ', name: '피읖 (pieup)', romanization: 'p' },
  { index: 18, jamo: 'ㅎ', name: '히읗 (hieut)', romanization: 'h' },
];

export const JUNGSEONG_LIST: JamoComponent[] = [
  { index: 0, jamo: 'ㅏ', name: '아 (a)', romanization: 'a' },
  { index: 1, jamo: 'ㅐ', name: '애 (ae)', romanization: 'ae' },
  { index: 2, jamo: 'ㅑ', name: '야 (ya)', romanization: 'ya' },
  { index: 3, jamo: 'ㅒ', name: '얘 (yae)', romanization: 'yae' },
  { index: 4, jamo: 'ㅓ', name: '어 (eo)', romanization: 'eo' },
  { index: 5, jamo: 'ㅔ', name: '에 (e)', romanization: 'e' },
  { index: 6, jamo: 'ㅕ', name: '여 (yeo)', romanization: 'yeo' },
  { index: 7, jamo: 'ㅖ', name: '예 (ye)', romanization: 'ye' },
  { index: 8, jamo: 'ㅗ', name: '오 (o)', romanization: 'o' },
  { index: 9, jamo: 'ㅘ', name: '와 (wa)', romanization: 'wa' },
  { index: 10, jamo: 'ㅙ', name: '왜 (wae)', romanization: 'wae' },
  { index: 11, jamo: 'ㅚ', name: '외 (oe)', romanization: 'oe' },
  { index: 12, jamo: 'ㅛ', name: '요 (yo)', romanization: 'yo' },
  { index: 13, jamo: 'ㅜ', name: '우 (u)', romanization: 'u' },
  { index: 14, jamo: 'ㅝ', name: '워 (wo)', romanization: 'wo' },
  { index: 15, jamo: 'ㅞ', name: '웨 (we)', romanization: 'we' },
  { index: 16, jamo: 'ㅟ', name: '위 (wi)', romanization: 'wi' },
  { index: 17, jamo: 'ㅠ', name: '유 (yu)', romanization: 'yu' },
  { index: 18, jamo: 'ㅡ', name: '으 (eu)', romanization: 'eu' },
  { index: 19, jamo: 'ㅢ', name: '의 (ui)', romanization: 'ui' },
  { index: 20, jamo: 'ㅣ', name: '이 (i)', romanization: 'i' },
];

export const JONGSEONG_LIST: JamoComponent[] = [
  { index: 0, jamo: '∅', name: '없음 (No Batchim)', romanization: '' },
  { index: 1, jamo: 'ㄱ', name: '기역 [k̚]', romanization: 'k' },
  { index: 2, jamo: 'ㄲ', name: '쌍기역 [k̚]', romanization: 'k' },
  { index: 3, jamo: 'ㄳ', name: '기역시옷 [k̚]', romanization: 'k' },
  { index: 4, jamo: 'ㄴ', name: '니은 [n]', romanization: 'n' },
  { index: 5, jamo: 'ㄵ', name: '니은지읒 [n]', romanization: 'n' },
  { index: 6, jamo: 'ㄶ', name: '니은히읗 [n]', romanization: 'n' },
  { index: 7, jamo: 'ㄷ', name: '디귿 [t̚]', romanization: 't' },
  { index: 8, jamo: 'ㄹ', name: '리을 [l]', romanization: 'l' },
  { index: 9, jamo: 'ㄺ', name: '리을기역 [k̚]', romanization: 'k' },
  { index: 10, jamo: 'ㄻ', name: '리을미음 [m]', romanization: 'm' },
  { index: 11, jamo: 'ㄼ', name: '리을비읍 [l]', romanization: 'l' },
  { index: 12, jamo: 'ㄽ', name: '리을시옷 [l]', romanization: 'l' },
  { index: 13, jamo: 'ㄾ', name: '리을티읕 [l]', romanization: 'l' },
  { index: 14, jamo: 'ㄿ', name: '리을피읖 [p̚]', romanization: 'p' },
  { index: 15, jamo: 'ㅀ', name: '리을히읗 [l]', romanization: 'l' },
  { index: 16, jamo: 'ㅁ', name: '미음 [m]', romanization: 'm' },
  { index: 17, jamo: 'ㅂ', name: '비읍 [p̚]', romanization: 'p' },
  { index: 18, jamo: 'ㅄ', name: '비읍시옷 [p̚]', romanization: 'p' },
  { index: 19, jamo: 'ㅅ', name: '시옷 [t̚]', romanization: 't' },
  { index: 20, jamo: 'ㅆ', name: '쌍시옷 [t̚]', romanization: 't' },
  { index: 21, jamo: 'ㅇ', name: '이응 [ŋ]', romanization: 'ng' },
  { index: 22, jamo: 'ㅈ', name: '지읒 [t̚]', romanization: 't' },
  { index: 23, jamo: 'ㅊ', name: '치읓 [t̚]', romanization: 't' },
  { index: 24, jamo: 'ㅋ', name: '키읔 [k̚]', romanization: 'k' },
  { index: 25, jamo: 'ㅌ', name: '티읕 [t̚]', romanization: 't' },
  { index: 26, jamo: 'ㅍ', name: '피읖 [p̚]', romanization: 'p' },
  { index: 27, jamo: 'ㅎ', name: '히읗 [t̚]', romanization: 't' },
];

/**
 * Curated common single-syllable Korean words for instant discovery feedback in the Syllable Builder.
 */
export const COMMON_SYLLABLE_MEANINGS: Record<string, string> = {
  한: 'One / Korean (한국, 한글)',
  글: 'Writing / Script (한글)',
  물: 'Water (mul)',
  밥: 'Cooked rice / Meal (bap)',
  차: 'Tea / Car (cha)',
  집: 'House / Home (jip)',
  책: 'Book (chaek)',
  산: 'Mountain (san)',
  강: 'River (gang)',
  별: 'Star (byeol)',
  달: 'Moon / Month (dal)',
  해: 'Sun / Year (hae)',
  눈: 'Eye / Snow (nun)',
  손: 'Hand (son)',
  발: 'Foot (bal)',
  입: 'Mouth (ip)',
  귀: 'Ear (gwi)',
  코: 'Nose (ko)',
  꽃: 'Flower (kkot)',
  봄: 'Spring (bom)',
  밤: 'Night / Chestnut (bam)',
  방: 'Room (bang)',
  문: 'Door (mun)',
  길: 'Road / Way (gil)',
  돈: 'Money (don)',
  불: 'Fire / Light (bul)',
  비: 'Rain (bi)',
  옷: 'Clothes (ot)',
  빵: 'Bread (ppang)',
  약: 'Medicine (yak)',
  잠: 'Sleep (jam)',
  꿈: 'Dream (kkum)',
  말: 'Speech / Horse (mal)',
};

export const PRESET_SYLLABLES: Array<{
  label: string;
  choseongIndex: number;
  jungseongIndex: number;
  jongseongIndex: number;
}> = [
  { label: '한 (Han)', choseongIndex: 18, jungseongIndex: 0, jongseongIndex: 4 },
  { label: '글 (Geul)', choseongIndex: 0, jungseongIndex: 18, jongseongIndex: 8 },
  { label: '물 (Water)', choseongIndex: 6, jungseongIndex: 13, jongseongIndex: 8 },
  { label: '밥 (Meal)', choseongIndex: 7, jungseongIndex: 0, jongseongIndex: 17 },
  { label: '별 (Star)', choseongIndex: 7, jungseongIndex: 6, jongseongIndex: 8 },
  { label: '꽃 (Flower)', choseongIndex: 1, jungseongIndex: 8, jongseongIndex: 23 },
];

/**
 * Composes a Unicode Hangul syllable from choseong (0..18), jungseong (0..20), and jongseong (0..27).
 */
export function composeHangulSyllable(
  choseongIndex: number,
  jungseongIndex: number,
  jongseongIndex: number = 0
): ComposedSyllable {
  const safeChoseongIdx = Math.max(0, Math.min(CHOSEONG_LIST.length - 1, choseongIndex));
  const safeJungseongIdx = Math.max(0, Math.min(JUNGSEONG_LIST.length - 1, jungseongIndex));
  const safeJongseongIdx = Math.max(0, Math.min(JONGSEONG_LIST.length - 1, jongseongIndex));

  const choseong = CHOSEONG_LIST[safeChoseongIdx];
  const jungseong = JUNGSEONG_LIST[safeJungseongIdx];
  const jongseong = JONGSEONG_LIST[safeJongseongIdx];

  const codePoint = 0xac00 + (safeChoseongIdx * 21 + safeJungseongIdx) * 28 + safeJongseongIdx;
  const char = String.fromCharCode(codePoint);

  const romanization = `${choseong.romanization}${jungseong.romanization}${jongseong.romanization}`;
  const structure = safeJongseongIdx === 0 ? 'CV' : 'CVC';
  const formula =
    safeJongseongIdx === 0
      ? `${choseong.jamo} + ${jungseong.jamo} = ${char}`
      : `${choseong.jamo} + ${jungseong.jamo} + ${jongseong.jamo} = ${char}`;

  return {
    char,
    codePoint,
    choseong,
    jungseong,
    jongseong,
    romanization,
    structure,
    formula,
    meaningHint: COMMON_SYLLABLE_MEANINGS[char],
  };
}
