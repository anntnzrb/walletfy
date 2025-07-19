// src/test/utils.tsx
import React from "react";

// Mock Link component for tests
export const MockLink = ({ children, ...props }: any) => {
  return <a {...props}>{children}</a>;
};

// Mock ThemeToggle component for tests
export const MockThemeToggle = () => {
  return <div data-testid="theme-toggle">Theme Toggle</div>;
};

// Mock router utilities
export const mockRouter = {
  navigate: () => {},
  buildLocation: () => ({ href: "#" }),
};

// Wrapper component with providers
export const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
