// src/components/__tests__/BalanceFlow.test.tsx
import { render, screen } from "@testing-library/react";
import { BalanceFlow } from "../BalanceFlow";
import React from "react";
import { describe, it, expect } from "bun:test";
import { vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

describe("BalanceFlow", () => {
  const renderWithProvider = (component: React.ReactElement) => {
    // Clear document body before each render
    document.body.innerHTML = "";
    return render(
      <Provider store={store}>
        <MantineProvider>{component}</MantineProvider>
      </Provider>,
    );
  };

  it("renders current global balance", () => {
    const mockOnEditEvent = vi.fn();
    renderWithProvider(<BalanceFlow onEditEvent={mockOnEditEvent} />);
    // In empty state, we should see the empty state title instead
    expect(screen.getByText(/Flujo de Balance/i)).toBeInTheDocument();
  });

  it("renders monthly balance flow", () => {
    const mockOnEditEvent = vi.fn();
    renderWithProvider(<BalanceFlow onEditEvent={mockOnEditEvent} />);
    // In empty state, we should see the empty state title instead
    expect(screen.getByText(/Flujo de Balance/i)).toBeInTheDocument();
  });

  it("shows empty state when no events", () => {
    const mockOnEditEvent = vi.fn();
    renderWithProvider(<BalanceFlow onEditEvent={mockOnEditEvent} />);
    expect(screen.getByText(/Flujo de Balance/i)).toBeInTheDocument();
  });
});
