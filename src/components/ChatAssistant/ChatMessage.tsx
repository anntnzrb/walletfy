import React from "react";
import { Box, Group, Text } from "@mantine/core";
import { IconUser, IconRobot } from "@tabler/icons-react";
import ReactMarkdown from "react-markdown";
import type { Message } from "@/components/ChatAssistant/types";

interface ChatMessageProps {
  message: Message;
  themeMode: "light" | "dark";
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  themeMode,
}) => {
  const isUser = message.role === "user";

  return (
    <Group
      justify={isUser ? "flex-end" : "flex-start"}
      align="flex-start"
      gap="xs"
    >
      {!isUser && (
        <Box
          style={{
            backgroundColor:
              themeMode === "dark"
                ? "var(--walletfy-dark-border)"
                : "var(--walletfy-solarized-blue)",
            borderRadius: "50%",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconRobot size={14} color="white" />
        </Box>
      )}

      <Box
        style={{
          backgroundColor: isUser
            ? themeMode === "dark"
              ? "var(--walletfy-solarized-blue)"
              : "var(--walletfy-solarized-violet)"
            : themeMode === "dark"
              ? "var(--walletfy-dark-border)"
              : "var(--walletfy-gray-100)",
          borderRadius: "var(--walletfy-radius-lg)",
          padding: "var(--walletfy-space-sm)",
          maxWidth: "80%",
          wordBreak: "break-word",
        }}
      >
        {isUser ? (
          <Text
            size="sm"
            c={
              isUser
                ? "white"
                : themeMode === "dark"
                  ? "var(--walletfy-dark-text)"
                  : "var(--walletfy-gray-800)"
            }
            style={{ whiteSpace: "pre-wrap" }}
          >
            {message.content}
          </Text>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => (
                <Text
                  size="sm"
                  c={
                    themeMode === "dark"
                      ? "var(--walletfy-dark-text)"
                      : "var(--walletfy-gray-800)"
                  }
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <Text
                  size="sm"
                  fw={600}
                  c={
                    themeMode === "dark"
                      ? "var(--walletfy-dark-text)"
                      : "var(--walletfy-gray-800)"
                  }
                  {...props}
                />
              ),
              em: ({ node, ...props }) => (
                <Text
                  size="sm"
                  fs="italic"
                  c={
                    themeMode === "dark"
                      ? "var(--walletfy-dark-text)"
                      : "var(--walletfy-gray-800)"
                  }
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <Box
                  component="ul"
                  style={{
                    paddingLeft: "1.5rem",
                    margin: "0.5rem 0",
                    color:
                      themeMode === "dark"
                        ? "var(--walletfy-dark-text)"
                        : "var(--walletfy-gray-800)",
                  }}
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <Box
                  component="ol"
                  style={{
                    paddingLeft: "1.5rem",
                    margin: "0.5rem 0",
                    color:
                      themeMode === "dark"
                        ? "var(--walletfy-dark-text)"
                        : "var(--walletfy-gray-800)",
                  }}
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <Box
                  component="li"
                  style={{
                    margin: "0.25rem 0",
                    color:
                      themeMode === "dark"
                        ? "var(--walletfy-dark-text)"
                        : "var(--walletfy-gray-800)",
                  }}
                  {...props}
                />
              ),
              code: ({ node, ...props }) => (
                <Box
                  component="code"
                  style={{
                    backgroundColor:
                      themeMode === "dark"
                        ? "var(--walletfy-dark-border)"
                        : "var(--walletfy-gray-200)",
                    padding: "0.125rem 0.25rem",
                    borderRadius: "var(--walletfy-radius-sm)",
                    fontFamily: "monospace",
                    color:
                      themeMode === "dark"
                        ? "var(--walletfy-dark-text)"
                        : "var(--walletfy-gray-800)",
                  }}
                  {...props}
                />
              ),
              pre: ({ node, ...props }) => (
                <Box
                  component="pre"
                  style={{
                    backgroundColor:
                      themeMode === "dark"
                        ? "var(--walletfy-dark-border)"
                        : "var(--walletfy-gray-200)",
                    padding: "0.5rem",
                    borderRadius: "var(--walletfy-radius-sm)",
                    overflowX: "auto",
                    margin: "0.5rem 0",
                  }}
                  {...props}
                />
              ),
              blockquote: ({ node, ...props }) => (
                <Box
                  component="blockquote"
                  style={{
                    borderLeft: `3px solid ${
                      themeMode === "dark"
                        ? "var(--walletfy-dark-text-secondary)"
                        : "var(--walletfy-gray-400)"
                    }`,
                    paddingLeft: "1rem",
                    margin: "0.5rem 0",
                    color:
                      themeMode === "dark"
                        ? "var(--walletfy-dark-text-secondary)"
                        : "var(--walletfy-gray-600)",
                  }}
                  {...props}
                />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        <Text
          size="xs"
          c={
            isUser
              ? "var(--walletfy-solarized-base2)"
              : themeMode === "dark"
                ? "var(--walletfy-dark-text-secondary)"
                : "var(--walletfy-gray-600)"
          }
          mt={4}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Box>

      {isUser && (
        <Box
          style={{
            backgroundColor:
              themeMode === "dark"
                ? "var(--walletfy-dark-border)"
                : "var(--walletfy-gray-700)",
            borderRadius: "50%",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconUser size={14} color="white" />
        </Box>
      )}
    </Group>
  );
};
