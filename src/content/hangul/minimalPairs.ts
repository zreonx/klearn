export type ConsonantType = 'plain' | 'aspirated' | 'tense';

export interface MinimalPairItem {
  id: string;
  korean: string;
  romanization: string;
  translation: string;
  consonantType: ConsonantType;
  consonantLetter: string;
}

export interface MinimalPairSet {
  id: string;
  title: string;
  description: string;
  items: MinimalPairItem[];
}

export const MINIMAL_PAIR_SETS: MinimalPairSet[] = [
  {
    id: 'pair-b-p-pp',
    title: 'ㅂ vs ㅍ vs ㅃ (Labial Stops)',
    description: 'Notice the difference in aspiration (breath of air) and vocal cord tension.',
    items: [
      {
        id: 'min-bul',
        korean: '불',
        romanization: 'bul',
        translation: 'Fire / Light',
        consonantType: 'plain',
        consonantLetter: 'ㅂ',
      },
      {
        id: 'min-pul',
        korean: '풀',
        romanization: 'pul',
        translation: 'Grass / Glue',
        consonantType: 'aspirated',
        consonantLetter: 'ㅍ',
      },
      {
        id: 'min-ppul',
        korean: '뿔',
        romanization: 'ppul',
        translation: 'Horn',
        consonantType: 'tense',
        consonantLetter: 'ㅃ',
      },
    ],
  },
  {
    id: 'pair-d-t-tt',
    title: 'ㄷ vs ㅌ vs ㄸ (Alveolar Stops)',
    description: 'Listen for tongue tip release and tension.',
    items: [
      {
        id: 'min-dal',
        korean: '달',
        romanization: 'dal',
        translation: 'Moon / Month',
        consonantType: 'plain',
        consonantLetter: 'ㄷ',
      },
      {
        id: 'min-tal',
        korean: '탈',
        romanization: 'tal',
        translation: 'Mask / Trouble',
        consonantType: 'aspirated',
        consonantLetter: 'ㅌ',
      },
      {
        id: 'min-ttal',
        korean: '딸',
        romanization: 'ttal',
        translation: 'Daughter',
        consonantType: 'tense',
        consonantLetter: 'ㄸ',
      },
    ],
  },
  {
    id: 'pair-g-k-kk',
    title: 'ㄱ vs ㅋ vs ㄲ (Velar Stops)',
    description: 'Throat velar air puff vs tense pitch burst.',
    items: [
      {
        id: 'min-gae',
        korean: '개',
        romanization: 'gae',
        translation: 'Dog',
        consonantType: 'plain',
        consonantLetter: 'ㄱ',
      },
      {
        id: 'min-kae',
        korean: '캐',
        romanization: 'kae',
        translation: 'Dig (캐다)',
        consonantType: 'aspirated',
        consonantLetter: 'ㅋ',
      },
      {
        id: 'min-kkae',
        korean: '깨',
        romanization: 'kkae',
        translation: 'Sesame',
        consonantType: 'tense',
        consonantLetter: 'ㄲ',
      },
    ],
  },
  {
    id: 'pair-s-ss',
    title: 'ㅅ vs ㅆ (Sibilant Fricatives)',
    description: 'Breathy plain ㅅ vs sharp tense ㅆ.',
    items: [
      {
        id: 'min-sal',
        korean: '살',
        romanization: 'sal',
        translation: 'Flesh / Age counter',
        consonantType: 'plain',
        consonantLetter: 'ㅅ',
      },
      {
        id: 'min-ssal',
        korean: '쌀',
        romanization: 'ssal',
        translation: 'Uncooked rice',
        consonantType: 'tense',
        consonantLetter: 'ㅆ',
      },
    ],
  },
  {
    id: 'pair-j-ch-jj',
    title: 'ㅈ vs ㅊ vs ㅉ (Affricates)',
    description: 'Soft ㅈ vs puff ㅊ vs high-pitch ㅉ.',
    items: [
      {
        id: 'min-jada',
        korean: '자다',
        romanization: 'jada',
        translation: 'To sleep',
        consonantType: 'plain',
        consonantLetter: 'ㅈ',
      },
      {
        id: 'min-chada',
        korean: '차다',
        romanization: 'chada',
        translation: 'To kick / Cold',
        consonantType: 'aspirated',
        consonantLetter: 'ㅊ',
      },
      {
        id: 'min-jjada',
        korean: '짜다',
        romanization: 'jjada',
        translation: 'To be salty',
        consonantType: 'tense',
        consonantLetter: 'ㅉ',
      },
    ],
  },
  {
    id: 'pair-bang-pang-ppang',
    title: '방 vs 팡 vs 빵',
    description: 'High-frequency everyday words with distinct initial labial sounds.',
    items: [
      {
        id: 'min-bang',
        korean: '방',
        romanization: 'bang',
        translation: 'Room',
        consonantType: 'plain',
        consonantLetter: 'ㅂ',
      },
      {
        id: 'min-pang',
        korean: '팡',
        romanization: 'pang',
        translation: 'Bang / Pop (onomatopoeia)',
        consonantType: 'aspirated',
        consonantLetter: 'ㅍ',
      },
      {
        id: 'min-ppang',
        korean: '빵',
        romanization: 'ppang',
        translation: 'Bread',
        consonantType: 'tense',
        consonantLetter: 'ㅃ',
      },
    ],
  },
];
