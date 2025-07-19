import { pipe } from "effect";
import type { EventType } from "@/types/Event";
import { eventTypeHelpers } from "./eventTypeHelpers";

/**
 * Composable style utilities using Effect-ts pipe pattern
 * Reduces inline style repetition across components
 */
export const styleHelpers = {
  /**
   * Card style generator
   */
  card: (options: { compact?: boolean; hover?: boolean } = {}) =>
    pipe({
      className: "walletfy-card",
      style: {
        padding: options.compact
          ? "var(--walletfy-space-md)"
          : "var(--walletfy-space-lg)",
        borderRadius: "var(--walletfy-radius-lg)",
        transition: "all 0.2s ease-in-out",
        ...(options.hover && {
          cursor: "pointer",
          transform: "translateY(0)",
        }),
      },
    }),

  /**
   * Badge style generator for event types
   */
  badge: (tipo: EventType, size: "sm" | "md" | "lg" = "md") =>
    pipe({
      className: eventTypeHelpers.getBgClass(tipo),
      style: {
        padding: "var(--walletfy-space-sm) var(--walletfy-space-md)",
        borderRadius: "var(--walletfy-radius-md)",
        fontWeight: "600",
        fontSize:
          size === "lg" ? "1rem" : size === "md" ? "0.875rem" : "0.75rem",
        display: "flex",
        alignItems: "center",
        gap: "var(--walletfy-space-xs)",
        textAlign: "center" as const,
        minWidth: "fit-content",
      },
    }),

  /**
   * Button style generator
   */
  button: (
    variant: "primary" | "secondary" | "ghost" = "primary",
    size: "sm" | "md" | "lg" = "md",
  ) =>
    pipe({
      className: `walletfy-btn-${variant}`,
      style: {
        minHeight: "44px",
        padding:
          size === "lg"
            ? "var(--walletfy-space-md) var(--walletfy-space-xl)"
            : size === "md"
              ? "var(--walletfy-space-sm) var(--walletfy-space-lg)"
              : "var(--walletfy-space-sm) var(--walletfy-space-md)",
        borderRadius: "var(--walletfy-radius-md)",
        fontWeight: "500",
        transition: "all 0.2s ease-in-out",
        fontSize: size === "lg" ? "1.125rem" : "1rem",
      },
    }),

  /**
   * Action icon style generator
   */
  actionIcon: (color: string, _size: "sm" | "md" | "lg" = "sm") =>
    pipe({
      style: {
        color,
        borderRadius: "var(--walletfy-radius-sm)",
        transition: "all 0.2s ease-in-out",
      },
    }),

  /**
   * Financial figure style generator
   */
  financialFigure: (balance: number, size: "sm" | "md" | "lg" = "md") =>
    pipe({
      style: {
        color: eventTypeHelpers.getBalanceIndicator(balance).color,
        fontSize: size === "lg" ? "2rem" : size === "md" ? "1.5rem" : "1.25rem",
        fontWeight: "700",
        textShadow: "0 2px 4px rgba(0,0,0,0.2)",
      },
    }),

  /**
   * Empty state style generator
   */
  emptyState: () =>
    pipe({
      className: "walletfy-empty-state",
      style: {
        textAlign: "center" as const,
        padding: "var(--walletfy-space-2xl)",
        color: "var(--walletfy-gray-600)",
      },
    }),

  /**
   * Modal style generator
   */
  modal: (options: { size?: "sm" | "md" | "lg"; centered?: boolean } = {}) =>
    pipe({
      size: options.size || "md",
      radius: "lg",
      centered: options.centered ?? true,
      overlayProps: { blur: 4 },
    }),

  /**
   * Grid style generator
   */
  grid: (options: { gap?: string; responsive?: boolean } = {}) =>
    pipe({
      className: options.responsive
        ? "walletfy-grid walletfy-grid-sm-2 walletfy-grid-md-3 walletfy-grid-lg-4"
        : "walletfy-grid",
      style: {
        marginTop: options.gap || "var(--walletfy-space-md)",
      },
    }),

  /**
   * Section title style generator
   */
  sectionTitle: (size: "sm" | "md" | "lg" = "md") =>
    pipe({
      className: "walletfy-section-title",
      style: {
        fontSize: size === "lg" ? "1.5rem" : size === "md" ? "1.25rem" : "1rem",
        marginBottom: "var(--walletfy-space-lg)",
      },
    }),

  /**
   * Helper text style generator
   */
  helperText: (size: "sm" | "md" = "sm") =>
    pipe({
      className: "walletfy-helper-text",
      style: {
        fontSize: size === "md" ? "1rem" : "0.875rem",
        fontWeight: "500",
      },
    }),

  /**
   * Centered container style generator
   */
  centeredContainer: (_maxWidth: string = "800px") =>
    pipe({
      style: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "var(--walletfy-space-xl)",
      },
    }),

  /**
   * Gradient background style generator
   */
  gradientBackground: (startColor: string, endColor: string) =>
    pipe({
      style: {
        background: `linear-gradient(135deg, ${startColor}, ${endColor})`,
        color: "white",
      },
    }),
};
