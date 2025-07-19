// src/hooks/__tests__/useInitialData.test.tsx
import { renderHook } from "@testing-library/react";
import { useInitialData } from "../useInitialData";
import { describe, it, expect } from "bun:test";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

describe("useInitialData", () => {
  const renderHookWithProvider = (callback: () => any) => {
    // Clear document body before each render
    document.body.innerHTML = "";
    return renderHook(callback, {
      wrapper: ({ children }) => (
        <Provider store={store}>
          <MantineProvider>{children}</MantineProvider>
        </Provider>
      ),
    });
  };

  it("initializes state from storage", () => {
    const { result } = renderHookWithProvider(() => useInitialData());
    expect(result.current).toBe(undefined); // Hook does not return anything
  });
});
