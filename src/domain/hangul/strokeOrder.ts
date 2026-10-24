export interface StrokeOrderInfo {
  char: string;
  strokeCount: number;
  generalRule: string;
  steps: string[];
}

export const HANGUL_STROKE_DATA: Record<string, StrokeOrderInfo> = {
  // Consonants
  ㄱ: {
    char: 'ㄱ',
    strokeCount: 1,
    generalRule: '1 continuous stroke: horizontal right, then bend downward without lifting pen.',
    steps: ['1. 가로로 긋다가 아래로 꺾어 내림 (Left to right, bend down)'],
  },
  ㄴ: {
    char: 'ㄴ',
    strokeCount: 1,
    generalRule: '1 continuous stroke: downward vertical, then bend rightward.',
    steps: ['1. 위에서 아래로 내리다가 오른쪽으로 꺾음 (Down, bend right)'],
  },
  ㄷ: {
    char: 'ㄷ',
    strokeCount: 2,
    generalRule: 'Top horizontal stroke first, then the lower L-shaped stroke.',
    steps: [
      '1. 위쪽 가로획을 왼쪽에서 오른쪽으로 그음',
      '2. 왼쪽 위에서 내려와 오른쪽으로 꺾음 (ㄴ 형태)',
    ],
  },
  ㄹ: {
    char: 'ㄹ',
    strokeCount: 3,
    generalRule: 'Top ㄱ shape, middle horizontal, then bottom ㄴ shape.',
    steps: [
      '1. 위쪽 ㄱ 형태를 한 획으로 그음',
      '2. 중간 가로획을 왼쪽에서 오른쪽으로 그음',
      '3. 세로로 내려와 오른쪽으로 꺾음 (ㄴ 형태)',
    ],
  },
  ㅁ: {
    char: 'ㅁ',
    strokeCount: 3,
    generalRule: 'Left vertical, top-right bend (ㄱ), then seal the bottom.',
    steps: [
      '1. 왼쪽 세로획을 위에서 아래로 그음',
      '2. 위 가로에서 오른쪽 세로로 꺾어 내림 (ㄱ 형태)',
      '3. 맨 아래 가로획으로 상자를 닫음',
    ],
  },
  ㅂ: {
    char: 'ㅂ',
    strokeCount: 4,
    generalRule: 'Two parallel vertical strokes first, then two horizontal connecting bars.',
    steps: [
      '1. 왼쪽 세로획을 내림',
      '2. 오른쪽 세로획을 내림',
      '3. 가운데 가로획을 연결함',
      '4. 아래쪽 가로획으로 닫음',
    ],
  },
  ㅅ: {
    char: 'ㅅ',
    strokeCount: 2,
    generalRule: 'Left diagonal stroke downwards, followed by right diagonal.',
    steps: [
      '1. 위에서 왼쪽 대각선으로 부드럽게 내림',
      '2. 중심에서 오른쪽 대각선으로 내림',
    ],
  },
  ㅇ: {
    char: 'ㅇ',
    strokeCount: 1,
    generalRule: 'Counter-clockwise continuous circle starting from the top 12 o\'clock position.',
    steps: ['1. 12시 방향에서 시작해 반시계 방향으로 원을 닫음'],
  },
  ㅈ: {
    char: 'ㅈ',
    strokeCount: 2,
    generalRule: 'Top horizontal and left diagonal bend, then right diagonal slant.',
    steps: [
      '1. 가로로 긋다가 왼쪽 대각선으로 꺾어 내림',
      '2. 꺾인 지점에서 오른쪽 대각선으로 내림',
    ],
  },
  ㅊ: {
    char: 'ㅊ',
    strokeCount: 3,
    generalRule: 'Top dot/hat stroke first, then the ㅈ body.',
    steps: [
      '1. 맨 위 가로 짧은 점/획을 그음',
      '2. 가로로 긋다가 왼쪽 대각선으로 꺾어 내림',
      '3. 오른쪽 대각선으로 내림',
    ],
  },
  ㅋ: {
    char: 'ㅋ',
    strokeCount: 2,
    generalRule: 'Base ㄱ shape first, then the inner middle horizontal stroke.',
    steps: [
      '1. 가로로 긋다가 아래로 꺾음 (ㄱ 형태)',
      '2. 안쪽 가운데 가로획을 그음',
    ],
  },
  ㅌ: {
    char: 'ㅌ',
    strokeCount: 3,
    generalRule: 'Top horizontal, middle horizontal, then bottom L-shape (ㄴ).',
    steps: [
      '1. 맨 위 가로획을 그음',
      '2. 가운데 가로획을 그음',
      '3. 아래 세로로 내려와 오른쪽으로 꺾음 (ㄴ 형태)',
    ],
  },
  ㅍ: {
    char: 'ㅍ',
    strokeCount: 4,
    generalRule: 'Top horizontal roof, two inner vertical bars, then bottom baseline.',
    steps: [
      '1. 맨 위 가로 지붕획을 길게 그음',
      '2. 왼쪽 세로획을 내림',
      '3. 오른쪽 세로획을 내림',
      '4. 맨 아래 가로 바닥획을 그음',
    ],
  },
  ㅎ: {
    char: 'ㅎ',
    strokeCount: 3,
    generalRule: 'Top dot/stroke, middle horizontal bar, then the circle (ㅇ).',
    steps: [
      '1. 맨 위 짧은 가로 점/획을 그음',
      '2. 중간 가로획을 그음',
      '3. 아래에 반시계 방향으로 원(ㅇ)을 그림',
    ],
  },

  // Double Consonants
  ㄲ: {
    char: 'ㄲ',
    strokeCount: 2,
    generalRule: 'Two side-by-side ㄱ strokes.',
    steps: ['1. 왼쪽 ㄱ을 1획으로 그음', '2. 오른쪽 ㄱ을 1획으로 그음'],
  },
  ㄸ: {
    char: 'ㄸ',
    strokeCount: 4,
    generalRule: 'Two side-by-side ㄷ strokes.',
    steps: ['1-2. 왼쪽 ㄷ 완성 (2획)', '3-4. 오른쪽 ㄷ 완성 (2획)'],
  },
  ㅃ: {
    char: 'ㅃ',
    strokeCount: 8,
    generalRule: 'Two side-by-side ㅂ strokes.',
    steps: ['1-4. 왼쪽 ㅂ 완성 (4획)', '5-8. 오른쪽 ㅂ 완성 (4획)'],
  },
  ㅆ: {
    char: 'ㅆ',
    strokeCount: 4,
    generalRule: 'Two side-by-side ㅅ strokes.',
    steps: ['1-2. 왼쪽 ㅅ 완성 (2획)', '3-4. 오른쪽 ㅅ 완성 (2획)'],
  },
  ㅉ: {
    char: 'ㅉ',
    strokeCount: 4,
    generalRule: 'Two side-by-side ㅈ strokes.',
    steps: ['1-2. 왼쪽 ㅈ 완성 (2획)', '3-4. 오른쪽 ㅈ 완성 (2획)'],
  },

  // Basic Vowels
  ㅏ: {
    char: 'ㅏ',
    strokeCount: 2,
    generalRule: 'Vertical stem top-to-bottom, then short right branch.',
    steps: [
      '1. 세로획을 위에서 아래로 길게 내림',
      '2. 가운데에서 오른쪽으로 짧은 가로획을 그음',
    ],
  },
  ㅑ: {
    char: 'ㅑ',
    strokeCount: 3,
    generalRule: 'Vertical stem, then two short right branches top then bottom.',
    steps: [
      '1. 세로획을 위에서 아래로 길게 내림',
      '2. 위쪽 짧은 가로획을 그음',
      '3. 아래쪽 짧은 가로획을 그음',
    ],
  },
  ㅓ: {
    char: 'ㅓ',
    strokeCount: 2,
    generalRule: 'Short left branch first, then the long vertical stem.',
    steps: [
      '1. 왼쪽에서 시작해 짧은 가로획을 그음',
      '2. 세로획을 위에서 아래로 길게 내림',
    ],
  },
  ㅕ: {
    char: 'ㅕ',
    strokeCount: 3,
    generalRule: 'Two short left branches, then the long vertical stem.',
    steps: [
      '1. 위쪽 짧은 가로획을 그음',
      '2. 아래쪽 짧은 가로획을 그음',
      '3. 세로획을 위에서 아래로 길게 내림',
    ],
  },
  ㅗ: {
    char: 'ㅗ',
    strokeCount: 2,
    generalRule: 'Short vertical upright stroke first, then the horizontal baseline.',
    steps: [
      '1. 위에서 아래로 짧은 세로획을 내림',
      '2. 아래 가로획을 왼쪽에서 오른쪽으로 길게 그음',
    ],
  },
  ㅛ: {
    char: 'ㅛ',
    strokeCount: 3,
    generalRule: 'Two vertical upright strokes left then right, then the horizontal baseline.',
    steps: [
      '1. 왼쪽 짧은 세로획을 내림',
      '2. 오른쪽 짧은 세로획을 내림',
      '3. 아래 가로획을 왼쪽에서 오른쪽으로 길게 그음',
    ],
  },
  ㅜ: {
    char: 'ㅜ',
    strokeCount: 2,
    generalRule: 'Long horizontal roof first, then the short vertical downward stroke.',
    steps: [
      '1. 위 가로획을 왼쪽에서 오른쪽으로 길게 그음',
      '2. 가운데에서 아래로 짧은 세로획을 내림',
    ],
  },
  ㅠ: {
    char: 'ㅠ',
    strokeCount: 3,
    generalRule: 'Long horizontal roof, then two downward vertical strokes.',
    steps: [
      '1. 위 가로획을 왼쪽에서 오른쪽으로 길게 그음',
      '2. 왼쪽 짧은 세로획을 내림',
      '3. 오른쪽 짧은 세로획을 내림',
    ],
  },
  ㅡ: {
    char: 'ㅡ',
    strokeCount: 1,
    generalRule: 'Single horizontal stroke left-to-right representing the flat ground.',
    steps: ['1. 왼쪽에서 오른쪽으로 평평하게 가로획을 그음'],
  },
  ㅣ: {
    char: 'ㅣ',
    strokeCount: 1,
    generalRule: 'Single vertical stroke top-to-bottom representing standing human.',
    steps: ['1. 위에서 아래로 곧게 세로획을 내림'],
  },
};

/**
 * Returns stroke order metadata for any Hangul character if available.
 */
export function getStrokeOrder(char: string): StrokeOrderInfo | null {
  return HANGUL_STROKE_DATA[char] ?? null;
}
