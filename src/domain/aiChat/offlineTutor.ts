export interface OfflineTutorAnswer {
  answer: string;
  koreanSnippet?: string;
}

interface KnowledgeEntry {
  keywords: string[];
  koreanSnippet?: string;
  answer: string;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ['은/는', '이/가', 'topic', 'subject', '조사'],
    koreanSnippet: '저는 학생이에요. 비가 와요.',
    answer: `### 📌 Topic (은/는) vs. Subject (이/가)

**1. Topic Particle: 은 (after consonant) / 는 (after vowel)**
- Focuses on **what the topic is**, contrast, or setting general background information.
- Example: **저는 학생이에요.** (*As for me, I am a student.*)
- Use for contrast: 사과는 맛있어요. 하지만 바나나는 맛없어요. (*Apples are delicious, but bananas are not.*)

**2. Subject Particle: 이 (after consonant) / 가 (after vowel)**
- Focuses on **who/what specifically is performing the action**, answers "Who?" or "What?", or states new immediate observations.
- Example: **비가 와요.** (*Rain is falling.* - Immediate observation)
- Example: **누가** 왔어요? 제가 왔어요. (*Who came? I did.*)

💡 **Pro Tip**: Use **은/는** when introducing a topic or contrasting; use **이/가** for new information or answering specific who/what questions!`,
  },
  {
    keywords: ['에', '에서', 'location', '장소', 'destination'],
    koreanSnippet: '학교에 가요. 도서관에서 공부해요.',
    answer: `### 📌 Location: 에 vs. 에서

**1. Destination & Static Presence: 에 (To / At / In)**
- Used with direction/movement verbs: **가다** (go), **오다** (come), **도착하다** (arrive).
  - *Example*: **학교에 가요.** (*I go to school.*)
- Used with existence/presence verbs: **있다** (exist/have), **없다** (not exist).
  - *Example*: **집에 있어요.** (*I am at home.*)
- Also used for time: **3시에 만나요.** (*Let's meet at 3 o'clock.*)

**2. Dynamic Action Location: 에서 (At / In / From)**
- Used when a physical activity or event takes place inside a location.
  - *Example*: **도서관에서 공부해요.** (*I study at the library.*)
  - *Example*: **식당에서 밥을 먹어요.** (*I eat food at the restaurant.*)
- Also used for origin (*from*): **한국에서 왔어요.** (*I came from Korea.*)`,
  },
  {
    keywords: ['ㅂ', '불규칙', 'irregular', '춥다', '덥다', '고맙다'],
    koreanSnippet: '추워요. 더워요. 고마워요.',
    answer: `### 📌 ㅂ-Irregular Verb & Adjective Conjugation

Many Korean predicates ending in batchim **ㅂ** change when meeting a suffix starting with a vowel (like **-아요/어요**):

**The Rule**:
The batchim **ㅂ** drops and turns into **우** (or rarely **오** for 돕다/곱다).
Stem + 우 + 어요 = **-워요**!

**Common Examples**:
- **춥다** (cold) ➔ 추 + 우 + 어요 ➔ **추워요** (It's cold)
- **덥다** (hot) ➔ 더 + 우 + 어요 ➔ **더워요** (It's hot)
- **어렵다** (difficult) ➔ 어려 + 우 + 어요 ➔ **어려워요** (It's difficult)
- **쉽다** (easy) ➔ 쉬 + 우 + 어요 ➔ **쉬워요** (It's easy)
- **고맙다** (thankful) ➔ 고마 + 우 + 어요 ➔ **고마워요** (Thank you)

⚠️ **Exceptions (Regular ㅂ verbs)**:
- **입다** (to wear) ➔ **입어요** (regular)
- **잡다** (to catch) ➔ **잡아요** (regular)
- **뽑다** (to pick) ➔ **뽑아요** (regular)`,
  },
  {
    keywords: ['number', '숫자', 'sino', 'native', '하나', '일'],
    koreanSnippet: '오후 세 시 삼십 분이에요.',
    answer: `### 📌 Sino-Korean vs. Native Korean Numbers

Korean uses **two separate number systems** with distinct rules:

**1. Native Korean (1 to 99): Count items, people, age, hours**
- Numbers: 하나 (1), 둘 (2), 셋 (3), 넷 (4), 다섯 (5), 여섯 (6), 일곱 (7), 여덟 (8), 아홉 (9), 열 (10)
- Notice contractions before counters: **한 개**, **두 명**, **세 살**, **네 잔**, **스무 살**
- Used for: Hours (3시), Counting objects (개), People (명), Animals (마리), Age (살).

**2. Sino-Korean: Math, money, minutes, dates, phone numbers**
- Numbers: 일 (1), 이 (2), 삼 (3), 사 (4), 오 (5), 육 (6), 칠 (7), 팔 (8), 구 (9), 십 (10), 백 (100), 천 (1,000), 만 (10,000), 억 (100,000,000)
- Used for: Minutes (30분), Price (5,000원), Dates (10월 25일), Phone numbers, Floors (3층).

💡 **Clock Time Combo**:
Hours are Native, Minutes are Sino!
- **3:30** = **세 시** (Native 3) + **삼십 분** (Sino 30)`,
  },
  {
    keywords: ['해요', '습니다', 'polite', 'formal', '존댓말', '격식'],
    koreanSnippet: '안녕하세요 / 안녕하십니까',
    answer: `### 📌 Polite Style (-아요/어요) vs. Formal Deferential (-습니다)

Both styles are respectful and honorific (**존댓말**), but serve different social contexts:

**1. Informal Polite: -아요 / -어요 (-해요)**
- **When to use**: Everyday conversation with colleagues, acquaintances, shop staff, and strangers. Friendly, warm, and natural.
- *Examples*:
  - 가다 ➔ **가요**
  - 먹다 ➔ **먹어요**
  - 하다 ➔ **해요**

**2. Formal Polite Deferential: -습니다 / -습니까?**
- **When to use**: News broadcasting, military, formal business presentations, airport announcements, or speaking to senior executives for the first time.
- *Examples*:
  - 가다 ➔ **갑니다** (statement) / **갑니까?** (question)
  - 먹다 ➔ **먹습니다** (statement) / **먹습니까?** (question)
  - 하다 ➔ **합니다** (statement) / **합니까?** (question)

💡 **Recommendation for Beginners**: Default to **-아요/어요** in 90% of daily Seoul life; it is polite, respectful, and friendly!`,
  },
  {
    keywords: ['cafe', 'coffee', 'order', '카페', '주문', '아메리카노'],
    koreanSnippet: '아이스 아메리카노 한 잔 주세요.',
    answer: `### ☕ Ordering Drinks at a Seoul Cafe

Here are the essential phrases you will hear and use:

1. **Ordering Your Drink**:
   - **아이스 아메리카노 한 잔 주세요.** (*One iced Americano, please.*)
   - **따뜻한 라떼 두 잔 주세요.** (*Two hot lattes, please.*)

2. **Dine-in vs. Takeout**:
   - Staff will ask: **드시고 가세요?** (*For here or to-go?*)
   - For here: **마시고 갈게요.** (*I'll drink it here.*)
   - Takeout: **테이크아웃 할게요.** or **가져갈게요.** (*Takeout, please.*)

3. **Receipt**:
   - Staff will ask: **영수증 필요하세요?** (*Do you need a receipt?*)
   - Decline politely: **아니요, 버려주세요.** (*No, please discard it.*)

💡 **Cultural Note**: Korea loves iced coffee so much that there is a famous idiom: **얼죽아** (*Even if I freeze to death, I drink Iced Americano!*).`,
  },
  {
    keywords: ['slang', 'texting', '줄임말', 'ㅋㅋ', 'ㅎㅎ', '신조어'],
    koreanSnippet: '대박! 진짜요? ㅋㅋ',
    answer: `### 💬 Popular Korean Texting & Daily Slang

**1. Texting Consonant Acronyms (초성 줄임말)**:
- **ㅋㅋ** (keu-keu): Laughing / lol.
- **ㅎㅎ** (ha-ha): Gentle chuckle or friendly smile.
- **ㅠㅠ / ㅜㅜ**: Crying eyes (tears streaming down).
- **ㄳ** (gam-sa): Short for 감사합니다 (Thanks).
- **ㅇㅇ** (eung-eung): Short for 응 / 그래 (Yeah / Okay).
- **ㄴㄴ** (no-no): Short for 노노 (No / Don't do that).

**2. Everyday Expressive Slang**:
- **대박** (dae-bak): Awesome! Incredible! Jackpot!
- **꿀잼** (kkul-jaem): Super fun! (꿀 honey + 재미 fun)
- **노잼** (no-jaem): Boring / not fun.
- **존맛탱 (JMT)** (jon-mat-taeng): Insanely delicious food!
- **심쿵** (sim-kung): Heart flutter / heart skip a beat from cuteness.`,
  },
];

