/**
 * Cultural Micro-Stories & Reading Bites (짧은 한국어 읽기).
 * Authentic everyday cultural stories crafted for gentle reading comprehension without overwhelm.
 */

export interface StoryVocabulary {
  word: string;
  meaning: string;
  romanization: string;
}

export interface StorySentence {
  korean: string;
  translation: string;
  romanization: string;
  vocab: StoryVocabulary[];
}

export interface ComprehensionCheck {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CulturalStory {
  id: string;
  titleKorean: string;
  titleEnglish: string;
  levelTag: 'Foundations' | 'Everyday' | 'Independent';
  culturalNote: string;
  coverIcon: string;
  sentences: StorySentence[];
  comprehension: ComprehensionCheck;
}

export const CULTURAL_STORIES: CulturalStory[] = [
  {
    id: 'convenience-store',
    titleKorean: '편의점 야식',
    titleEnglish: 'Late-Night Convenience Store Run',
    levelTag: 'Foundations',
    coverIcon: 'storefront-outline',
    culturalNote:
      'In Korea, convenience stores (편의점) are open 24/7 and serve as community hubs where you can cook ramyeon on specialized hot-water induction machines and eat on patio tables outside.',
    sentences: [
      {
        korean: '밤 열한 시에 친구와 편의점에 갔어요.',
        translation: 'At 11:00 at night, I went to the convenience store with my friend.',
        romanization: 'Bam yeol-han si-e chin-gu-wa pyeon-ui-jeom-e gas-seo-yo.',
        vocab: [
          { word: '밤', meaning: 'Night', romanization: 'bam' },
          { word: '열한 시', meaning: '11:00', romanization: 'yeol-han si' },
          { word: '편의점', meaning: 'Convenience store', romanization: 'pyeon-ui-jeom' },
        ],
      },
      {
        korean: '따뜻한 라면과 삼각김밥을 골랐어요.',
        translation: 'We chose warm ramyeon and triangle kimbap.',
        romanization: 'Tta-tteut-han ra-myeon-gwa sam-gak-gim-bap-eul gol-ras-seo-yo.',
        vocab: [
          { word: '따뜻한', meaning: 'Warm', romanization: 'tta-tteut-han' },
          { word: '라면', meaning: 'Ramyeon (instant noodles)', romanization: 'ra-myeon' },
          { word: '삼각김밥', meaning: 'Triangle kimbap', romanization: 'sam-gak-gim-bap' },
        ],
      },
      {
        korean: '뜨거운 물을 붓고 밖 테이블에서 먹었어요.',
        translation: 'We poured hot water and ate at the outside table.',
        romanization: 'Tteu-geo-un mul-eul but-go bak te-i-beul-e-seo meog-eot-seo-yo.',
        vocab: [
          { word: '뜨거운 물', meaning: 'Hot water', romanization: 'tteu-geo-un mul' },
          { word: '밖', meaning: 'Outside', romanization: 'bak' },
          { word: '테이블', meaning: 'Table', romanization: 'te-i-beul' },
        ],
      },
      {
        korean: '정말 맛있고 시원한 밤이었어요.',
        translation: 'It was truly delicious and a cool, refreshing night.',
        romanization: 'Jeong-mal mas-it-go si-won-han bam-i-eot-seo-yo.',
        vocab: [
          { word: '정말', meaning: 'Truly / Really', romanization: 'jeong-mal' },
          { word: '맛있고', meaning: 'Delicious and...', romanization: 'mas-it-go' },
          { word: '시원한', meaning: 'Cool / Refreshing', romanization: 'si-won-han' },
        ],
      },
    ],
    comprehension: {
      question: 'What did the friends choose to eat at the convenience store?',
      options: ['Pizza and Cola', 'Ramyeon and Triangle Kimbap', 'Bread and Milk', 'Ice Cream and Cake'],
      correctAnswerIndex: 1,
      explanation: 'The sentence states: "따뜻한 라면과 삼각김밥을 골랐어요" (We chose warm ramyeon and triangle kimbap).',
    },
  },
  {
    id: 'han-river-picnic',
    titleKorean: '한강에서 치킨 먹기',
    titleEnglish: 'Fried Chicken by the Han River',
    levelTag: 'Everyday',
    coverIcon: 'water-outline',
    culturalNote:
      'A quintessential Seoul leisure experience is spreading out a picnic mat (돗자리) in a Han River park and ordering delivery chicken directly to a designated "Delivery Zone" (배달존).',
    sentences: [
      {
        korean: '주말 오후에 여의도 한강공원에 갔어요.',
        translation: 'On a weekend afternoon, I went to Yeouido Han River Park.',
        romanization: 'Ju-mal o-hu-e Yeo-ui-do Han-gang-gong-won-e gas-seo-yo.',
        vocab: [
          { word: '주말', meaning: 'Weekend', romanization: 'ju-mal' },
          { word: '오후', meaning: 'Afternoon', romanization: 'o-hu' },
          { word: '공원', meaning: 'Park', romanization: 'gong-won' },
        ],
      },
      {
        korean: '풀밭에 돗자리를 펴고 배달 앱으로 치킨을 주문했어요.',
        translation: 'We spread a picnic mat on the grass and ordered chicken on a delivery app.',
        romanization: 'Pul-bat-e dot-ja-ri-reul pyeo-go bae-dal aep-eu-ro chi-kin-eul ju-mun-haet-seo-yo.',
        vocab: [
          { word: '돗자리', meaning: 'Picnic mat', romanization: 'dot-ja-ri' },
          { word: '배달 앱', meaning: 'Delivery app', romanization: 'bae-dal aep' },
          { word: '주문했어요', meaning: 'Ordered', romanization: 'ju-mun-haet-seo-yo' },
        ],
      },
      {
        korean: '삼십 분 뒤에 배달존에서 따뜻한 치킨을 받았어요.',
        translation: 'Thirty minutes later, we picked up the hot chicken at the Delivery Zone.',
        romanization: 'Sam-sip bun dwi-e bae-dal-jon-e-seo tta-tteut-han chi-kin-eul bad-at-seo-yo.',
        vocab: [
          { word: '삼십 분', meaning: '30 minutes', romanization: 'sam-sip bun' },
          { word: '배달존', meaning: 'Delivery Zone', romanization: 'bae-dal-jon' },
          { word: '받았어요', meaning: 'Received / Picked up', romanization: 'bad-at-seo-yo' },
        ],
      },
      {
        korean: '강바람을 맞으며 먹는 치킨은 최고였어요.',
        translation: 'Eating chicken while feeling the river breeze was the best.',
        romanization: 'Gang-ba-ram-eul maj-eu-myeo meok-neun chi-kin-eun choe-go-yeot-seo-yo.',
        vocab: [
          { word: '강바람', meaning: 'River breeze', romanization: 'gang-ba-ram' },
          { word: '최고', meaning: 'The best / Supreme', romanization: 'choe-go' },
        ],
      },
    ],
    comprehension: {
      question: 'Where did they pick up their delivery chicken in the park?',
      options: ['Subway station entrance', 'The Delivery Zone (배달존)', 'A convenience store', 'The parking lot'],
      correctAnswerIndex: 1,
      explanation: 'In Korean parks, designated "Delivery Zones" (배달존) allow delivery riders and customers to easily meet.',
    },
  },
  {
    id: 'subway-manners',
    titleKorean: '지하철 에티켓',
    titleEnglish: 'Seoul Subway Manners & Etiquette',
    levelTag: 'Everyday',
    coverIcon: 'subway-outline',
    culturalNote:
      'Seoul Subway cars have dedicated "Priority Seats" (노약자석) at both ends of each train car for the elderly, pregnant women, and people with disabilities. Locals leave these seats open even on crowded trains.',
    sentences: [
      {
        korean: '서울 지하철은 정말 빠르고 깨끗해요.',
        translation: 'The Seoul subway is really fast and clean.',
        romanization: 'Seo-ul ji-ha-cheol-eun jeong-mal ppa-reu-go kkae-kkeut-hae-yo.',
        vocab: [
          { word: '지하철', meaning: 'Subway', romanization: 'ji-ha-cheol' },
          { word: '빠르고', meaning: 'Fast and...', romanization: 'ppa-reu-go' },
          { word: '깨끗해요', meaning: 'Is clean', romanization: 'kkae-kkeut-hae-yo' },
        ],
      },
      {
        korean: '열차 안에서는 조용히 이야기하고 전화는 작게 받아요.',
        translation: 'Inside the train, speak quietly and answer calls in a low voice.',
        romanization: 'Yeol-cha an-e-seo-neun jo-yong-hi i-ya-gi-ha-go jeon-hwa-neun jak-ge bad-a-yo.',
        vocab: [
          { word: '조용히', meaning: 'Quietly', romanization: 'jo-yong-hi' },
          { word: '전화', meaning: 'Phone call', romanization: 'jeon-hwa' },
          { word: '작게', meaning: 'In a low volume', romanization: 'jak-ge' },
        ],
      },
      {
        korean: '노약자석은 어르신과 임산부를 위해 비워 두는 것이 예의예요.',
        translation: 'It is good etiquette to leave priority seats empty for elders and pregnant passengers.',
        romanization: 'No-yak-ja-seok-eun eo-reu-sin-gwa im-san-bu-reul wi-hae bi-wo du-neun geot-i ye-ui-ye-yo.',
        vocab: [
          { word: '노약자석', meaning: 'Priority seating', romanization: 'no-yak-ja-seok' },
          { word: '어르신', meaning: 'Honored elder', romanization: 'eo-reu-sin' },
          { word: '예의', meaning: 'Etiquette / Manners', romanization: 'ye-ui' },
        ],
      },
    ],
    comprehension: {
      question: 'What is the etiquette regarding priority seats (노약자석)?',
      options: [
        'Anyone can take them if tired',
        'Leave them empty for elders and pregnant passengers',
        'Use them to put luggage on',
        'Only use them during rush hour',
      ],
      correctAnswerIndex: 1,
      explanation: 'Priority seats (노약자석) are respectfully reserved for elders, pregnant women, and people with disabilities.',
    },
  },
  {
    id: 'iced-americano',
    titleKorean: '얼죽아와 카페 문화',
    titleEnglish: 'Korean Cafe Culture & "Eol-Juk-Ah"',
    levelTag: 'Independent',
    coverIcon: 'cafe-outline',
    culturalNote:
      'Korea is famous for its vibrant cafe scene. The popular slang "얼죽아" (Eol-Juk-Ah) stands for "얼어 죽어도 아이스 아메리카노" (Even if I freeze to death, iced Americano!), reflecting Koreans\' love for iced coffee year-round.',
    sentences: [
      {
        korean: '한국에는 골목마다 예쁜 카페가 정말 많아요.',
        translation: 'In Korea, there are so many pretty cafes in every alley.',
        romanization: 'Han-guk-e-neun gol-mok-ma-da ye-ppeun ka-pe-ga jeong-mal man-a-yo.',
        vocab: [
          { word: '골목마다', meaning: 'In every alley', romanization: 'gol-mok-ma-da' },
          { word: '예쁜', meaning: 'Pretty', romanization: 'ye-ppeun' },
          { word: '많아요', meaning: 'Are many', romanization: 'man-a-yo' },
        ],
      },
      {
        korean: '추운 겨울에도 많은 사람들이 "얼죽아"를 외치며 아이스커피를 마셔요.',
        translation: 'Even in cold winter, many people chant "Eol-Juk-Ah" and drink iced coffee.',
        romanization: 'Chu-un gyeo-ul-e-do man-eun sa-ram-deul-i "eol-juk-ah"-reul oe-chi-myeo a-i-seu-keo-pi-reul ma-syeo-yo.',
        vocab: [
          { word: '추운 겨울', meaning: 'Cold winter', romanization: 'chu-un gyeo-ul' },
          { word: '얼죽아', meaning: 'Iced Americano even if I freeze', romanization: 'eol-juk-ah' },
          { word: '아이스커피', meaning: 'Iced coffee', romanization: 'a-i-seu-keo-pi' },
        ],
      },
      {
        korean: '카페에서 편하게 공부하거나 친구와 이야기할 수 있어요.',
        translation: 'You can study comfortably or talk with friends at cafes.',
        romanization: 'Ka-pe-e-seo pyeon-ha-ge gong-bu-ha-geo-na chin-gu-wa i-ya-gi-hal su iss-eo-yo.',
        vocab: [
          { word: '편하게', meaning: 'Comfortably', romanization: 'pyeon-ha-ge' },
          { word: '공부하거나', meaning: 'Study or...', romanization: 'gong-bu-ha-geo-na' },
        ],
      },
    ],
    comprehension: {
      question: 'What does the popular slang "얼죽아" (Eol-Juk-Ah) refer to?',
      options: [
        'Eating hot stew only in winter',
        'Drinking iced Americano even in freezing cold weather',
        'Studying until midnight at cafes',
        'Ordering hot tea before sleep',
      ],
      correctAnswerIndex: 1,
      explanation: '얼죽아 is an acronym for "얼어 죽어도 아이스 아메리카노" (Even if I freeze to death, Iced Americano!).',
    },
  },
];
