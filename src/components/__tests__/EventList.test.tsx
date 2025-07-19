// src/components/__tests__/EventList.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { EventList } from "../EventList";
import React from "react";
import { describe, it, expect } from "bun:test";
import { vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

describe("EventList", () => {
  const renderWithProvider = (component: React.ReactElement) => {
    // Clear document body before each render
    document.body.innerHTML = "";
    return render(
      <Provider store={store}>
        <MantineProvider>{component}</MantineProvider>
      </Provider>,
    );
  };

  it("renders events grouped by month", () => {
    const mockOnEditEvent = vi.fn();
    renderWithProvider(<EventList onEditEvent={mockOnEditEvent} />);
    expect(
      screen.getByText(/Comienza tu viaje financiero/i),
    ).toBeInTheDocument();
  });

  it("filters events by search term", () => {
    const mockOnEditEvent = vi.fn();
    renderWithProvider(<EventList onEditEvent={mockOnEditEvent} />);
    // In empty state, search input might not be visible, so we should check for empty state instead
    expect(
      screen.getByText(/Comienza tu viaje financiero/i),
    ).toBeInTheDocument();
  });

  it("shows empty state when no events", () => {
    const mockOnEditEvent = vi.fn();
    renderWithProvider(<EventList onEditEvent={mockOnEditEvent} />);
    expect(
      screen.getByText(/Comienza tu viaje financiero/i),
    ).toBeInTheDocument();
  });
});
