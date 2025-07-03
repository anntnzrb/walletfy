import type { ThemeMode } from "../redux/slices/themeSlice";
import type { Event } from "../types/Event";

const STORAGE_KEYS = {
	EVENTS: "walletfy_events",
	THEME: "walletfy_theme",
} as const;

export const storageUtils = {
	// Events storage
	saveEvents: (events: Event[]): void => {
		try {
			const serializedEvents = JSON.stringify(events);
			localStorage.setItem(STORAGE_KEYS.EVENTS, serializedEvents);
		} catch (error) {
			console.error("Error saving events to localStorage:", error);
		}
	},

	loadEvents: (): Event[] => {
		try {
			const serializedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
			if (serializedEvents === null) {
				return [];
			}
			const events = JSON.parse(serializedEvents);
			// Convert fecha strings back to Date objects
			return events.map((event: unknown) => ({
				...(event as Event),
				fecha: new Date((event as Event).fecha),
			}));
		} catch (error) {
			console.error("Error loading events from localStorage:", error);
			return [];
		}
	},

	// Theme storage
	saveTheme: (theme: ThemeMode): void => {
		try {
			localStorage.setItem(STORAGE_KEYS.THEME, theme);
		} catch (error) {
			console.error("Error saving theme to localStorage:", error);
		}
	},

	loadTheme: (): ThemeMode => {
		try {
			const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
			if (savedTheme === "light" || savedTheme === "dark") {
				return savedTheme;
			}
			return "light";
		} catch (error) {
			console.error("Error loading theme from localStorage:", error);
			return "light";
		}
	},

	// Clear all data
	clearAll: (): void => {
		try {
			localStorage.removeItem(STORAGE_KEYS.EVENTS);
			localStorage.removeItem(STORAGE_KEYS.THEME);
		} catch (error) {
			console.error("Error clearing localStorage:", error);
		}
	},
};
