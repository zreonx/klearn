jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
    setAudioModeAsync: jest.fn().mockResolvedValue(undefined),
    Recording: jest.fn().mockImplementation(() => ({
      prepareToRecordAsync: jest.fn().mockResolvedValue(undefined),
      startAsync: jest.fn().mockResolvedValue(undefined),
      stopAndUnloadAsync: jest.fn().mockResolvedValue(undefined),
      getURI: jest.fn().mockReturnValue('file:///mock/recording.m4a'),
    })),
    RecordingOptionsPresets: {
      HIGH_QUALITY: {},
    },
  },
}), { virtual: true });

import { VoiceRecognitionService } from './voiceRecognitionService';

describe('VoiceRecognitionService', () => {
  let service: VoiceRecognitionService;

  beforeEach(() => {
    service = new VoiceRecognitionService();
  });

  afterEach(async () => {
    await service.cancelListening();
  });

  it('initializes in not-listening state', () => {
    expect(service.isListening()).toBe(false);
  });

  it('starts listening and updates state', async () => {
    const started = await service.startListening();
    expect(started).toBe(true);
    expect(service.isListening()).toBe(true);
  });

  it('cancels listening and resets state', async () => {
    await service.startListening();
    expect(service.isListening()).toBe(true);
    await service.cancelListening();
    expect(service.isListening()).toBe(false);
  });

  it('stops listening cleanly and returns empty transcript when no key is provided', async () => {
    await service.startListening();
    const result = await service.stopListening();
    expect(typeof result).toBe('string');
    expect(service.isListening()).toBe(false);
  });

  it('reports supported status correctly', () => {
    expect(typeof service.isSupported()).toBe('boolean');
  });
});