export function getOfflineTutorAnswer(query: string): OfflineTutorAnswer {
  const normalized = query.toLowerCase().trim();

  for (const entry of KNOWLEDGE_BASE) {
    const isMatched = entry.keywords.some((kw) => normalized.includes(kw.toLowerCase()));
    if (isMatched) {
      return {
        answer: entry.answer,
        koreanSnippet: entry.koreanSnippet,
      };
    }
  }

  // Helpful general pedagogical fallback
  return {
    answer: `### 🇰🇷 Korean Learning Assistance

I'm your **Klearn Korean Tutor**. You can ask me anything about:
- **Grammar & Particles**: *은/는 vs. 이/가*, *에 vs. 에서*, *을/를*, *-(으)ㄹ 거예요*
- **Verb Conjugations**: Regular rules and irregular patterns (*ㄷ, ㅂ, ㅡ, 르, ㄹ, ㅅ, ㅎ*)
- **Vocabulary & Nuances**: Differences between similar words, counters, numbers
- **Situational Phrases**: Ordering at cafes, subway directions, restaurant phrases
- **Culture & Etiquette**: Honorifics (*존댓말* vs *반말*), texting slang, and social customs

💡 *Tip: Try asking one of the recommended prompts below or rephrase with specific Korean words!*`,
    koreanSnippet: '한국어 공부 화이팅!',
  };
}
