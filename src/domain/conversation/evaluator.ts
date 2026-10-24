import { CoachingFeedback, FormalityRegister } from './types';

export function evaluateFormality(
  userText: string,
  targetFormality: FormalityRegister
): CoachingFeedback {
  const trimmed = userText.trim();
  if (!trimmed) {
    return {
      isCorrectRegister: false,
      tip: 'Please enter a response in Korean.',
    };
  }

  // Detect endings
  const hasFormalEnding =
    /(?:습니다|습니까|입니다|입니까|올시다|시지요)[.?!~]*$/.test(trimmed) ||
    trimmed.includes('안녕하십니까') ||
    trimmed.includes('감사합니다') ||
    trimmed.includes('부탁드립니다');

  const hasInformalPoliteEnding =
    /(?:요|세요|예요|이에요|게요|나요|가요)[.?!~]*$/.test(trimmed) ||
    trimmed.includes('안녕하세요') ||
    trimmed.includes('고마워요');

  if (targetFormality === 'formal-polite') {
    if (hasFormalEnding) {
      return {
        isCorrectRegister: true,
        tip: 'Excellent! You used the respectful formal register (하십시오체 -습니다/습니까).',
        detectedEnding: 'Formal Polite (-습니다)',
      };
    } else if (hasInformalPoliteEnding) {
      return {
        isCorrectRegister: false,
        tip: 'In a formal business context, try elevating from "-요" to "-습니다/입니다".',
        detectedEnding: 'Informal Polite (-요)',
      };
    } else {
      return {
        isCorrectRegister: false,
        tip: 'Remember to conclude formal statements with respectful endings like "-습니다".',
        detectedEnding: 'Casual / Unidentified',
      };
    }
  }

  if (targetFormality === 'informal-polite') {
    if (hasInformalPoliteEnding || hasFormalEnding) {
      return {
        isCorrectRegister: true,
        tip: 'Great job! Your tone is polite, natural, and friendly (존댓말).',
        detectedEnding: hasFormalEnding ? 'Formal Polite' : 'Informal Polite (-요)',
      };
    } else {
      return {
        isCorrectRegister: false,
        tip: 'When speaking with strangers or clerks, make sure to add "-요" (존댓말) to stay polite!',
        detectedEnding: 'Casual (반말)',
      };
    }
  }

  return {
    isCorrectRegister: true,
    tip: 'Well said!',
  };
}
