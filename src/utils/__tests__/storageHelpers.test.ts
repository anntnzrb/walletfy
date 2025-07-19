import { describe, it, expect, beforeEach, vi } from "bun:test";
import { storageHelpers } from "../storageHelpers";
import { Effect } from "effect";

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
});

describe("storageHelpers", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("save and load", () => {
    it("should save and load data correctly", async () => {
      const testData = { name: "John", age: 30 };
      const key = "test_key";

      // Save data
      const saveEffect = storageHelpers.save(key, testData);
      await Effect.runPromise(saveEffect);

      // Load data
      const loadEffect = storageHelpers.load(key, { name: "", age: 0 });
      const result = await Effect.runPromise(loadEffect);

      expect(result).toEqual(testData);
    });

    it("should return default value when key doesn't exist", async () => {
      const defaultValue = { name: "Default", age: 25 };
      const key = "non_existent_key";

      const loadEffect = storageHelpers.load(key, defaultValue);
      const result = await Effect.runPromise(loadEffect);

      expect(result).toEqual(defaultValue);
    });

    it("should return default value when stored data is invalid", async () => {
      const key = "invalid_key";
      const defaultValue = { name: "Default", age: 25 };

      // Store invalid JSON
      localStorage.setItem(key, "invalid json");

      const loadEffect = storageHelpers.load(key, defaultValue);
      const result = await Effect.runPromise(loadEffect);

      expect(result).toEqual(defaultValue);
    });
  });

  describe("remove", () => {
    it("should remove item from localStorage", async () => {
      const key = "test_key";
      localStorage.setItem(key, JSON.stringify({ name: "John" }));

      const removeEffect = storageHelpers.remove(key);
      await Effect.runPromise(removeEffect);

      expect(localStorage.getItem(key)).toBeNull();
    });
  });

  describe("exists", () => {
    it("should return true when key exists", async () => {
      const key = "test_key";
      localStorage.setItem(key, JSON.stringify({ name: "John" }));

      const existsEffect = storageHelpers.exists(key);
      const result = await Effect.runPromise(existsEffect);

      expect(result).toBe(true);
    });

    it("should return false when key doesn't exist", async () => {
      const key = "non_existent_key";

      const existsEffect = storageHelpers.exists(key);
      const result = await Effect.runPromise(existsEffect);

      expect(result).toBe(false);
    });
  });

  describe("createTypedStorage", () => {
    it("should create typed storage accessor", () => {
      const key = "typed_key";
      const defaultValue = { name: "Default", age: 25 };

      const typedStorage = storageHelpers.createTypedStorage(key, defaultValue);

      // Test save and load
      typedStorage.saveSync({ name: "John", age: 30 });
      const result = typedStorage.loadSync();

      expect(result).toEqual({ name: "John", age: 30 });
    });
  });
});
