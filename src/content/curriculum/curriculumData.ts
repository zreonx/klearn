import { Curriculum } from '@/domain/curriculum/types';

export const CURRICULUM_DATA: Curriculum = {
  levels: [
    // Level 1: Foundations
    {
      id: 'level-foundations',
      title: 'Level 1: Foundations',
      description: 'Master Hangul alphabet characters, final consonants (Batchim), and essential courtesies.',
      order: 1,
      units: [
        {
          id: 'unit-hangul',
          levelId: 'level-foundations',
          title: 'Hangul Letters & Sounds',
          description: 'The Korean alphabet: core consonants, vowels, and aspirated sounds.',
          order: 1,
          lessons: [
            {
              id: 'lesson-hangul-consonants',
              unitId: 'unit-hangul',
              title: 'Basic Consonants',
              koreanTitle: '기본 자음',
              description: 'Learn the primary consonants (ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅅ, ㅇ).',
              order: 1,
              learningObjectives: [
                'Recognize the 8 basic Korean consonants',
                'Pronounce consonants accurately according to mouth position',
              ],
              conceptNote: {
                summary: 'Hangul consonants depict the shape of the mouth, tongue, and throat during sound production.',
                explanation: 'Korean letters are grouped into syllable blocks rather than written in a straight line. Every block begins with a consonant.',
              },
              itemIds: [
                'hg-c-g',
                'hg-c-n',
                'hg-c-d',
                'hg-c-r',
                'hg-c-m',
                'hg-c-b',
                'hg-c-s',
                'hg-c-ng',
              ],
            },
            {
              id: 'lesson-hangul-vowels',
              unitId: 'unit-hangul',
              title: 'Basic Vowels',
              koreanTitle: '기본 모음',
              description: 'Master the bright and dark foundational vowels (ㅏ, ㅓ, ㅗ, ㅜ, ㅡ, ㅣ).',
              order: 2,
              prerequisites: ['lesson-hangul-consonants'],
              learningObjectives: [
                'Distinguish horizontal and vertical vowel strokes',
                'Understand bright (ㅏ, ㅗ) and dark (ㅓ, ㅜ) vowel sounds',
              ],
              conceptNote: {
                summary: 'Hangul vowels are derived from three philosophical symbols: Heaven (•), Earth (ㅡ), and Humanity (ㅣ).',
                explanation: 'Vertical vowels attach to the right of an initial consonant (like 가), while horizontal vowels sit underneath (like 고).',
              },
              itemIds: [
                'hg-v-a',
                'hg-v-eo',
                'hg-v-o',
                'hg-v-u',
                'hg-v-eu',
                'hg-v-i',
              ],
            },
            {
              id: 'lesson-hangul-aspirated',
              unitId: 'unit-hangul',
              title: 'Aspirated Consonants',
              koreanTitle: '거센소리',
              description: 'Consonants pronounced with a sharp burst of air (ㅊ, ㅋ, ㅌ, ㅍ, ㅎ).',
              order: 3,
              prerequisites: ['lesson-hangul-consonants'],
              learningObjectives: [
                'Contrast plain consonants with their aspirated counterparts',
                'Produce air bursts without vocal strain',
              ],
              conceptNote: {
                summary: 'Aspirated consonants add an extra stroke to indicate an explosive burst of breath.',
                explanation: 'Place a hand in front of your lips: when pronouncing ㅋ or ㅌ, you should feel a distinct puff of air.',
              },
              itemIds: [
                'hg-c-ch',
                'hg-c-k',
                'hg-c-t',
                'hg-c-p',
                'hg-c-h',
              ],
            },
          ],
        },
        {
          id: 'unit-batchim',
          levelId: 'level-foundations',
          title: 'Syllables & Batchim',
          description: 'Learn how Korean syllable blocks are constructed and master final consonants (받침).',
          order: 2,
          lessons: [
            {
              id: 'lesson-hangul-batchim',
              unitId: 'unit-batchim',
              title: 'Core Final Consonants',
              koreanTitle: '받침 기초',
              description: 'Learn how consonants change sound when placed at the bottom of a syllable block.',
              order: 1,
              prerequisites: ['lesson-hangul-vowels'],
              learningObjectives: [
                'Read 3-letter syllable blocks (Consonant + Vowel + Batchim)',
                'Master the 5 core batchim sounds (ㄱ, ㄴ, ㄹ, ㅁ, ㅇ)',
              ],
              conceptNote: {
                summary: 'Batchim (받침) literally means "support" or "pedestal". It is any consonant resting at the bottom of a syllable.',
                explanation: 'In batchim position, stop consonants like ㄱ close the airflow immediately, while sonorant consonants like ㄴ, ㄹ, ㅁ, ㅇ resonate smoothly.',
              },
              itemIds: [
                'hg-b-k',
                'hg-b-n',
                'hg-b-l',
                'hg-b-m',
                'hg-b-ng',
              ],
            },
          ],
        },
        {
          id: 'unit-greetings',
          levelId: 'level-foundations',
          title: 'Essential Courtesies',
          description: 'Polite greetings and courteous expressions for daily encounters.',
          order: 3,
          lessons: [
            {
              id: 'lesson-greetings',
              unitId: 'unit-greetings',
              title: 'Daily Greetings & Thanks',
              koreanTitle: '인사와 감사',
              description: 'Essential expressions for meeting people and expressing gratitude.',
              order: 1,
              learningObjectives: [
                'Use standard polite Korean greetings in everyday situations',
                'Express heartfelt thanks and polite apologies with correct posture and tone',
              ],
              conceptNote: {
                summary: 'Standard polite speech (존댓말) is essential when addressing acquaintances, strangers, or elders.',
                explanation: 'A slight bow accompanied by "안녕하세요" is the universal gesture of warmth and respect in Korea.',
                formalityLevel: 'polite',
              },
              itemIds: ['voc-greet-1', 'voc-greet-2', 'voc-greet-3'],
            },
            {
              id: 'lesson-partings',
              unitId: 'unit-greetings',
              title: 'Polite Partings',
              koreanTitle: '작별 인사',
              description: 'How to properly say goodbye when staying or departing.',
              order: 2,
              prerequisites: ['lesson-greetings'],
              learningObjectives: [
                'Distinguish between saying goodbye to someone leaving vs. someone staying',
              ],
              conceptNote: {
                summary: 'Korean has two distinct goodbye phrases depending on who is staying and who is leaving.',
                explanation: 'Say "안녕히 계세요" (Stay peacefully) to the person staying. Say "안녕히 가세요" (Go peacefully) to the person leaving.',
                formalityLevel: 'polite',
              },
              itemIds: ['voc-greet-4', 'voc-greet-5'],
            },
          ],
        },
      ],
    },

    // Level 2: Beginner A1
    {
      id: 'level-beginner-a1',
      title: 'Level 2: Beginner A1',
      description: 'Form basic Korean sentences with topic particles, identification, and existence.',
      order: 2,
      units: [
        {
          id: 'unit-sentence-basics',
          levelId: 'level-beginner-a1',
          title: 'Identity & Topic Particle',
          description: 'Introduce yourself and state what things are using 은/는 and 이에요/예요.',
          order: 1,
          lessons: [
            {
              id: 'lesson-topic-particle',
              unitId: 'unit-sentence-basics',
              title: 'Topic Particle 은 / 는',
              koreanTitle: '주제 조사 은/는',
              description: 'Introduce topics and state "As for me..." with humble polite pronoun 저.',
              order: 1,
              learningObjectives: [
                'Choose correctly between 은 and 는 based on final consonant presence',
                'Introduce yourself using polite pronoun 저',
              ],
              conceptNote: {
                summary: 'Particles (조사) attach directly to nouns to signal their grammatical role in the sentence.',
                explanation: 'Use "은" after a noun ending in a consonant (like 사람 + 은), and "는" after a noun ending in a vowel (like 저 + 는).',
                grammarTip: '저 (Me/I) + 는 = 저는 ("As for me...")',
                formalityLevel: 'polite',
              },
              itemIds: ['gram-part-eun-neun', 'voc-pron-jeo'],
            },
            {
              id: 'lesson-copula-identity',
              unitId: 'unit-sentence-basics',
              title: 'Identification: 이에요 / 예요',
              koreanTitle: '서술격 조사 이에요/예요',
              description: 'Say "I am [X]" or "This is [Y]" in polite conversation.',
              order: 2,
              prerequisites: ['lesson-topic-particle'],
              learningObjectives: [
                'State professions and identities in polite speech',
                'Apply 이에요 vs. 예요 correctly based on batchim',
              ],
              conceptNote: {
                summary: '이에요 and 예요 mean "am / is / are" in the standard polite register.',
                explanation: 'If the noun ends in a consonant, attach 이에요 (e.g. 학생 + 이에요). If it ends in a vowel, attach 예요 (e.g. 의사 + 예요).',
                formalityLevel: 'polite',
              },
              dialogue: {
                title: 'Classroom Introduction (교실에서)',
                description: 'Two students introduce themselves on the first day of class.',
                lines: [
                  {
                    speaker: '민수',
                    korean: '안녕하세요! 저는 민수예요.',
                    translation: 'Hello! I am Minsu.',
                    romanization: 'annyeonghaseyo! jeoneun minsu-yeyo.',
                  },
                  {
                    speaker: '지우',
                    korean: '안녕하세요, 민수 씨! 저는 학생 지우예요.',
                    translation: 'Hello, Minsu! I am Jiwoo, a student.',
                    romanization: 'annyeonghaseyo, minsu ssi! jeoneun haksaeng jiwoo-yeyo.',
                  },
                  {
                    speaker: '민수',
                    korean: '만나서 반갑습니다, 지우 씨!',
                    translation: 'Nice to meet you, Jiwoo!',
                    romanization: 'mannaseo bangapsumnida, jiwoo ssi!',
                  },
                ],
              },
              itemIds: ['gram-cop-ieyo-yeyo', 'voc-noun-student', 'voc-noun-teacher'],
            },
          ],
        },
        {
          id: 'unit-demonstratives',
          levelId: 'level-beginner-a1',
          title: 'Demonstratives: This & That',
          description: 'Identify and point to objects relative to the speaker and listener.',
          order: 2,
          lessons: [
            {
              id: 'lesson-demonstratives',
              unitId: 'unit-demonstratives',
              title: 'This, That, and That Over There',
              koreanTitle: '지시대명사 이·그·저',
              description: 'Master 이것 (this), 그것 (that), and 저것 (that over there).',
              order: 1,
              learningObjectives: [
                'Point out objects near you, near the listener, or far from both',
                'Form simple questions: 이것은 뭐예요? (What is this?)',
              ],
              conceptNote: {
                summary: 'Korean divides demonstratives into three spatial zones: near speaker (이), near listener (그), and far from both (저).',
                explanation: 'Adding 것 (thing) creates pronouns: 이것 (this thing), 그것 (that thing), 저것 (that thing over there).',
                formalityLevel: 'polite',
              },
              itemIds: ['voc-dem-this', 'voc-dem-that', 'voc-dem-that-over-there'],
            },
          ],
        },
        {
          id: 'unit-existence',
          levelId: 'level-beginner-a1',
          title: 'Existence & Possession',
          description: 'Express having or not having items, and presence in a location.',
          order: 3,
          lessons: [
            {
              id: 'lesson-existence',
              unitId: 'unit-existence',
              title: 'Have & Exist: 있어요 / 없어요',
              koreanTitle: '존재 표현 있어요/없어요',
              description: 'Use the subject particle 이/가 with 있어요 and 없어요.',
              order: 1,
              learningObjectives: [
                'Express possession ("I have...") and absence ("I do not have...")',
                'Use subject particles 이 and 가 correctly',
              ],
              conceptNote: {
                summary: '있어요 means "to exist" or "to have", while 없어요 means "to not exist" or "to lack".',
                explanation: 'The item possessed takes the subject particle 이/가: [Noun]이/가 있어요. (e.g., 물이 있어요 = There is water).',
                formalityLevel: 'polite',
              },
              itemIds: ['gram-verb-isseoyo', 'gram-verb-eopseoyo', 'gram-part-i-ga'],
            },
            {
              id: 'lesson-daily-nouns',
              unitId: 'unit-existence',
              title: 'Everyday Objects & Places',
              koreanTitle: '일상 사물과 장소',
              description: 'Core daily nouns to pair with 있어요/없어요.',
              order: 2,
              prerequisites: ['lesson-existence'],
              learningObjectives: [
                'Incorporate daily nouns into full sentences with particles',
              ],
              conceptNote: {
                summary: 'Expand your vocabulary with fundamental objects and locations.',
                explanation: 'Practice combining these with 있어요: "물이 있어요" (We have water), "학교에 있어요" (I am at school).',
              },
              itemIds: [
                'voc-noun-water',
                'voc-noun-rice',
                'voc-noun-tea',
                'voc-noun-person',
                'voc-noun-school',
              ],
            },
          ],
        },
      ],
    },
  ],
};
