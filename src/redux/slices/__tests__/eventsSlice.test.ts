import { describe, it, expect } from "bun:test";
import eventsReducer, {
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../eventsSlice";
import type { Event } from "@/types/Event";

// Mock crypto.randomUUID
global.crypto = {
  ...global.crypto,
  randomUUID: () => "test-uuid-123",
};

describe("eventsSlice", () => {
  const initialState = {
    events: [],
  };

  const mockEvent: Event = {
    id: "1",
    nombre: "Test Event",
    descripcion: "Test description",
    cantidad: 100,
    fecha: new Date("2024-01-15"),
    tipo: "ingreso",
    adjunto: undefined,
  };

  const mockEvents: Event[] = [
    mockEvent,
    {
      id: "2",
      nombre: "Test Event 2",
      descripcion: "Test description 2",
      cantidad: 200,
      fecha: new Date("2024-01-20"),
      tipo: "egreso",
      adjunto: undefined,
    },
  ];

  describe("setEvents", () => {
    it("should set events correctly", () => {
      const action = setEvents(mockEvents);
      const newState = eventsReducer(initialState, action);

      expect(newState.events).toEqual(mockEvents);
    });

    it("should replace existing events", () => {
      const stateWithEvents = { events: [mockEvent] };
      const newEvents = [mockEvents[1]];

      const action = setEvents(newEvents);
      const newState = eventsReducer(stateWithEvents, action);

      expect(newState.events).toEqual(newEvents);
    });
  });

  describe("addEvent", () => {
    it("should add new event with generated ID", () => {
      const eventData = {
        nombre: "New Event",
        descripcion: "New description",
        cantidad: 150,
        fecha: new Date("2024-01-25"),
        tipo: "ingreso" as const,
        adjunto: undefined,
      };

      const action = addEvent(eventData);
      const newState = eventsReducer(initialState, action);

      expect(newState.events).toHaveLength(1);
      expect(newState.events[0]).toEqual({
        ...eventData,
        id: "test-uuid-123",
      });
    });

    it("should add event to existing events", () => {
      const stateWithEvents = { events: [mockEvent] };
      const eventData = {
        nombre: "Another Event",
        descripcion: "Another description",
        cantidad: 250,
        fecha: new Date("2024-01-30"),
        tipo: "egreso" as const,
        adjunto: undefined,
      };

      const action = addEvent(eventData);
      const newState = eventsReducer(stateWithEvents, action);

      expect(newState.events).toHaveLength(2);
      expect(newState.events[1]).toEqual({
        ...eventData,
        id: "test-uuid-123",
      });
    });
  });

  describe("updateEvent", () => {
    it("should update existing event", () => {
      const stateWithEvents = { events: mockEvents };
      const updatedEvent = {
        ...mockEvent,
        nombre: "Updated Event",
        cantidad: 300,
      };

      const action = updateEvent(updatedEvent);
      const newState = eventsReducer(stateWithEvents, action);

      expect(newState.events[0]).toEqual(updatedEvent);
      expect(newState.events[1]).toEqual(mockEvents[1]); // Other event unchanged
    });

    it("should not modify state if event not found", () => {
      const stateWithEvents = { events: mockEvents };
      const nonExistentEvent = {
        id: "non-existent",
        nombre: "Non-existent Event",
        descripcion: "Description",
        cantidad: 100,
        fecha: new Date(),
        tipo: "ingreso" as const,
        adjunto: undefined,
      };

      const action = updateEvent(nonExistentEvent);
      const newState = eventsReducer(stateWithEvents, action);

      expect(newState.events).toEqual(mockEvents);
    });
  });

  describe("deleteEvent", () => {
    it("should delete event by ID", () => {
      const stateWithEvents = { events: mockEvents };
      const action = deleteEvent("1");
      const newState = eventsReducer(stateWithEvents, action);

      expect(newState.events).toHaveLength(1);
      expect(newState.events[0]).toEqual(mockEvents[1]);
    });

    it("should not modify state if event not found", () => {
      const stateWithEvents = { events: mockEvents };
      const action = deleteEvent("non-existent");
      const newState = eventsReducer(stateWithEvents, action);

      expect(newState.events).toEqual(mockEvents);
    });
  });
});
