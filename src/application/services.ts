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
import { defaultSRS } from '@/domain/srs/sm2';
import { contentCatalog } from '@/content/catalog';
import { speechService } from '@/infrastructure/speech/speechService';

export interface AppServices {
  learningRepo: LearningRepository;
  reviewRepo: ReviewRepository;
  progressRepo: ProgressRepository;
  settingsRepo: SettingsRepository;
  srs: typeof defaultSRS;
  catalog: typeof contentCatalog;
  speech: typeof speechService;
}

export function createServices(): AppServices {
  return {
    learningRepo: new LearningStorageRepository(defaultStorageAdapter),
    reviewRepo: new ReviewStorageRepository(defaultStorageAdapter),
    progressRepo: new ProgressStorageRepository(defaultStorageAdapter),
    settingsRepo: new SettingsStorageRepository(defaultStorageAdapter),
    srs: defaultSRS,
    catalog: contentCatalog,
    speech: speechService,
  };
}

export const services = createServices();
