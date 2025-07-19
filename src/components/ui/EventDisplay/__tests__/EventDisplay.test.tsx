// src/components/ui/EventDisplay/__tests__/EventDisplay.test.tsx
import { describe, it, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { EventDisplay } from "../EventDisplay";
import React from "react";
import { vi } from "vitest";

const mockEvent = {
  id: "1",
  nombre: "Test Event",
  descripcion: "Description",
  cantidad: 100,
  fecha: new Date("2024-01-01"),
  tipo: "ingreso" as const,
  adjunto: undefined,
};

describe("EventDisplay compound component", () => {
  it("provides context to children", () => {
    render(
      <EventDisplay.Root event={mockEvent}>
        <div>Child</div>
      </EventDisplay.Root>,
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("throws error if useEventDisplayContext is used outside provider", () => {
    // Suppress error output for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    function BadComponent() {
      // @ts-expect-error
      const ctx = require("../EventDisplay").useEventDisplayContext();
      return <div>{ctx}</div>;
    }
    expect(() => render(<BadComponent />)).toThrow();
    spy.mockRestore();
  });
});
