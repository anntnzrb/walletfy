import { describe, it, expect } from "bun:test";
import { balanceHelpers } from "../balanceHelpers";
import type { Event } from "@/types/Event";

describe("balanceHelpers", () => {
  const mockEvents: Event[] = [
    {
      id: "1",
      nombre: "Salary",
      descripcion: "Monthly salary",
      cantidad: 5000,
      fecha: new Date("2024-01-15"),
      tipo: "ingreso",
      adjunto: undefined,
    },
    {
      id: "2",
      nombre: "Rent",
      descripcion: "Monthly rent",
      cantidad: 1500,
      fecha: new Date("2024-01-01"),
      tipo: "egreso",
      adjunto: undefined,
    },
  ];

  describe("calculateMonthlyBalance", () => {
    it("should calculate monthly balance correctly", () => {
      const result = balanceHelpers.calculateMonthlyBalance(mockEvents);

      expect(result).toEqual({
        ingresos: 5000,
        egresos: 1500,
      });
    });

    it("should handle empty events array", () => {
      const result = balanceHelpers.calculateMonthlyBalance([]);

      expect(result).toEqual({
        ingresos: 0,
        egresos: 0,
      });
    });
  });

  describe("formatCurrency", () => {
    it("should format positive amounts correctly", () => {
      const result = balanceHelpers.formatCurrency(1234.56);

      expect(result).toBe("$1,234.56");
    });

    it("should format zero correctly", () => {
      const result = balanceHelpers.formatCurrency(0);

      expect(result).toBe("$0.00");
    });
  });

  describe("getCurrentGlobalBalance", () => {
    it("should return current global balance", () => {
      const result = balanceHelpers.getCurrentGlobalBalance(mockEvents, 1000);

      expect(result).toBe(4500);
    });
  });

  describe("getBalanceChangeIndicator", () => {
    it("should return positive indicator for positive balance", () => {
      const result = balanceHelpers.getBalanceChangeIndicator(100);

      expect(result).toEqual({
        color: "var(--walletfy-income)",
        icon: "📈",
      });
    });

    it("should return negative indicator for negative balance", () => {
      const result = balanceHelpers.getBalanceChangeIndicator(-100);

      expect(result).toEqual({
        color: "var(--walletfy-expense)",
        icon: "📉",
      });
    });

    it("should return neutral indicator for zero balance", () => {
      const result = balanceHelpers.getBalanceChangeIndicator(0);

      expect(result).toEqual({
        color: "var(--walletfy-neutral)",
        icon: "➖",
      });
    });
  });
});
