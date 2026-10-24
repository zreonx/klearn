/**
 * Korean Sound-Change & Pronunciation Rules Catalog (한국어 발음 법칙).
 * Essential for learners to bridge the gap between written Hangul spelling and natural spoken Korean.
 */

export interface SoundRuleExample {
  written: string;
  spoken: string;
  romanization: string;
  translation: string;
  explanation: string;
}

export interface SoundChangeRule {
  id: string;
  titleKorean: string;
  titleEnglish: string;
  summary: string;
  ruleFormula: string;
  badgeLabel: string;
  description: string;
  examples: SoundRuleExample[];
  proTip: string;
}

export const SOUND_CHANGE_RULES: SoundChangeRule[] = [
  {
    id: 'liaison',
    titleKorean: '연음 법칙',
    titleEnglish: 'Liaison (Linking Sounds)',
    summary: 'When a final consonant is followed by a vowel (ㅇ), it shifts over into the vowel syllable.',
    ruleFormula: '받침 + ㅇ(vowel) ➔ Sound links smoothly',
    badgeLabel: 'Most Common',
    description:
      'In Korean, the initial circle ㅇ is silent when starting a syllable. Therefore, the batchim consonant carries forward into the empty space, making spoken Korean fluid and melodious.',
    examples: [
      {
        written: '한국어',
        spoken: '한구거',
        romanization: 'Han-gu-geo',
        translation: 'Korean language',
        explanation: 'The ㄱ batchim in 국 moves into the empty ㅇ in 어.',
      },
      {
        written: '음악',
        spoken: '으막',
        romanization: 'Eu-mak',
        translation: 'Music',
        explanation: 'The ㅁ batchim in 음 moves into the empty ㅇ in 악.',
      },
      {
        written: '집에',
        spoken: '지베',
        romanization: 'Ji-be',
        translation: 'To home / At home',
        explanation: 'The ㅂ batchim in 집 moves into the empty ㅇ in 에.',
      },
      {
        written: '먹어요',
        spoken: '머거요',
        romanization: 'Meo-geo-yo',
        translation: 'I eat / (Please) eat',
        explanation: 'The ㄱ batchim in 먹 moves into the empty ㅇ in 어.',
      },
    ],
    proTip: 'Never pause between syllables when a batchim meets ㅇ. Treat "한국어" as single flow: "한-구-거".',
  },
  {
    id: 'nasalization',
    titleKorean: '비음화',
    titleEnglish: 'Nasalization (Softening)',
    summary: 'Stop consonants (ㄱ, ㄷ, ㅂ) soften into smooth nasal sounds (ㅇ, ㄴ, ㅁ) before ㄴ or ㅁ.',
    ruleFormula: 'ㄱ, ㄷ, ㅂ + ㄴ, ㅁ ➔ ㅇ, ㄴ, ㅁ',
    badgeLabel: 'Fluency Key',
    description:
      'It is physically difficult for your mouth to transition from an abrupt stop (like ㅂ or ㄱ) directly into a nasal sound (like ㄴ or ㅁ). Korean naturally softens the stop into a nasal.',
    examples: [
      {
        written: '감사합니다',
        spoken: '감사함니다',
        romanization: 'Gam-sa-ham-ni-da',
        translation: 'Thank you (polite formal)',
        explanation: 'The ㅂ in 합 meets ㄴ in 니, so ㅂ softens into ㅁ: [함니다].',
      },
      {
        written: '국물',
        spoken: '궁물',
        romanization: 'Gung-mul',
        translation: 'Soup broth',
        explanation: 'The ㄱ in 국 meets ㅁ in 물, so ㄱ softens into ㅇ: [궁물].',
      },
      {
        written: '작년',
        spoken: '장년',
        romanization: 'Jang-nyeon',
        translation: 'Last year',
        explanation: 'The ㄱ in 작 meets ㄴ in 년, so ㄱ softens into ㅇ: [장년].',
      },
      {
        written: '한국말',
        spoken: '한궁말',
        romanization: 'Han-gung-mal',
        translation: 'Korean spoken speech',
        explanation: 'The ㄱ in 국 meets ㅁ in 말, so ㄱ softens into ㅇ: [한궁말].',
      },
    ],
    proTip: 'Whenever you say "-습니다" or "-합니다", always pronounce it as [-슴니다] and [-함니다]!',
  },
  {
    id: 'tensification',
    titleKorean: '경음화',
    titleEnglish: 'Tensification (Hardening)',
    summary: 'Plain consonants (ㄱ, ㄷ, ㅂ, ㅅ, ㅈ) become tense double sounds (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ) after stop batchim.',
    ruleFormula: 'ㄱ, ㄷ, ㅂ + ㄱ, ㄷ, ㅂ, ㅅ, ㅈ ➔ ㄲ, ㄸ, ㅃ, ㅆ, ㅉ',
    badgeLabel: 'Accuracy',
    description:
      'Air pressure trapped behind a stop consonant bursts forward, naturally causing the next consonant to become a tense double consonant.',
    examples: [
      {
        written: '학교',
        spoken: '학꾜',
        romanization: 'Hak-kkyo',
        translation: 'School',
        explanation: 'The ㄱ in 학 causes the following ㄱ in 교 to harden into ㄲ: [학꾜].',
      },
      {
        written: '식당',
        spoken: '식땅',
        romanization: 'Sik-ttang',
        translation: 'Restaurant',
        explanation: 'The ㄱ in 식 causes the following ㄷ in 당 to harden into ㄸ: [식땅].',
      },
      {
        written: '학생',
        spoken: '학쌩',
        romanization: 'Hak-ssaeng',
        translation: 'Student',
        explanation: 'The ㄱ in 학 causes the following ㅅ in 생 to harden into ㅆ: [학쌩].',
      },
      {
        written: '잡지',
        spoken: '잡찌',
        romanization: 'Jap-jji',
        translation: 'Magazine',
        explanation: 'The ㅂ in 잡 causes the following ㅈ in 지 to harden into ㅉ: [잡찌].',
      },
    ],
    proTip: 'Don\'t panic if you don\'t tense it strongly; native speakers will still understand, but practicing this gives you natural Korean cadence.',
  },
  {
    id: 'aspiration',
    titleKorean: '격음화',
    titleEnglish: 'Aspiration (H-Merging)',
    summary: 'When plain stops (ㄱ, ㄷ, ㅂ, ㅈ) meet ㅎ (before or after), they combine into strong aspirated bursts (ㅋ, ㅌ, ㅍ, ㅊ).',
    ruleFormula: 'ㄱ, ㄷ, ㅂ, ㅈ + ㅎ (or ㅎ + ㄱ, ㄷ, ㅂ, ㅈ) ➔ ㅋ, ㅌ, ㅍ, ㅊ',
    badgeLabel: 'High Frequency',
    description:
      'The breathy ㅎ sound merges with neighboring consonants into their aspirated counterparts.',
    examples: [
      {
        written: '좋다',
        spoken: '조타',
        romanization: 'Jo-ta',
        translation: 'To be good',
        explanation: 'The ㅎ batchim in 좋 merges with ㄷ in 다 to become ㅌ: [조타].',
      },
      {
        written: '축하',
        spoken: '추카',
        romanization: 'Chu-ka',
        translation: 'Congratulations',
        explanation: 'The ㄱ batchim in 축 merges with ㅎ in 하 to become ㅋ: [추카].',
      },
      {
        written: '입학',
        spoken: '이팍',
        romanization: 'I-pak',
        translation: 'School entrance / Admission',
        explanation: 'The ㅂ in 입 links with ㅎ in 학 to become ㅍ: [이팍].',
      },
      {
        written: '어떻게',
        spoken: '어떠케',
        romanization: 'Eo-tteo-ke',
        translation: 'How / In what way',
        explanation: 'The ㅎ in 어떻 merges with ㄱ in 게 to become ㅋ: [어떠케].',
      },
    ],
    proTip: 'When saying "축하해요" (Happy birthday/congrats), say "추카해요"!',
  },
  {
    id: 'palatalization',
    titleKorean: '구개음화',
    titleEnglish: 'Palatalization (Soft T/D into CH/J)',
    summary: 'When a final ㄷ or ㅌ meets the vowel 이, it transforms into ㅈ or ㅊ.',
    ruleFormula: 'ㄷ, ㅌ + 이 ➔ 지, 치',
    badgeLabel: 'Crucial',
    description:
      'When your tongue moves to pronounce the high vowel 이 right after ㄷ or ㅌ, your mouth naturally shifts the sound back to the palate, turning ㅌ into ㅊ and ㄷ into ㅈ.',
    examples: [
      {
        written: '같이',
        spoken: '가치',
        romanization: 'Ga-chi',
        translation: 'Together',
        explanation: 'The ㅌ batchim meets 이 and becomes 치: pronounced [가치], never [가티].',
      },
      {
        written: '굳이',
        spoken: '구지',
        romanization: 'Gu-ji',
        translation: 'Obstinately / Go out of one\'s way',
        explanation: 'The ㄷ batchim meets 이 and becomes 지: pronounced [구지].',
      },
      {
        written: '해돋이',
        spoken: '해도지',
        romanization: 'Hae-do-ji',
        translation: 'Sunrise',
        explanation: 'The ㄷ batchim in 돋 meets 이 and becomes 지: [해도지].',
      },
      {
        written: '붙이다',
        spoken: '부치다',
        romanization: 'Bu-chi-da',
        translation: 'To stick / Paste',
        explanation: 'The ㅌ batchim in 붙 meets 이 and becomes 치: [부치다].',
      },
    ],
    proTip: '"같이 가요" (Let\'s go together) is ALWAYS pronounced "가치 가요". This is one of the most common words in Korean!',
  },
];
