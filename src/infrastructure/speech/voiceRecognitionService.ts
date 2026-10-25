import { Platform } from 'react-native';
import { logger } from '@/lib/logger';

export interface VoiceRecognitionOptions {
  onInterim?: (text: string) => void;
  apiKey?: string;
  language?: string; // Default 'ko-KR'
}

export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence?: number;
}

/**
 * Safely access native expo-av without breaking Web bundles or crashing when
 * ExponentAV native module is unavailable.
 */
function getNativeAudio(): any {
  if (Platform.OS === 'web') return null;
  try {
    const expoAv = require('expo-av');
    return expoAv ? expoAv.Audio : null;
  } catch (err) {
    logger.warn('expo-av is not available in current environment:', err);
    return null;
  }
}

export class VoiceRecognitionService {
  private recording: any = null;
  private webRecognition: any = null;
  private webMediaRecorder: any = null;
  private webAudioChunks: any[] = [];
  private isCurrentlyListening = false;
  private currentTranscript = '';
  private onInterimCallback: ((text: string) => void) | null = null;

  /**
   * Checks if either Web Speech API or audio recording is supported.
   */
  isSupported(): boolean {
    if (Platform.OS === 'web') {
      const hasWebSpeech =
        typeof window !== 'undefined' &&
        (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));
      const hasMedia = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
      return hasWebSpeech || hasMedia;
    }
    return !!getNativeAudio();
  }

  isListening(): boolean {
    return this.isCurrentlyListening;
  }

  /**
   * Starts capturing voice input.
   * On Web with SpeechRecognition, uses browser native STT.
   * On Web without SpeechRecognition, uses browser MediaRecorder.
   * On Mobile, starts recording audio with native expo-av.
   */
  async startListening(options: VoiceRecognitionOptions = {}): Promise<boolean> {
    if (this.isCurrentlyListening) {
      await this.cancelListening();
    }

    this.currentTranscript = '';
    this.onInterimCallback = options.onInterim || null;

    // 1. Web Speech Recognition (Google Chrome, Microsoft Edge, Safari)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.lang = options.language || 'ko-KR';
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: any) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const res = event.results[i];
              if (res.isFinal) {
                this.currentTranscript = res[0].transcript;
              } else {
                interim += res[0].transcript;
              }
            }
            if (this.onInterimCallback) {
              this.onInterimCallback(this.currentTranscript || interim);
            }
          };

          recognition.onerror = (event: any) => {
            logger.warn('Web Speech recognition error:', event.error);
            this.isCurrentlyListening = false;
          };

          recognition.onend = () => {
            this.isCurrentlyListening = false;
          };

          recognition.start();
          this.webRecognition = recognition;
          this.isCurrentlyListening = true;
          return true;
        } catch (err) {
          logger.warn('Web Speech recognition start failed, trying Web MediaRecorder:', err);
        }
      }

      // Web MediaRecorder fallback
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const MediaRecorderConstructor = (window as any).MediaRecorder;
          if (MediaRecorderConstructor) {
            this.webAudioChunks = [];
            const recorder = new MediaRecorderConstructor(stream);
            recorder.ondataavailable = (e: any) => {
              if (e.data && e.data.size > 0) {
                this.webAudioChunks.push(e.data);
              }
            };
            recorder.start();
            this.webMediaRecorder = recorder;
            this.isCurrentlyListening = true;
            return true;
          }
        } catch (err) {
          logger.warn('Web MediaRecorder start failed:', err);
          return false;
        }
      }

      return false;
    }

    // 2. Native audio recording via expo-av
    const Audio = getNativeAudio();
    if (!Audio) {
      logger.warn('Native audio recording module is not available');
      return false;
    }

    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        logger.warn('Audio recording permission denied');
        return false;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();

      this.recording = recording;
      this.isCurrentlyListening = true;
      return true;
    } catch (err) {
      logger.error('Failed to start native audio recording:', err);
      this.isCurrentlyListening = false;
      return false;
    }
  }

  /**
   * Stops listening and returns the transcribed Korean text.
   */
  async stopListening(apiKey?: string): Promise<string> {
    if (!this.isCurrentlyListening) {
      return this.currentTranscript;
    }

    this.isCurrentlyListening = false;

    // 1. If Web Speech Recognition was active
    if (this.webRecognition) {
      try {
        this.webRecognition.stop();
      } catch {
        // Ignore
      }
      this.webRecognition = null;
      return this.currentTranscript.trim();
    }

    // 2. If Web MediaRecorder was active
    if (this.webMediaRecorder) {
      try {
        const recorder = this.webMediaRecorder;
        this.webMediaRecorder = null;
        const blob = await new Promise<Blob>((resolve) => {
          recorder.onstop = () => {
            const audioBlob = new Blob(this.webAudioChunks, { type: 'audio/webm' });
            resolve(audioBlob);
          };
          recorder.stop();
        });

        const effectiveKey = apiKey || process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
        if (effectiveKey) {
          return await this.transcribeBlobWithGroqWhisper(blob, effectiveKey);
        }
        return '';
      } catch (err) {
        logger.error('Failed to stop web media recorder:', err);
        return '';
      }
    }

    // 3. If native expo-av recording was active
    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();
        this.recording = null;

        if (!uri) {
          return '';
        }

        const effectiveKey =
          apiKey ||
          process.env.EXPO_PUBLIC_GROQ_API_KEY ||
          '';

        if (effectiveKey) {
          return await this.transcribeUriWithGroqWhisper(uri, effectiveKey);
        } else {
          logger.warn('No Groq API key available for Whisper audio transcription.');
          return '';
        }
      } catch (err) {
        logger.error('Failed to stop and transcribe native audio:', err);
        this.recording = null;
        return '';
      }
    }

    return '';
  }

  /**
   * Cancels listening without returning transcription.
   */
  async cancelListening(): Promise<void> {
    this.isCurrentlyListening = false;
    this.currentTranscript = '';

    if (this.webRecognition) {
      try {
        this.webRecognition.abort();
      } catch {
        // Ignore
      }
      this.webRecognition = null;
    }

    if (this.webMediaRecorder) {
      try {
        this.webMediaRecorder.stop();
      } catch {
        // Ignore
      }
      this.webMediaRecorder = null;
    }

    if (this.recording) {
      try {
        await this.recording.stopAndUnloadAsync();
      } catch {
        // Ignore
      }
      this.recording = null;
    }
  }

  private async transcribeBlobWithGroqWhisper(blob: Blob, apiKey: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');
      formData.append('model', 'whisper-large-v3-turbo');
      formData.append('language', 'ko');
      formData.append('response_format', 'json');

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        logger.warn('Groq Whisper API returned non-OK status:', response.status);
        return '';
      }

      const data = await response.json();
      return (data.text || '').trim();
    } catch (err) {
      logger.error('Failed to transcribe blob with Groq Whisper:', err);
      return '';
    }
  }

  private async transcribeUriWithGroqWhisper(uri: string, apiKey: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);
      formData.append('model', 'whisper-large-v3-turbo');
      formData.append('language', 'ko');
      formData.append('response_format', 'json');

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        logger.warn('Groq Whisper API returned non-OK status:', response.status);
        return '';
      }

      const data = await response.json();
      return (data.text || '').trim();
    } catch (err) {
      logger.error('Failed to transcribe uri with Groq Whisper:', err);
      return '';
    }
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();
