import { describe, it, expect } from "bun:test";
import { eventTypeHelpers } from "../eventTypeHelpers";

describe("eventTypeHelpers", () => {
  describe("getColor", () => {
    it("should return income color for ingreso type", () => {
      const result = eventTypeHelpers.getColor("ingreso");
      expect(result).toBe("var(--walletfy-income)");
    });

    it("should return expense color for egreso type", () => {
      const result = eventTypeHelpers.getColor("egreso");
      expect(result).toBe("var(--walletfy-expense)");
    });
  });

  describe("getIcon", () => {
    it("should return money bag icon for ingreso type", () => {
      const result = eventTypeHelpers.getIcon("ingreso");
      expect(result).toBe("💰");
    });

    it("should return money with wings icon for egreso type", () => {
      const result = eventTypeHelpers.getIcon("egreso");
      expect(result).toBe("💸");
    });
  });

  describe("getSign", () => {
    it("should return plus sign for ingreso type", () => {
      const result = eventTypeHelpers.getSign("ingreso");
      expect(result).toBe("+");
    });

    it("should return minus sign for egreso type", () => {
      const result = eventTypeHelpers.getSign("egreso");
      expect(result).toBe("-");
    });
  });

  describe("getBgClass", () => {
    it("should return income background class for ingreso type", () => {
      const result = eventTypeHelpers.getBgClass("ingreso");
      expect(result).toBe("walletfy-income-bg");
    });

    it("should return expense background class for egreso type", () => {
      const result = eventTypeHelpers.getBgClass("egreso");
      expect(result).toBe("walletfy-expense-bg");
    });
  });

  describe("getTextClass", () => {
    it("should return income text class for ingreso type", () => {
      const result = eventTypeHelpers.getTextClass("ingreso");
      expect(result).toBe("walletfy-income");
    });

    it("should return expense text class for egreso type", () => {
      const result = eventTypeHelpers.getTextClass("egreso");
      expect(result).toBe("walletfy-expense");
    });
  });

  describe("getBalanceIndicator", () => {
    it("should return positive indicator for positive balance", () => {
      const result = eventTypeHelpers.getBalanceIndicator(100);
      expect(result).toEqual({
        color: "var(--walletfy-income)",
        icon: "📈",
      });
    });

    it("should return negative indicator for negative balance", () => {
      const result = eventTypeHelpers.getBalanceIndicator(-100);
      expect(result).toEqual({
        color: "var(--walletfy-expense)",
        icon: "📉",
      });
    });

    it("should return neutral indicator for zero balance", () => {
      const result = eventTypeHelpers.getBalanceIndicator(0);
      expect(result).toEqual({
        color: "var(--walletfy-neutral)",
        icon: "➖",
      });
    });
  });
});
