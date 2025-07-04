import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "@/redux/slices/eventsSlice";
import themeReducer from "@/redux/slices/themeSlice";

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
