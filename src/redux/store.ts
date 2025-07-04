import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./slices/eventsSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
	reducer: {
		events: eventsReducer,
		theme: themeReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredPaths: ["events.events"],
				ignoredActionsPaths: ["payload"],
			},
		}),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
