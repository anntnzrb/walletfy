import { Effect, Option, pipe } from "effect";
import type { ThemeMode } from "../redux/slices/themeSlice";
import type { Event } from "../types/Event";

const {
	sync,
	flatMap,
	map,
	catchAll,
	succeed,
	try: tryEffect,
	runSync,
} = Effect;

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
			sync(() => JSON.stringify(events)),
			flatMap((data) =>
				sync(() => localStorage.setItem(STORAGE_KEYS.EVENTS, data)),
			),
			catchAll(() =>
				sync(() => console.error("Error saving events to localStorage")),
			),
			runSync,
		);
	},

	loadEvents: (): Event[] => {
		return pipe(
			sync(() => localStorage.getItem(STORAGE_KEYS.EVENTS)),
			map(Option.fromNullable),
			flatMap(
				Option.match({
					onNone: () => succeed([]),
					onSome: (data) => tryEffect(() => parseEvents(data)),
				}),
			),
			catchAll(() => succeed([])),
			runSync,
		);
	},

	saveTheme: (theme: ThemeMode): void => {
		pipe(
			sync(() => localStorage.setItem(STORAGE_KEYS.THEME, theme)),
			catchAll(() =>
				sync(() => console.error("Error saving theme to localStorage")),
			),
			runSync,
		);
	},

	loadTheme: (): ThemeMode => {
		return pipe(
			sync(() => localStorage.getItem(STORAGE_KEYS.THEME)),
			map(Option.fromNullable),
			flatMap(
				Option.match({
					onNone: () => succeed("light" as ThemeMode),
					onSome: (theme) => succeed(isValidTheme(theme) ? theme : "light"),
				}),
			),
			catchAll(() => succeed("light" as ThemeMode)),
			runSync,
		);
	},

	clearAll: (): void => {
		pipe(
			sync(() => {
				localStorage.removeItem(STORAGE_KEYS.EVENTS);
				localStorage.removeItem(STORAGE_KEYS.THEME);
			}),
			catchAll(() => sync(() => console.error("Error clearing localStorage"))),
			runSync,
		);
	},
};
