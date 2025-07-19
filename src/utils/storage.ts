import type { ThemeMode } from "@/redux/slices/themeSlice";
import type { Event } from "@/types/Event";
import { storageHelpers } from "./storageHelpers";

const STORAGE_KEYS = {
  EVENTS: "walletfy_events",
  THEME: "walletfy_theme",
  INITIAL_BALANCE: "walletfy_initial_balance",
} as const;

const parseEvents = (data: string): Event[] => {
  const events = JSON.parse(data);
  return events.map((event: unknown) => ({
    ...(event as Event),
    fecha: (event as Event).fecha,
  }));
};

const isValidTheme = (theme: unknown): theme is ThemeMode =>
  typeof theme === "string" && (theme === "light" || theme === "dark");

const eventsStorage = storageHelpers.createTypedStorage<Event[]>(
  STORAGE_KEYS.EVENTS,
  [],
);
const themeStorage = storageHelpers.createTypedStorage<ThemeMode>(
  STORAGE_KEYS.THEME,
  "light",
);
const balanceStorage = storageHelpers.createTypedStorage<number>(
  STORAGE_KEYS.INITIAL_BALANCE,
  0,
);

export const storageUtils = {
  saveEvents: (events: Event[]): void => {
    eventsStorage.saveSync(events);
  },

  loadEvents: (): Event[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? parseEvents(data) : [];
    } catch {
      return [];
    }
  },

  saveTheme: (theme: ThemeMode): void => {
    themeStorage.saveSync(theme);
  },

  loadTheme: (): ThemeMode => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.THEME);
      const theme = data ? JSON.parse(data) : "light";
      return isValidTheme(theme) ? theme : "light";
    } catch {
      return "light";
    }
  },

  saveInitialBalance: (balance: number): void => {
    balanceStorage.saveSync(balance);
  },

  loadInitialBalance: (): number => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INITIAL_BALANCE);
      return data ? parseFloat(data) || 0 : 0;
    } catch {
      return 0;
    }
  },

  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.THEME);
    localStorage.removeItem(STORAGE_KEYS.INITIAL_BALANCE);
  },

  getStorageSize: () => {
    return JSON.stringify(localStorage).length;
  },

  backup: () => ({
    events: storageUtils.loadEvents(),
    theme: storageUtils.loadTheme(),
    initialBalance: storageUtils.loadInitialBalance(),
  }),

  restore: (backup: {
    events: Event[];
    theme: ThemeMode;
    initialBalance: number;
  }) => {
    storageUtils.saveEvents(backup.events);
    storageUtils.saveTheme(backup.theme);
    storageUtils.saveInitialBalance(backup.initialBalance);
  },
};
