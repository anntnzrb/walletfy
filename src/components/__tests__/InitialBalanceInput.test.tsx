// src/components/__tests__/InitialBalanceInput.test.tsx
import { describe, it, expect } from "bun:test";
import { render, screen, fireEvent } from "@testing-library/react";
import { InitialBalanceInput } from "../InitialBalanceInput";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

describe("InitialBalanceInput", () => {
  const renderWithProvider = (component: React.ReactElement) => {
    // Clear document body before each render
    document.body.innerHTML = "";
    return render(
      <Provider store={store}>
        <MantineProvider>{component}</MantineProvider>
      </Provider>,
    );
  };

  it("renders initial balance input", () => {
    renderWithProvider(<InitialBalanceInput />);
    expect(screen.getByText(/Balance Inicial/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/0.00/i)).toBeInTheDocument();
  });

  it("updates balance on input change", () => {
    renderWithProvider(<InitialBalanceInput />);
    const input = screen.getByPlaceholderText(/0.00/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2000" } });
    expect(input.value).toBe("2000");
  });
});
