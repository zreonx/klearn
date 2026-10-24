import { CuratedPredicate } from './types';

export const CURATED_PREDICATES: CuratedPredicate[] = [
  // Regular Verbs
  { root: '가다', meaning: 'To go', wordType: 'verb', irregularType: 'regular', level: 1 },
  { root: '오다', meaning: 'To come', wordType: 'verb', irregularType: 'regular', level: 1 },
  { root: '먹다', meaning: 'To eat', wordType: 'verb', irregularType: 'regular', level: 1 },
  { root: '마시다', meaning: 'To drink', wordType: 'verb', irregularType: 'regular', level: 1 },
  { root: '보다', meaning: 'To see / watch', wordType: 'verb', irregularType: 'regular', level: 1 },
  { root: '읽다', meaning: 'To read', wordType: 'verb', irregularType: 'regular', level: 1 },
  { root: '입다', meaning: 'To wear (clothes)', wordType: 'verb', irregularType: 'regular', level: 2 },
  { root: '주다', meaning: 'To give', wordType: 'verb', irregularType: 'regular', level: 1 },

  // 하다 Verbs
  { root: '하다', meaning: 'To do', wordType: 'verb', irregularType: 'regular', level: 1 },
  { root: '공부하다', meaning: 'To study', wordType: 'verb', irregularType: 'regular', level: 1 },
  { root: '일하다', meaning: 'To work', wordType: 'verb', irregularType: 'regular', level: 2 },
  { root: '말하다', meaning: 'To speak', wordType: 'verb', irregularType: 'regular', level: 2 },

  // Regular Adjectives
  { root: '좋다', meaning: 'To be good', wordType: 'adjective', irregularType: 'regular', level: 1 },
  { root: '많다', meaning: 'To be many / much', wordType: 'adjective', irregularType: 'regular', level: 1 },
  { root: '작다', meaning: 'To be small', wordType: 'adjective', irregularType: 'regular', level: 1 },
  { root: '비싸다', meaning: 'To be expensive', wordType: 'adjective', irregularType: 'regular', level: 2 },

  // ㄷ-Irregular (ㄷ -> ㄹ before vowels)
  { root: '듣다', meaning: 'To listen / hear', wordType: 'verb', irregularType: 'ㄷ-irregular', level: 1 },
  { root: '걷다', meaning: 'To walk', wordType: 'verb', irregularType: 'ㄷ-irregular', level: 2 },
  { root: '묻다', meaning: 'To ask', wordType: 'verb', irregularType: 'ㄷ-irregular', level: 2 },

  // ㅂ-Irregular (ㅂ drops and becomes 워/와 before vowels)
  { root: '춥다', meaning: 'To be cold (weather)', wordType: 'adjective', irregularType: 'ㅂ-irregular', level: 1 },
  { root: '덥다', meaning: 'To be hot (weather)', wordType: 'adjective', irregularType: 'ㅂ-irregular', level: 1 },
  { root: '어렵다', meaning: 'To be difficult', wordType: 'adjective', irregularType: 'ㅂ-irregular', level: 2 },
  { root: '쉽다', meaning: 'To be easy', wordType: 'adjective', irregularType: 'ㅂ-irregular', level: 2 },
  { root: '고맙다', meaning: 'To be thankful', wordType: 'adjective', irregularType: 'ㅂ-irregular', level: 1 },

  // ㅡ-Irregular (ㅡ drops before 아/어)
  { root: '바쁘다', meaning: 'To be busy', wordType: 'adjective', irregularType: 'ㅡ-irregular', level: 1 },
  { root: '예쁘다', meaning: 'To be pretty', wordType: 'adjective', irregularType: 'ㅡ-irregular', level: 1 },
  { root: '크다', meaning: 'To be big', wordType: 'adjective', irregularType: 'ㅡ-irregular', level: 1 },
  { root: '아프다', meaning: 'To be sick / hurt', wordType: 'adjective', irregularType: 'ㅡ-irregular', level: 2 },

  // 르-Irregular (르 drops and inserts ㄹ into preceding syllable + 라/러)
  { root: '빠르다', meaning: 'To be fast', wordType: 'adjective', irregularType: '르-irregular', level: 2 },
  { root: '모르다', meaning: 'To not know', wordType: 'verb', irregularType: '르-irregular', level: 1 },
  { root: '부르다', meaning: 'To call / sing', wordType: 'verb', irregularType: '르-irregular', level: 2 },

  // ㄹ-Irregular (ㄹ drops before ㄴ, ㅂ, ㅅ)
  { root: '만들다', meaning: 'To make', wordType: 'verb', irregularType: 'ㄹ-irregular', level: 2 },
  { root: '살다', meaning: 'To live', wordType: 'verb', irregularType: 'ㄹ-irregular', level: 2 },
  { root: '알다', meaning: 'To know', wordType: 'verb', irregularType: 'ㄹ-irregular', level: 1 },

  // ㅅ-Irregular (ㅅ drops before vowels)
  { root: '낫다', meaning: 'To be better / recover', wordType: 'adjective', irregularType: 'ㅅ-irregular', level: 3 },
  { root: '짓다', meaning: 'To build / compose', wordType: 'verb', irregularType: 'ㅅ-irregular', level: 3 },

  // ㅎ-Irregular (ㅎ drops, vowel merges into 애/얘)
  { root: '그렇다', meaning: 'To be like that / so', wordType: 'adjective', irregularType: 'ㅎ-irregular', level: 2 },
  { root: '어떻다', meaning: 'To be how', wordType: 'adjective', irregularType: 'ㅎ-irregular', level: 2 },
];
