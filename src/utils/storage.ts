import { Effect, Option, pipe } from "effect";
import type { ThemeMode } from "../redux/slices/themeSlice";
import type { Event } from "../types/Event";

const STORAGE_KEYS = {
	EVENTS: "walletfy_events",
	THEME: "walletfy_theme",
} as const;

const parseEvents = (data: string): Event[] => {
	const events = JSON.parse(data);
	return events.map((event: unknown) => ({
		...(event as Event),
		fecha: new Date((event as Event).fecha),
	}));
};

const isValidTheme = (theme: string): theme is ThemeMode =>
	theme === "light" || theme === "dark";

export const storageUtils = {
	saveEvents: (events: Event[]): void => {
		pipe(
			Effect.sync(() => JSON.stringify(events)),
			Effect.flatMap((data) =>
				Effect.sync(() => localStorage.setItem(STORAGE_KEYS.EVENTS, data)),
			),
			Effect.catchAll(() =>
				Effect.sync(() => console.error("Error saving events to localStorage")),
			),
			Effect.runSync,
		);
	},

	loadEvents: (): Event[] => {
		return pipe(
			Effect.sync(() => localStorage.getItem(STORAGE_KEYS.EVENTS)),
			Effect.map(Option.fromNullable),
			Effect.flatMap(
				Option.match({
					onNone: () => Effect.succeed([]),
					onSome: (data) => Effect.try(() => parseEvents(data)),
				}),
			),
			Effect.catchAll(() => Effect.succeed([])),
			Effect.runSync,
		);
	},

	saveTheme: (theme: ThemeMode): void => {
		pipe(
			Effect.sync(() => localStorage.setItem(STORAGE_KEYS.THEME, theme)),
			Effect.catchAll(() =>
				Effect.sync(() => console.error("Error saving theme to localStorage")),
			),
			Effect.runSync,
		);
	},

	loadTheme: (): ThemeMode => {
		return pipe(
			Effect.sync(() => localStorage.getItem(STORAGE_KEYS.THEME)),
			Effect.map(Option.fromNullable),
			Effect.flatMap(
				Option.match({
					onNone: () => Effect.succeed("light" as ThemeMode),
					onSome: (theme) =>
						Effect.succeed(isValidTheme(theme) ? theme : "light"),
				}),
			),
			Effect.catchAll(() => Effect.succeed("light" as ThemeMode)),
			Effect.runSync,
		);
	},

	clearAll: (): void => {
		pipe(
			Effect.sync(() => {
				localStorage.removeItem(STORAGE_KEYS.EVENTS);
				localStorage.removeItem(STORAGE_KEYS.THEME);
			}),
			Effect.catchAll(() =>
				Effect.sync(() => console.error("Error clearing localStorage")),
			),
			Effect.runSync,
		);
	},
};
