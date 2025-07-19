import { pipe } from "effect";
import type { Event } from "@/types/Event";
import { eventTypeHelpers } from "./eventTypeHelpers";

/**
 * Centralized formatting utilities using Effect-ts pipe pattern
 * Replaces scattered formatting functions across components
 */
export const formatters = {
  /**
   * Format currency amount
   */
  currency: (amount: number): string =>
    pipe(amount, (n) =>
      new Intl.NumberFormat("es-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n),
    ),

  /**
   * Format event amount with sign
   */
  eventAmount: (event: Event): string =>
    pipe(
      event,
      (e) =>
        `${eventTypeHelpers.getSign(e.tipo)}${formatters.currency(e.cantidad)}`,
    ),

  /**
   * Format event amount with icon
   */
  eventAmountWithIcon: (event: Event): string =>
    pipe(
      event,
      (e) =>
        `${eventTypeHelpers.getIcon(e.tipo)} ${eventTypeHelpers.getSign(e.tipo)}${formatters.currency(e.cantidad)}`,
    ),

  /**
   * Format balance with proper sign
   */
  balance: (amount: number): string =>
    pipe(amount, (n) => {
      const sign = n >= 0 ? "+" : "";
      return `${sign}${formatters.currency(n)}`;
    }),

  /**
   * Format balance with indicator
   */
  balanceWithIndicator: (
    amount: number,
  ): { text: string; color: string; icon: string } =>
    pipe(amount, (n) => {
      const { color, icon } = eventTypeHelpers.getBalanceIndicator(n);
      return {
        text: formatters.balance(n),
        color,
        icon,
      };
    }),

  /**
   * Format event count
   */
  eventCount: (count: number): string =>
    pipe(
      count,
      (n) => `${n} evento${n !== 1 ? "s" : ""} registrado${n !== 1 ? "s" : ""}`,
    ),

  /**
   * Format percentage
   */
  percentage: (value: number, total: number): string =>
    pipe({ value, total }, ({ value, total }) =>
      total === 0 ? "0%" : `${Math.round((value / total) * 100)}%`,
    ),

  /**
   * Format large numbers with K/M suffixes
   */
  compactNumber: (amount: number): string =>
    pipe(amount, (n) => {
      const absAmount = Math.abs(n);
      const sign = n < 0 ? "-" : "";

      if (absAmount >= 1000000) {
        return `${sign}${(absAmount / 1000000).toFixed(1)}M`;
      } else if (absAmount >= 1000) {
        return `${sign}${(absAmount / 1000).toFixed(1)}K`;
      } else {
        return `${sign}${absAmount.toFixed(0)}`;
      }
    }),

  /**
   * Format tooltip content
   */
  tooltipContent: (descripcion?: string): string =>
    pipe(descripcion || "Sin descripción"),

  /**
   * Format month summary
   */
  monthSummary: (ingresos: number, egresos: number): string =>
    pipe({ ingresos, egresos }, ({ ingresos, egresos }) => {
      const balance = ingresos - egresos;
      const balanceFormatted = formatters.balance(balance);
      return `Ingresos: ${formatters.currency(ingresos)} | Egresos: ${formatters.currency(egresos)} | Balance: ${balanceFormatted}`;
    }),

  /**
   * Format file size
   */
  fileSize: (bytes: number): string =>
    pipe(bytes, (b) => {
      const sizes = ["Bytes", "KB", "MB", "GB"];
      if (b === 0) return "0 Bytes";
      const i = Math.floor(Math.log(b) / Math.log(1024));
      return `${Math.round((b / Math.pow(1024, i)) * 100) / 100} ${sizes[i]}`;
    }),

  /**
   * Format validation error
   */
  validationError: (field: string, constraint: string): string =>
    pipe(
      { field, constraint },
      ({ field, constraint }) => `${field}: ${constraint}`,
    ),
};
