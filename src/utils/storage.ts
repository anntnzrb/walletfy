import { Effect, Option, pipe } from "effect";
import { mockEvents } from "../data/mockEvents";
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

const { fromNullable, match } = Option;

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
			map(fromNullable),
			flatMap(
				match({
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
			map(fromNullable),
			flatMap(
				match({
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

	loadMockData: (): Event[] => {
		return pipe(
			sync(() => localStorage.getItem(STORAGE_KEYS.EVENTS)),
			map(fromNullable),
			flatMap(
				match({
					onNone: () => succeed(mockEvents),
					onSome: (data) =>
						tryEffect(() => {
							const existingEvents = parseEvents(data);
							const existingIds = new Set(existingEvents.map((e) => e.id));
							const newMockEvents = mockEvents.filter(
								(e) => !existingIds.has(e.id),
							);
							return [...existingEvents, ...newMockEvents];
						}),
				}),
			),
			flatMap((mergedEvents) =>
				sync(() => {
					localStorage.setItem(
						STORAGE_KEYS.EVENTS,
						JSON.stringify(mergedEvents),
					);
					return mergedEvents;
				}),
			),
			catchAll(() => succeed(mockEvents)),
			runSync,
		);
	},

	removeMockData: (): Event[] => {
		const mockIds = new Set(mockEvents.map((e) => e.id));
		return pipe(
			sync(() => localStorage.getItem(STORAGE_KEYS.EVENTS)),
			map(fromNullable),
			flatMap(
				match({
					onNone: () => succeed([]),
					onSome: (data) => tryEffect(() => parseEvents(data)),
				}),
			),
			flatMap((existingEvents) =>
				sync(() => {
					const filteredEvents = existingEvents.filter(
						(e) => !mockIds.has(e.id),
					);
					localStorage.setItem(
						STORAGE_KEYS.EVENTS,
						JSON.stringify(filteredEvents),
					);
					return filteredEvents;
				}),
			),
			catchAll(() => succeed([])),
			runSync,
		);
	},
};
