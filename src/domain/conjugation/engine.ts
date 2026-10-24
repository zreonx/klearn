import { ConjugationResult, CuratedPredicate, IrregularType, WordType } from './types';
import { CURATED_PREDICATES } from './curatedVerbs';

/**
 * Checks if a Hangul character has a batchim (종성).
 */
export function hasBatchim(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return false;
  return code % 28 !== 0;
}

/**
 * Gets the batchim index (0 to 27) of a Hangul syllable.
 */
export function getBatchimIndex(char: string): number {
  if (!char) return 0;
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return 0;
  return code % 28;
}

/**
 * Gets the vowel index (0 to 20) of a Hangul syllable.
 */
export function getVowelIndex(char: string): number {
  if (!char) return -1;
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return -1;
  return Math.floor((code % (21 * 28)) / 28);
}

/**
 * Determines whether a Hangul syllable has a bright vowel (양성 모음: ㅏ, ㅗ, ㅑ, ㅛ, ㅘ).
 */
export function isBrightVowel(char: string): boolean {
  const v = getVowelIndex(char);
  return v === 0 || v === 2 || v === 8 || v === 9 || v === 12;
}

/**
 * Composes a Hangul character from choseong, jungseong, and optional jongseong indices.
 */
export function composeHangul(cho: number, jung: number, jong: number = 0): string {
  const code = 0xac00 + cho * 21 * 28 + jung * 28 + jong;
  return String.fromCharCode(code);
}

/**
 * Decomposes a Hangul syllable into its [cho, jung, jong] indices.
 */
export function decomposeHangul(char: string): [number, number, number] {
  const code = char.charCodeAt(0) - 0xac00;
  const cho = Math.floor(code / (21 * 28));
  const jung = Math.floor((code % (21 * 28)) / 28);
  const jong = code % 28;
  return [cho, jung, jong];
}

/**
 * Conjugates any curated or custom Korean verb/adjective root.
 */
export function conjugatePredicate(
  inputRoot: string,
  wordType: WordType = 'verb',
  customMeaning?: string
): ConjugationResult {
  const root = inputRoot.trim();
  const curated = CURATED_PREDICATES.find((p) => p.root === root);

  const effectiveWordType = curated ? curated.wordType : wordType;
  const meaning = customMeaning || curated?.meaning || 'To ' + root.replace('다', '');
  const irregularType: IrregularType = curated ? curated.irregularType : detectIrregularType(root);

  // If curated entry has a specific irregular rule, we use specialized accurate conjugations
  if (curated) {
    return conjugateCurated(curated);
  }

  // General programmatic fallback for regular and common roots
  return conjugateGeneral(root, effectiveWordType, meaning, irregularType);
}

function detectIrregularType(root: string): IrregularType {
  const stem = root.endsWith('다') ? root.slice(0, -1) : root;
  const lastChar = stem[stem.length - 1] || '';

  if (root.endsWith('하다')) return 'regular';
  if (root.endsWith('르다')) return '르-irregular';

  const batchim = getBatchimIndex(lastChar);
  if (batchim === 7) return 'ㄷ-irregular'; // ㄷ
  if (batchim === 17) return 'ㅂ-irregular'; // ㅂ
  if (batchim === 19) return 'ㅅ-irregular'; // ㅅ
  if (batchim === 8) return 'ㄹ-irregular'; // ㄹ
  if (batchim === 27) return 'ㅎ-irregular'; // ㅎ

  const vowel = getVowelIndex(lastChar);
  if (vowel === 18 && batchim === 0) return 'ㅡ-irregular'; // ㅡ with no batchim

  return 'regular';
}

