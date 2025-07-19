import { Match } from "effect";
import React from "react";
import type { EventType } from "@/types/Event";

/**
 * Centralized event type utilities using Effect-ts Match pattern
 * Replaces scattered event type logic across multiple files
 */
export const eventTypeHelpers = {
  /**
   * Get color for event type
   */
  getColor: (tipo: EventType): string =>
    Match.value(tipo).pipe(
      Match.when("ingreso", () => "var(--walletfy-income)"),
      Match.when("egreso", () => "var(--walletfy-expense)"),
      Match.exhaustive,
    ),

  /**
   * Get icon emoji for event type
   */
  getIcon: (tipo: EventType): string =>
    Match.value(tipo).pipe(
      Match.when("ingreso", () => "💰"),
      Match.when("egreso", () => "💸"),
      Match.exhaustive,
    ),

  /**
   * Get sign for event type
   */
  getSign: (tipo: EventType): string =>
    Match.value(tipo).pipe(
      Match.when("ingreso", () => "+"),
      Match.when("egreso", () => "-"),
      Match.exhaustive,
    ),

  /**
   * Get CSS class for event type background
   */
  getBgClass: (tipo: EventType): string =>
    Match.value(tipo).pipe(
      Match.when("ingreso", () => "walletfy-income-bg"),
      Match.when("egreso", () => "walletfy-expense-bg"),
      Match.exhaustive,
    ),

  /**
   * Get CSS class for event type text
   */
  getTextClass: (tipo: EventType): string =>
    Match.value(tipo).pipe(
      Match.when("ingreso", () => "walletfy-income"),
      Match.when("egreso", () => "walletfy-expense"),
      Match.exhaustive,
    ),

  /**
   * Get balance indicator for display
   */
  getBalanceIndicator: (balance: number): { color: string; icon: string } => {
    if (balance > 0) {
      return {
        color: "var(--walletfy-income)",
        icon: "📈",
      };
    } else if (balance < 0) {
      return {
        color: "var(--walletfy-expense)",
        icon: "📉",
      };
    } else {
      return {
        color: "var(--walletfy-neutral)",
        icon: "➖",
      };
    }
  },

  /**
   * Get trend icon for balance
   */
  getTrendIcon: (balance: number): React.ReactNode => {
    const IconTrendingUp = () => React.createElement("span", {}, "📈");
    const IconTrendingDown = () => React.createElement("span", {}, "📉");
    const IconMinus = () => React.createElement("span", {}, "➖");

    if (balance > 0) {
      return React.createElement(IconTrendingUp);
    } else if (balance < 0) {
      return React.createElement(IconTrendingDown);
    } else {
      return React.createElement(IconMinus);
    }
  },
};
