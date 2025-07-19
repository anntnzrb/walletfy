import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "@/redux/slices/eventsSlice";
import themeReducer from "@/redux/slices/themeSlice";
import balanceReducer from "@/redux/slices/balanceSlice";

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    theme: themeReducer,
    balance: balanceReducer,
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
