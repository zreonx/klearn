export interface StorageEnvelope<T> {
  version: number;
  data: T;
  updatedAt: string;
}

export function wrapInEnvelope<T>(data: T, version = 1): StorageEnvelope<T> {
  return {
    version,
    data,
    updatedAt: new Date().toISOString(),
  };
}

export function unwrapEnvelope<T>(envelope: StorageEnvelope<T>): T {
  return envelope.data;
}
