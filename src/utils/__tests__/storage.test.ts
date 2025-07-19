import { describe, it, expect, beforeEach, vi } from "bun:test";
import { storageUtils } from "../storage";
import type { Event } from "@/types/Event";

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

// Only set localStorage if it's not already defined
if (!globalThis.localStorage) {
  Object.defineProperty(globalThis, "localStorage", {
    value: mockLocalStorage,
  });
}

describe("storageUtils", () => {
  const mockEvents: any[] = [
    {
      id: "1",
      nombre: "Test Event",
      cantidad: 100,
      fecha: "2024-01-01T00:00:00.000Z",
      tipo: "ingreso",
    },
  ];

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("saveEvents", () => {
    it("should save events to localStorage", () => {
      storageUtils.saveEvents(mockEvents as Event[]);

      const savedData = localStorage.getItem("walletfy_events");
      expect(savedData).not.toBeNull();

      const parsedData = JSON.parse(savedData!);
      expect(parsedData).toEqual(mockEvents);
    });
  });

  describe("loadEvents", () => {
    it("should load events from localStorage", () => {
      localStorage.setItem("walletfy_events", JSON.stringify(mockEvents));

      const result = storageUtils.loadEvents();
      // Convert dates back to strings for comparison
      const resultWithStringDates = result.map((event) => ({
        ...event,
        fecha:
          event.fecha instanceof Date ? event.fecha.toISOString() : event.fecha,
      }));
      expect(resultWithStringDates).toEqual(mockEvents);
    });

    it("should return empty array when no events are stored", () => {
      const result = storageUtils.loadEvents();
      expect(result).toEqual([]);
    });

    it("should return empty array when stored data is invalid", () => {
      localStorage.setItem("walletfy_events", "invalid json");

      const result = storageUtils.loadEvents();
      expect(result).toEqual([]);
    });
  });

  describe("saveTheme", () => {
    it("should save theme to localStorage", () => {
      storageUtils.saveTheme("dark");

      const savedData = localStorage.getItem("walletfy_theme");
      expect(savedData).toBe('"dark"');
    });
  });

  describe("loadTheme", () => {
    it("should load theme from localStorage", () => {
      localStorage.setItem("walletfy_theme", '"dark"');

      const result = storageUtils.loadTheme();
      expect(result).toBe("dark");
    });

    it("should return light theme when no theme is stored", () => {
      const result = storageUtils.loadTheme();
      expect(result).toBe("light");
    });

    it("should return light theme when stored data is invalid", () => {
      localStorage.setItem("walletfy_theme", '"invalid-theme"');

      const result = storageUtils.loadTheme();
      expect(result).toBe("light");
    });
  });

  describe("saveInitialBalance", () => {
    it("should save initial balance to localStorage", () => {
      storageUtils.saveInitialBalance(1000);

      const savedData = localStorage.getItem("walletfy_initial_balance");
      expect(savedData).toBe("1000");
    });
  });

  describe("loadInitialBalance", () => {
    it("should load initial balance from localStorage", () => {
      localStorage.setItem("walletfy_initial_balance", "1000");

      const result = storageUtils.loadInitialBalance();
      expect(result).toBe(1000);
    });

    it("should return zero when no balance is stored", () => {
      const result = storageUtils.loadInitialBalance();
      expect(result).toBe(0);
    });

    it("should return zero when stored data is invalid", () => {
      localStorage.setItem("walletfy_initial_balance", "invalid");

      const result = storageUtils.loadInitialBalance();
      expect(result).toBe(0);
    });
  });

  describe("clearAll", () => {
    it("should clear all walletfy data from localStorage", () => {
      // Set up some test data using direct localStorage operations to avoid any caching issues
      localStorage.setItem("walletfy_events", "[]");
      localStorage.setItem("walletfy_theme", '"dark"');
      localStorage.setItem("walletfy_initial_balance", "1000");
      localStorage.setItem("other_key", "other_value");

      // Verify data is set
      expect(localStorage.getItem("walletfy_events")).toBe("[]");
      expect(localStorage.getItem("walletfy_theme")).toBe('"dark"');
      expect(localStorage.getItem("walletfy_initial_balance")).toBe("1000");
      expect(localStorage.getItem("other_key")).toBe("other_value");

      storageUtils.clearAll();

      // Check that walletfy data is cleared but other data remains
      expect(localStorage.getItem("walletfy_events")).toBeNull();
      expect(localStorage.getItem("walletfy_theme")).toBeNull();
      expect(localStorage.getItem("walletfy_initial_balance")).toBeNull();
      expect(localStorage.getItem("other_key")).toBe("other_value");
    });
  });
});
