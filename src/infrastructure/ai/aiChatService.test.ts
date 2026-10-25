import { AIChatService } from './aiChatService';

describe('AIChatService', () => {
  let service: AIChatService;

  beforeEach(() => {
    service = new AIChatService();
  });

  it('handles empty questions gracefully', async () => {
    const response = await service.askTutor([], '   ');
    expect(response.content).toContain('Please ask a question');
    expect(response.provider).toBe('offline');
  });

  it('falls back seamlessly to offline knowledge base when offline', async () => {
    const response = await service.askTutor([], 'What is the difference between 은/는 and 이/가?', {
      provider: 'offline',
    });
    expect(response.content).toContain('Topic (은/는) vs. Subject (이/가)');
    expect(response.provider).toBe('Klearn Offline Knowledge Base');
    expect(response.koreanSnippet).toBeDefined();
  });

  it('extracts Korean snippets for audio pronunciation', async () => {
    const response = await service.askTutor([], 'Tell me about cafe ordering', {
      provider: 'offline',
    });
    expect(response.koreanSnippet).toContain('아메리카노');
  });
});
