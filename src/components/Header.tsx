import { Button, Group, Title } from "@mantine/core";
import { IconBrandGithub, IconPlus, IconScale } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const HeaderComponent = () => {
  return (
    <header
      style={{
        background: `linear-gradient(135deg, var(--walletfy-solarized-blue) 0%, var(--walletfy-solarized-violet) 100%)`,
        backdropFilter: "blur(10px)",
        borderBottomLeftRadius: "var(--walletfy-radius-xl)",
        borderBottomRightRadius: "var(--walletfy-radius-xl)",
        borderBottom: "1px solid var(--walletfy-solarized-base1)",
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
          className="walletfy-btn-ghost"
          style={{ color: "white" }}
          title="View Source Code"
        >
          <IconBrandGithub size={18} />
        </Button>
        <Group gap="lg" style={{ flex: 1, justifyContent: "center" }}>
          <Title
            order={1}
            c="white"
            className="walletfy-section-title"
            style={{ color: "white", fontSize: "1.75rem" }}
          >
            💰 Walletfy
          </Title>
          <nav>
            <Group gap="md">
              <Button
                variant="subtle"
                color="white"
                component={Link}
                to="/"
                className="walletfy-btn-ghost"
                style={{ color: "white" }}
                title="Balance Dashboard"
              >
                <IconScale size={18} />
              </Button>
              <Button
                variant="subtle"
                color="white"
                component={Link}
                to="/events/new"
                className="walletfy-btn-ghost"
                style={{ color: "white" }}
                title="Add New Event"
              >
                <IconPlus size={18} />
              </Button>
            </Group>
          </nav>
        </Group>
        <div style={{ marginRight: "12px" }}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default React.memo(HeaderComponent);
