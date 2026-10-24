export type ParticleCategory =
  | 'subject-topic'
  | 'object'
  | 'location-direction'
  | 'connector'
  | 'recipient'
  | 'delimiters';

export interface ParticleGuideItem {
  id: string;
  korean: string;
  englishRole: string;
  category: ParticleCategory;
  consonantVowelRule: string;
  coreExplanation: string;
  comparisonVs?: {
    versus: string;
    keyDifference: string;
  };
  examples: Array<{
    korean: string;
    romanization: string;
    translation: string;
  }>;
}

export const PARTICLE_GUIDE_DATA: ParticleGuideItem[] = [
  {
    id: 'part-eun-neun',
    korean: '은 / 는',
    englishRole: 'Topic & Contrast Particle',
    category: 'subject-topic',
    consonantVowelRule: 'Consonant ending: 은 (학생은) | Vowel ending: 는 (저는)',
    coreExplanation: 'Marks what the sentence is talking about ("As for..."), sets the general theme, or introduces a contrast between two things.',
    comparisonVs: {
      versus: '이 / 가 (Subject)',
      keyDifference: 'Use 은/는 to establish a topic or contrast ("As for me..."). Use 이/가 to emphasize who/what specifically performs the action or introduces brand-new info.',
    },
    examples: [
      {
        korean: '저는 한국 사람이에요.',
        romanization: 'Jeoneun hanguk saram-ieyo.',
        translation: 'As for me, I am Korean.',
      },
      {
        korean: '사과는 맛있어요. 하지만 바나나는 비싸요.',
        romanization: 'Sagwaneun masisseoyo. Hajiman banananeun bissayo.',
        translation: 'Apples are delicious, but (in contrast) bananas are expensive.',
      },
    ],
  },
  {
    id: 'part-i-ga',
    korean: '이 / 가',
    englishRole: 'Subject Identifier Particle',
    category: 'subject-topic',
    consonantVowelRule: 'Consonant ending: 이 (선생님이) | Vowel ending: 가 (친구가)',
    coreExplanation: 'Pinpoints the exact grammatical subject of the predicate. Often answers "Who?" or "What?" and is required with 있어요/없어요 (have/exist).',
    comparisonVs: {
      versus: '은 / 는 (Topic)',
      keyDifference: '이/가 puts the spotlight on the subject itself ("Who did it? Minsoo did!"), whereas 은/는 puts the spotlight on the description.',
    },
    examples: [
      {
        korean: '누가 커피를 마셔요? 민수가 마셔요.',
        romanization: 'Nuga keopi-reul masyeoyo? Minsu-ga masyeoyo.',
        translation: 'Who is drinking coffee? Minsoo is (specifically).',
      },
      {
        korean: '시간이 있어요.',
        romanization: 'Sigan-i isseoyo.',
        translation: 'I have time (Time exists).',
      },
    ],
  },
  {
    id: 'part-eul-reul',
    korean: '을 / 를',
    englishRole: 'Direct Object Particle',
    category: 'object',
    consonantVowelRule: 'Consonant ending: 을 (책을, 밥을) | Vowel ending: 를 (사과를, 커피를)',
    coreExplanation: 'Attaches to the noun directly receiving the action of an active transitive verb (eat, drink, read, buy).',
    examples: [
      {
        korean: '한국어를 공부해요.',
        romanization: 'Hangugeo-reul gongbuhaeyo.',
        translation: 'I study Korean (Korean = direct object).',
      },
      {
        korean: '책을 읽어요.',
        romanization: 'Chaeg-eul ilgeoyo.',
        translation: 'I read a book.',
      },
    ],
  },
  {
    id: 'part-e',
    korean: '에',
    englishRole: 'Static Location, Destination & Time',
    category: 'location-direction',
    consonantVowelRule: 'Attaches directly to any noun (집에, 학교에, 3시에)',
    coreExplanation: 'Marks a static place of existence (있어요/없어요), the destination of movement (가다/오다), or a specific point in time.',
    comparisonVs: {
      versus: '에서 (Action Location)',
      keyDifference: 'Use "에" when simply being there (있다/없다) or heading there (가다). Use "에서" when actively doing an action there (studying, eating, working).',
    },
    examples: [
      {
        korean: '지금 집에 있어요.',
        romanization: 'Jigeum jib-e isseoyo.',
        translation: 'Right now I am at home (static existence).',
      },
      {
        korean: '내일 학교에 가요.',
        romanization: 'Naeil hakgyo-e gayo.',
        translation: 'Tomorrow I am going to school (destination).',
      },
      {
        korean: '오후 2시에 만나요.',
        romanization: 'Ohu dusi-e mannayo.',
        translation: "Let's meet at 2:00 PM (specific time).",
      },
    ],
  },
  {
    id: 'part-eseo',
    korean: '에서',
    englishRole: 'Dynamic Action Location & Origin',
    category: 'location-direction',
    consonantVowelRule: 'Attaches directly to any location (카페에서, 회사에서)',
    coreExplanation: 'Marks the location where a dynamic action takes place, or the starting origin ("from") of movement.',
    comparisonVs: {
      versus: '에 (Destination/Static)',
      keyDifference: '카페에 가요 (Going to the cafe) vs. 카페에서 공부해요 (Studying at the cafe).',
    },
    examples: [
      {
        korean: '카페에서 친구를 만나요.',
        romanization: 'Kape-eseo chingu-reul mannayo.',
        translation: 'I meet a friend at the cafe (active action).',
      },
      {
        korean: '미국에서 왔어요.',
        romanization: 'Miguk-eseo wasseoyo.',
        translation: 'I came from the United States (origin).',
      },
    ],
  },
  {
    id: 'part-euro',
    korean: '(으)로',
    englishRole: 'Direction, Tool & Means',
    category: 'location-direction',
    consonantVowelRule: 'Vowel or ㄹ ending: 로 (서울로, 칼로) | Consonant ending: 으로 (카드로, 집으로)',
    coreExplanation: 'Expresses the direction toward a destination ("toward"), the instrument/tool used ("by means of"), or the material an object is made of.',
    examples: [
      {
        korean: '오른쪽으로 가세요.',
        romanization: 'Oreunjjog-euro gaseyo.',
        translation: 'Please go toward the right (direction).',
      },
      {
        korean: '카드로 계산할게요.',
        romanization: 'Kadeu-ro gyesanhalgeyo.',
        translation: "I will pay by card (means / instrument).",
      },
      {
        korean: '지하철로 왔어요.',
        romanization: 'Jihacheol-ro wasseoyo.',
        translation: 'I came by subway (means of transit).',
      },
    ],
  },
  {
    id: 'part-connectors',
    korean: '(이)랑 / 하고 / 와•과',
    englishRole: 'And / Together With',
    category: 'connector',
    consonantVowelRule: '(이)랑: Consonant 이랑 / Vowel 랑 | 하고: Universal | 와/과: Consonant 과 / Vowel 와',
    coreExplanation: 'Connects nouns together ("A and B") or indicates doing an action together with someone ("with B").',
    comparisonVs: {
      versus: 'Register Difference',
      keyDifference: '(이)랑 is conversational/casual, 하고 is standard everyday polite, and 와/과 is formal/written.',
    },
    examples: [
      {
        korean: '비빔밥이랑 콜라 주세요.',
        romanization: 'Bibimbap-irang kolla juseyo.',
        translation: 'Bibimbap and cola please (casual conversational).',
      },
      {
        korean: '친구하고 영화를 봐요.',
        romanization: 'Chingu-hago yeonghwa-reul bwayo.',
        translation: 'I watch a movie with my friend (everyday polite).',
      },
    ],
  },
  {
    id: 'part-recipients',
    korean: '에게 / 한테 / 께',
    englishRole: 'Recipient ("To someone")',
    category: 'recipient',
    consonantVowelRule: '한테: Conversational | 에게: Standard/Written | 께: Honorific',
    coreExplanation: 'Indicates the human or animate recipient of an action ("give to", "send to", "say to").',
    examples: [
      {
        korean: '동생한테 선물을 줘요.',
        romanization: 'Dongsaeng-hante seonmul-eul jwoyo.',
        translation: 'I give a gift to my younger sibling (conversational).',
      },
      {
        korean: '선생님께 편지를 드려요.',
        romanization: 'Seonsaengnim-kke pyeonji-reul deuryeoyo.',
        translation: 'I give a letter to the teacher (respectful honorific 께).',
      },
    ],
  },
  {
    id: 'part-do-man',
    korean: '도 & 만',
    englishRole: 'Also (도) & Only (만)',
    category: 'delimiters',
    consonantVowelRule: 'Replaces 은/는, 이/가, and 을/를 directly',
    coreExplanation: '"도" means "also/too" (inclusion), while "만" means "only/just" (restriction).',
    examples: [
      {
        korean: '저도 학생이에요.',
        romanization: 'Jeo-do haksaeng-ieyo.',
        translation: 'I am also a student.',
      },
      {
        korean: '물만 마셔요.',
        romanization: 'Mul-man masyeoyo.',
        translation: 'I only drink water.',
      },
    ],
  },
  {
    id: 'part-buteo-kkaji',
    korean: '부터 ~ 까지',
    englishRole: 'From (time/start) ~ Until / To (end)',
    category: 'delimiters',
    consonantVowelRule: 'Attaches directly to time or place nouns',
    coreExplanation: 'Specifies the temporal range ("from time A to time B") or physical boundary (여기서 저기까지).',
    examples: [
      {
        korean: '아침 9시부터 오후 6시까지 일해요.',
        romanization: 'Achim ahopsi-buteo ohu yeoseossi-kkaji ilhaeyo.',
        translation: 'I work from 9:00 AM to 6:00 PM.',
      },
    ],
  },
];
