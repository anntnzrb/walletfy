import { Effect, Option, pipe } from "effect";

const {
  sync,
  flatMap,
  map,
  catchAll,
  succeed,
  try: tryEffect,
  runSync,
} = Effect;

const { fromNullable, match } = Option;

/**
 * Generic storage helpers using Effect-ts patterns
 * Provides type-safe and composable localStorage operations
 */
export const storageHelpers = {
  save: <T>(key: string, data: T): Effect.Effect<void, Error> =>
    pipe(
      sync(() => JSON.stringify(data)),
      flatMap((serialized) =>
        sync(() => localStorage.setItem(key, serialized)),
      ),
      catchAll((error) =>
        sync(() =>
          console.error(`Error saving ${key} to localStorage:`, error),
        ),
      ),
    ),

  /**
   * Generic load operation with fallback
   */
  load: <T>(key: string, defaultValue: T): Effect.Effect<T, never> =>
    pipe(
      sync(() => localStorage.getItem(key)),
      map(fromNullable),
      flatMap(
        match({
          onNone: () => succeed(defaultValue),
          onSome: (data) => tryEffect(() => JSON.parse(data) as T),
        }),
      ),
      catchAll(() => succeed(defaultValue)),
    ),

  /**
   * Load with custom parser
   */
  loadWithParser: <T>(
    key: string,
    parser: (data: string) => T,
    defaultValue: T,
  ): Effect.Effect<T, never> =>
    pipe(
      sync(() => localStorage.getItem(key)),
      map(fromNullable),
      flatMap(
        match({
          onNone: () => succeed(defaultValue),
          onSome: (data) => tryEffect(() => parser(data)),
        }),
      ),
      catchAll(() => succeed(defaultValue)),
    ),

  /**
   * Load with validation
   */
  loadWithValidation: <T>(
    key: string,
    validator: (data: unknown) => data is T,
    defaultValue: T,
  ): Effect.Effect<T, never> =>
    pipe(
      sync(() => localStorage.getItem(key)),
      map(fromNullable),
      flatMap(
        match({
          onNone: () => succeed(defaultValue),
          onSome: (data) =>
            tryEffect(() => {
              const parsed = JSON.parse(data);
              return validator(parsed) ? parsed : defaultValue;
            }),
        }),
      ),
      catchAll(() => succeed(defaultValue)),
    ),

  /**
   * Remove item from storage
   */
  remove: (key: string): Effect.Effect<void, Error> =>
    pipe(
      sync(() => localStorage.removeItem(key)),
      catchAll((error) =>
        sync(() =>
          console.error(`Error removing ${key} from localStorage:`, error),
        ),
      ),
    ),

  /**
   * Check if key exists in storage
   */
  exists: (key: string): Effect.Effect<boolean, never> =>
    pipe(
      sync(() => localStorage.getItem(key)),
      map(fromNullable),
      map(Option.isSome),
      catchAll(() => succeed(false)),
    ),

  /**
   * Get all keys with prefix
   */
  getKeysWithPrefix: (prefix: string): Effect.Effect<string[], never> =>
    pipe(
      sync(() => Object.keys(localStorage)),
      map((keys) => keys.filter((key) => key.startsWith(prefix))),
      catchAll(() => succeed([])),
    ),

  /**
   * Clear all keys with prefix
   */
  clearWithPrefix: (prefix: string): Effect.Effect<void, never> =>
    pipe(
      storageHelpers.getKeysWithPrefix(prefix),
      flatMap((keys) =>
        sync(() => {
          keys.forEach((key) => localStorage.removeItem(key));
        }),
      ),
      catchAll(() =>
        sync(() => console.error(`Error clearing keys with prefix ${prefix}`)),
      ),
    ),

  /**
   * Batch save operations
   */
  saveBatch: <T>(
    operations: Array<{ key: string; data: T }>,
  ): Effect.Effect<void, never> =>
    pipe(
      sync(() => {
        operations.forEach(({ key, data }) => {
          try {
            localStorage.setItem(key, JSON.stringify(data));
          } catch (error) {
            console.error(`Error saving ${key}:`, error);
          }
        });
      }),
      catchAll(() =>
        sync(() => console.error("Error in batch save operation")),
      ),
    ),

  /**
   * Get storage size for a key
   */
  getSize: (key: string): Effect.Effect<number, never> =>
    pipe(
      sync(() => localStorage.getItem(key)),
      map(fromNullable),
      map(
        match({
          onNone: () => 0,
          onSome: (data) => new Blob([data]).size,
        }),
      ),
      catchAll(() => succeed(0)),
    ),

  /**
   * Get total storage usage
   */
  getTotalUsage: (): Effect.Effect<number, never> =>
    pipe(
      sync(() => {
        let total = 0;
        for (const key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            total += localStorage.getItem(key)?.length || 0;
          }
        }
        return total;
      }),
      catchAll(() => succeed(0)),
    ),

  /**
   * Sync save (for compatibility)
   */
  saveSync: <T>(key: string, data: T): void => {
    runSync(storageHelpers.save(key, data));
  },

  /**
   * Sync load (for compatibility)
   */
  loadSync: <T>(key: string, defaultValue: T): T => {
    return runSync(storageHelpers.load(key, defaultValue));
  },

  /**
   * Sync remove (for compatibility)
   */
  removeSync: (key: string): void => {
    runSync(storageHelpers.remove(key));
  },

  /**
   * Create a typed storage accessor
   */
  createTypedStorage: <T>(key: string, defaultValue: T) => ({
    save: (data: T) => storageHelpers.save(key, data),
    load: () => storageHelpers.load(key, defaultValue),
    saveSync: (data: T) => storageHelpers.saveSync(key, data),
    loadSync: () => storageHelpers.loadSync(key, defaultValue),
    remove: () => storageHelpers.remove(key),
    removeSync: () => storageHelpers.removeSync(key),
    exists: () => storageHelpers.exists(key),
    getSize: () => storageHelpers.getSize(key),
  }),

  /**
   * Migration helper for storage schema changes
   */
  migrateStorage: <T, U>(
    key: string,
    migrator: (oldData: T) => U,
    defaultValue: U,
  ): Effect.Effect<U, never> =>
    pipe(
      storageHelpers.load(key, defaultValue),
      flatMap((data) => tryEffect(() => migrator(data as unknown as T))),
      flatMap((migratedData) =>
        pipe(
          storageHelpers.save(key, migratedData),
          map(() => migratedData),
        ),
      ),
      catchAll(() => succeed(defaultValue)),
    ),
};
