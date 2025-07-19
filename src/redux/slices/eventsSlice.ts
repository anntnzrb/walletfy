import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Event } from "@/types/Event";

interface EventsState {
  events: Event[];
}

const initialState: EventsState = {
  events: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<Omit<Event, "id">>) => {
      const newEvent: Event = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      state.events.push(newEvent);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id,
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload,
      );
    },
  },
});

export const { setEvents, addEvent, updateEvent, deleteEvent } =
  eventsSlice.actions;
export default eventsSlice.reducer;
