import { defaultStorageAdapter } from '@/infrastructure/storage/adapter';
import {
  LearningRepository,
  LearningStorageRepository,
} from '@/infrastructure/storage/repositories/learningRepository';
import {
  ReviewRepository,
  ReviewStorageRepository,
} from '@/infrastructure/storage/repositories/reviewRepository';
import {
  ProgressRepository,
  ProgressStorageRepository,
} from '@/infrastructure/storage/repositories/progressRepository';
import {
  SettingsRepository,
  SettingsStorageRepository,
} from '@/infrastructure/storage/repositories/settingsRepository';
import {
  AIChatRepository,
  AIChatStorageRepository,
} from '@/infrastructure/storage/repositories/aiChatRepository';
import { defaultSRS } from '@/domain/srs/sm2';
import { contentCatalog } from '@/content/catalog';
import { speechService } from '@/infrastructure/speech/speechService';
import { voiceRecognitionService } from '@/infrastructure/speech/voiceRecognitionService';
import { aiTutorService } from '@/infrastructure/ai/aiTutorService';
import { aiChatService } from '@/infrastructure/ai/aiChatService';

export interface AppServices {
  learningRepo: LearningRepository;
  reviewRepo: ReviewRepository;
  progressRepo: ProgressRepository;
  settingsRepo: SettingsRepository;
  aiChatRepo: AIChatRepository;
  srs: typeof defaultSRS;
  catalog: typeof contentCatalog;
  speech: typeof speechService;
  voiceRecognition: typeof voiceRecognitionService;
  aiTutor: typeof aiTutorService;
  aiChat: typeof aiChatService;
}

export function createServices(): AppServices {
  return {
    learningRepo: new LearningStorageRepository(defaultStorageAdapter),
    reviewRepo: new ReviewStorageRepository(defaultStorageAdapter),
    progressRepo: new ProgressStorageRepository(defaultStorageAdapter),
    settingsRepo: new SettingsStorageRepository(defaultStorageAdapter),
    aiChatRepo: new AIChatStorageRepository(defaultStorageAdapter),
    srs: defaultSRS,
    catalog: contentCatalog,
    speech: speechService,
    voiceRecognition: voiceRecognitionService,
    aiTutor: aiTutorService,
    aiChat: aiChatService,
  };
}

export const services = createServices();
