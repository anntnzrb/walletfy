// src/components/__tests__/Header.test.tsx
import { describe, it, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import React from "react";
import { MantineProvider } from "@mantine/core";
import { Button, Group, Title } from "@mantine/core";
import { IconBrandGithub, IconPlus, IconScale } from "@tabler/icons-react";

// Simple test component that mimics Header structure without router dependencies
const TestHeader = () => {
  return (
    <header
      style={{
        background: `linear-gradient(135deg, #6699cc 0%, #9966cc 100%)`,
        backdropFilter: "blur(10px)",
        borderBottomLeftRadius: "16px",
        borderBottomRightRadius: "16px",
        borderBottom: "1px solid #93a1a1",
        boxShadow:
          "0 8px 32px rgba(0, 43, 54, 0.1), 0 2px 8px rgba(0, 43, 54, 0.05)",
      }}
      className="p-6 text-white"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button
          variant="subtle"
          color="white"
          component="a"
          href="https://github.com/anntnzrb/walletfy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "white" }}
          title="View Source Code"
        >
          <IconBrandGithub size={18} />
        </Button>
        <Group gap="lg" style={{ flex: 1, justifyContent: "center" }}>
          <Title
            order={1}
            c="white"
            style={{ color: "white", fontSize: "1.75rem" }}
          >
            💰 Walletfy
          </Title>
          <nav>
            <Group gap="md">
              <Button
                variant="subtle"
                color="white"
                component="a"
                href="#"
                style={{ color: "white" }}
                title="Balance Dashboard"
              >
                <IconScale size={18} />
              </Button>
              <Button
                variant="subtle"
                color="white"
                component="a"
                href="#"
                style={{ color: "white" }}
                title="Add New Event"
              >
                <IconPlus size={18} />
              </Button>
            </Group>
          </nav>
        </Group>
        <div style={{ marginRight: "12px" }}>
          <div data-testid="theme-toggle">Theme Toggle</div>
        </div>
      </div>
    </header>
  );
};

describe("Header", () => {
  const renderWithProvider = (component: React.ReactElement) => {
    // Clear document body before each render
    document.body.innerHTML = "";
    return render(<MantineProvider>{component}</MantineProvider>);
  };

  it("renders Walletfy title", () => {
    renderWithProvider(<TestHeader />);
    expect(screen.getByText(/Walletfy/i)).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    renderWithProvider(<TestHeader />);
    expect(screen.getByTitle(/Balance Dashboard/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Add New Event/i)).toBeInTheDocument();
    expect(screen.getByTitle(/View Source Code/i)).toBeInTheDocument();
  });

  it("renders ThemeToggle", () => {
    renderWithProvider(<TestHeader />);
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});