function conjugateCurated(p: CuratedPredicate): ConjugationResult {
  const { root, meaning, wordType, irregularType } = p;
  const stem = root.slice(0, -1);
  const isVerb = wordType === 'verb';

  switch (root) {
    // --- ㄷ-Irregulars ---
    case '듣다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '들어요',
        formalPolite: '듣습니다',
        pastPolite: '들었어요',
        futurePolite: '들을 거예요',
        politeRequest: '들으세요',
        negationShort: '안 들어요',
        negationLong: '듣지 않아요',
        ruleExplanation: 'ㄷ-Irregular: The final consonant ㄷ changes to ㄹ before vowels (들어요, 들었어요).',
      };
    case '걷다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '걸어요',
        formalPolite: '걷습니다',
        pastPolite: '걸었어요',
        futurePolite: '걸을 거예요',
        politeRequest: '걸으세요',
        negationShort: '안 걸어요',
        negationLong: '걷지 않아요',
        ruleExplanation: 'ㄷ-Irregular: The final consonant ㄷ changes to ㄹ before vowels (걸어요, 걸을 거예요).',
      };
    case '묻다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '물어요',
        formalPolite: '묻습니다',
        pastPolite: '물었어요',
        futurePolite: '물을 거예요',
        politeRequest: '물으세요',
        negationShort: '안 물어요',
        negationLong: '묻지 않아요',
        ruleExplanation: 'ㄷ-Irregular: The final consonant ㄷ changes to ㄹ before vowels (물어요).',
      };

    // --- ㅂ-Irregulars ---
    case '춥다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '추워요',
        formalPolite: '춥습니다',
        pastPolite: '추웠어요',
        futurePolite: '추울 거예요',
        negationShort: '안 추워요',
        negationLong: '춥지 않아요',
        ruleExplanation: 'ㅂ-Irregular: Final ㅂ drops and becomes 워 before vowels (추워요, 추웠어요).',
      };
    case '덥다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '더워요',
        formalPolite: '덥습니다',
        pastPolite: '더웠어요',
        futurePolite: '더울 거예요',
        negationShort: '안 더워요',
        negationLong: '덥지 않아요',
        ruleExplanation: 'ㅂ-Irregular: Final ㅂ drops and becomes 워 before vowels (더워요).',
      };
    case '어렵다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '어려워요',
        formalPolite: '어렵습니다',
        pastPolite: '어려웠어요',
        futurePolite: '어려울 거예요',
        negationShort: '안 어려워요',
        negationLong: '어렵지 않아요',
        ruleExplanation: 'ㅂ-Irregular: Final ㅂ drops and becomes 워 before vowels (어려워요).',
      };
    case '쉽다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '쉬워요',
        formalPolite: '쉽습니다',
        pastPolite: '쉬웠어요',
        futurePolite: '쉬울 거예요',
        negationShort: '안 쉬워요',
        negationLong: '쉽지 않아요',
        ruleExplanation: 'ㅂ-Irregular: Final ㅂ drops and becomes 워 before vowels (쉬워요).',
      };
    case '고맙다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '고마워요',
        formalPolite: '고맙습니다',
        pastPolite: '고마웠어요',
        futurePolite: '고마울 거예요',
        negationShort: '안 고마워요',
        negationLong: '고맙지 않아요',
        ruleExplanation: 'ㅂ-Irregular: Final ㅂ drops and becomes 워 before vowels (고마워요).',
      };

    // --- ㅡ-Irregulars ---
    case '바쁘다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '바빠요',
        formalPolite: '바쁩니다',
        pastPolite: '바빴어요',
        futurePolite: '바쁠 거예요',
        negationShort: '안 바빠요',
        negationLong: '바쁘지 않아요',
        ruleExplanation: 'ㅡ-Irregular: The ㅡ vowel drops. Since preceding syllable "바" has bright vowel ㅏ, it takes ㅏ (바빠요).',
      };
    case '예쁘다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '예뻐요',
        formalPolite: '예쁩니다',
        pastPolite: '예뻤어요',
        futurePolite: '예쁠 거예요',
        negationShort: '안 예뻐요',
        negationLong: '예쁘지 않아요',
        ruleExplanation: 'ㅡ-Irregular: The ㅡ vowel drops. Since preceding syllable "예" has dark vowel ㅔ, it takes ㅓ (예뻐요).',
      };
    case '크다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '커요',
        formalPolite: '큽니다',
        pastPolite: '컸어요',
        futurePolite: '클 거예요',
        negationShort: '안 커요',
        negationLong: '크지 않아요',
        ruleExplanation: 'ㅡ-Irregular: In single-syllable stems with ㅡ, ㅡ drops and defaults to ㅓ (커요, 컸어요).',
      };
    case '아프다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '아파요',
        formalPolite: '아픕니다',
        pastPolite: '아팠어요',
        futurePolite: '아플 거예요',
        negationShort: '안 아파요',
        negationLong: '아프지 않아요',
        ruleExplanation: 'ㅡ-Irregular: The ㅡ vowel drops. Preceding syllable "아" has bright vowel ㅏ, taking ㅏ (아파요).',
      };

    // --- 르-Irregulars ---
    case '빠르다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '빨라요',
        formalPolite: '빠릅니다',
        pastPolite: '빨랐어요',
        futurePolite: '빠를 거예요',
        negationShort: '안 빨라요',
        negationLong: '빠르지 않아요',
        ruleExplanation: '르-Irregular: 르 drops and adds ㄹ to preceding syllable + 라 (빨라요).',
      };
    case '모르다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '몰라요',
        formalPolite: '모릅니다',
        pastPolite: '몰랐어요',
        futurePolite: '모를 거예요',
        politeRequest: isVerb ? '모르세요' : undefined,
        negationShort: '안 몰라요',
        negationLong: '모르지 않아요',
        ruleExplanation: '르-Irregular: 르 drops and adds ㄹ to preceding syllable + 라 (몰라요).',
      };
    case '부르다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '불러요',
        formalPolite: '부릅니다',
        pastPolite: '불렀어요',
        futurePolite: '부를 거예요',
        politeRequest: isVerb ? '부르세요' : undefined,
        negationShort: '안 불러요',
        negationLong: '부르지 않아요',
        ruleExplanation: '르-Irregular: 르 drops and adds ㄹ to preceding syllable + 러 (불러요).',
      };

    // --- ㄹ-Irregulars ---
    case '만들다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '만들어요',
        formalPolite: '만듭니다',
        pastPolite: '만들었어요',
        futurePolite: '만들 거예요',
        politeRequest: '만드세요',
        negationShort: '안 만들어요',
        negationLong: '만들지 않아요',
        ruleExplanation: 'ㄹ-Irregular: Final ㄹ drops before ㄴ, ㅂ, ㅅ (만듭니다, 만드세요).',
      };
    case '살다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '살아요',
        formalPolite: '삽니다',
        pastPolite: '살았어요',
        futurePolite: '살 거예요',
        politeRequest: '사세요',
        negationShort: '안 살아요',
        negationLong: '살지 않아요',
        ruleExplanation: 'ㄹ-Irregular: Final ㄹ drops before ㄴ, ㅂ, ㅅ (삽니다, 사세요).',
      };
    case '알다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '알아요',
        formalPolite: '압니다',
        pastPolite: '알았어요',
        futurePolite: '알 거예요',
        politeRequest: '아세요',
        negationShort: '안 알아요',
        negationLong: '알지 않아요',
        ruleExplanation: 'ㄹ-Irregular: Final ㄹ drops before ㄴ, ㅂ, ㅅ (압니다, 아세요).',
      };

    // --- ㅅ-Irregulars ---
    case '낫다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '나아요',
        formalPolite: '낫습니다',
        pastPolite: '나았어요',
        futurePolite: '나을 거예요',
        negationShort: '안 나아요',
        negationLong: '낫지 않아요',
        ruleExplanation: 'ㅅ-Irregular: Final ㅅ drops before vowels without merging (나아요, 나았어요).',
      };
    case '짓다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '지어요',
        formalPolite: '짓습니다',
        pastPolite: '지었어요',
        futurePolite: '지을 거예요',
        politeRequest: '지으세요',
        negationShort: '안 지어요',
        negationLong: '짓지 않아요',
        ruleExplanation: 'ㅅ-Irregular: Final ㅅ drops before vowels without merging (지어요, 지으세요).',
      };

    // --- ㅎ-Irregulars ---
    case '그렇다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '그래요',
        formalPolite: '그렇습니다',
        pastPolite: '그랬어요',
        futurePolite: '그럴 거예요',
        negationShort: '안 그래요',
        negationLong: '그렇지 않아요',
        ruleExplanation: 'ㅎ-Irregular: Final ㅎ drops and the vowel changes to 애 (그래요, 그랬어요).',
      };
    case '어떻다':
      return {
        root,
        meaning,
        wordType,
        irregularType,
        stem,
        presentPolite: '어때요',
        formalPolite: '어떻습니까',
        pastPolite: '어땠어요',
        futurePolite: '어떨 거예요',
        negationShort: '안 어때요',
        negationLong: '어떻지 않아요',
        ruleExplanation: 'ㅎ-Irregular: Final ㅎ drops and the vowel changes to 애 (어때요, 어땠어요).',
      };

    default:
      return conjugateGeneral(root, wordType, meaning, irregularType);
  }
}

