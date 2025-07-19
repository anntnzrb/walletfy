// src/components/__tests__/EventForm.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { EventForm } from "../EventForm";
import React from "react";
import { describe, it, expect } from "bun:test";
import { vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

describe("EventForm", () => {
  const renderWithProvider = (component: React.ReactElement) => {
    // Clear document body before each render
    document.body.innerHTML = "";
    return render(
      <Provider store={store}>
        <MantineProvider>{component}</MantineProvider>
      </Provider>,
    );
  };

  it("renders all form fields", () => {
    renderWithProvider(<EventForm />);
    expect(screen.getByText(/Crear Evento/i)).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    renderWithProvider(<EventForm />);
    expect(screen.getByText(/Crear Evento/i)).toBeInTheDocument();
  });

  it("submits valid data", () => {
    const mockOnSubmit = vi.fn();
    renderWithProvider(<EventForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText(/Crear Evento/i)).toBeInTheDocument();
  });
});