function conjugateGeneral(
  root: string,
  wordType: WordType,
  meaning: string,
  irregularType: IrregularType
): ConjugationResult {
  const stem = root.endsWith('다') ? root.slice(0, -1) : root;
  const lastChar = stem[stem.length - 1] || '';
  const hasEndBatchim = hasBatchim(lastChar);
  const isVerb = wordType === 'verb';

  // 하다 Verbs
  if (root.endsWith('하다')) {
    const base = stem.slice(0, -1);
    return {
      root,
      meaning,
      wordType,
      irregularType: 'regular',
      stem,
      presentPolite: `${base}해요`,
      formalPolite: `${base}합니다`,
      pastPolite: `${base}했어요`,
      futurePolite: `${base}할 거예요`,
      politeRequest: isVerb ? `${base}하세요` : undefined,
      negationShort: `안 ${base}해요`,
      negationLong: `${stem}지 않아요`,
      ruleExplanation: '하다 Verbs: Stems ending in 하다 contract to 해요 in polite present and 했습니다 in past.',
    };
  }

  // Regular vowel harmony calculation
  let presentPolite = '';
  let pastPolite = '';
  let formalPolite = '';
  let futurePolite = '';
  let politeRequest: string | undefined = undefined;

  const bright = isBrightVowel(lastChar);

  if (!hasEndBatchim) {
    // Vowel contraction rules
    const [cho, jung] = decomposeHangul(lastChar);
    if (jung === 0) {
      // ㅏ + 아 -> ㅏ (가다 -> 가요)
      presentPolite = stem + '요';
      pastPolite = stem.slice(0, -1) + composeHangul(cho, jung, 20) + '어요'; // 갔어요
    } else if (jung === 8) {
      // ㅗ + 아 -> ㅘ (보다 -> 봐요, 오다 -> 와요)
      const merged = composeHangul(cho, 9, 0); // ㅘ
      presentPolite = stem.slice(0, -1) + merged + '요';
      pastPolite = stem.slice(0, -1) + composeHangul(cho, 9, 20) + '어요'; // 봤어요
    } else if (jung === 4) {
      // ㅓ + 어 -> ㅓ (서다 -> 서요)
      presentPolite = stem + '요';
      pastPolite = stem.slice(0, -1) + composeHangul(cho, jung, 20) + '어요';
    } else if (jung === 13) {
      // ㅜ + 어 -> ㅝ (주다 -> 줘요, 배우다 -> 배워요)
      const merged = composeHangul(cho, 14, 0); // ㅝ
      presentPolite = stem.slice(0, -1) + merged + '요';
      pastPolite = stem.slice(0, -1) + composeHangul(cho, 14, 20) + '어요';
    } else if (jung === 20) {
      // ㅣ + 어 -> ㅕ (마시다 -> 마셔요)
      const merged = composeHangul(cho, 6, 0); // ㅕ
      presentPolite = stem.slice(0, -1) + merged + '요';
      pastPolite = stem.slice(0, -1) + composeHangul(cho, 6, 20) + '어요';
    } else {
      presentPolite = `${stem}${bright ? '아요' : '어요'}`;
      pastPolite = `${stem}${bright ? '았어요' : '었어요'}`;
    }

    formalPolite = `${stem.slice(0, -1)}${composeHangul(cho, jung, 17)}니다`; // ㅂ니다 (갑니다, 마십니다)
    futurePolite = `${stem.slice(0, -1)}${composeHangul(cho, jung, 8)} 거예요`; // ㄹ 거예요 (갈 거예요, 마실 거예요)
    if (isVerb) {
      politeRequest = `${stem}세요`;
    }
  } else {
    // Has batchim (먹다 -> 먹어요, 좋다 -> 좋아요)
    const suffix = bright ? '아' : '어';
    presentPolite = `${stem}${suffix}요`;
    pastPolite = `${stem}${bright ? '았' : '었'}어요`;
    formalPolite = `${stem}습니다`;
    futurePolite = `${stem}을 거예요`;
    if (isVerb) {
      politeRequest = `${stem}으세요`;
    }
  }

  return {
    root,
    meaning,
    wordType,
    irregularType,
    stem,
    presentPolite,
    formalPolite,
    pastPolite,
    futurePolite,
    politeRequest,
    negationShort: `안 ${presentPolite}`,
    negationLong: `${stem}지 않아요`,
    ruleExplanation: `Regular Vowel Harmony: The stem "${stem}" takes -${bright ? '아' : '어'}요 based on its last vowel.`,
  };
}
