import { describe, it, expect } from "bun:test";
import { formatters } from "../formatters";
import type { Event } from "@/types/Event";

describe("formatters", () => {
  describe("currency", () => {
    it("should format positive amount correctly", () => {
      const result = formatters.currency(1234.56);
      expect(result).toBe("$1,234.56");
    });

    it("should format zero amount correctly", () => {
      const result = formatters.currency(0);
      expect(result).toBe("$0.00");
    });

    it("should format negative amount correctly", () => {
      const result = formatters.currency(-1234.56);
      expect(result).toBe("-$1,234.56");
    });
  });

  describe("eventAmount", () => {
    it("should format ingreso event amount with plus sign", () => {
      const event: Event = {
        id: "1",
        nombre: "Test",
        cantidad: 100,
        fecha: new Date(),
        tipo: "ingreso",
      };

      const result = formatters.eventAmount(event);
      expect(result).toBe("+$100.00");
    });

    it("should format egreso event amount with minus sign", () => {
      const event: Event = {
        id: "1",
        nombre: "Test",
        cantidad: 100,
        fecha: new Date(),
        tipo: "egreso",
      };

      const result = formatters.eventAmount(event);
      expect(result).toBe("-$100.00");
    });
  });

  describe("eventAmountWithIcon", () => {
    it("should format ingreso event amount with money bag icon", () => {
      const event: Event = {
        id: "1",
        nombre: "Test",
        cantidad: 100,
        fecha: new Date(),
        tipo: "ingreso",
      };

      const result = formatters.eventAmountWithIcon(event);
      expect(result).toBe("💰 +$100.00");
    });

    it("should format egreso event amount with money with wings icon", () => {
      const event: Event = {
        id: "1",
        nombre: "Test",
        cantidad: 100,
        fecha: new Date(),
        tipo: "egreso",
      };

      const result = formatters.eventAmountWithIcon(event);
      expect(result).toBe("💸 -$100.00");
    });
  });

  describe("balance", () => {
    it("should format positive balance with plus sign", () => {
      const result = formatters.balance(1234.56);
      expect(result).toBe("+$1,234.56");
    });

    it("should format zero balance correctly", () => {
      const result = formatters.balance(0);
      expect(result).toBe("+$0.00");
    });

    it("should format negative balance correctly", () => {
      const result = formatters.balance(-1234.56);
      expect(result).toBe("-$1,234.56");
    });
  });

  describe("eventCount", () => {
    it("should format singular event count", () => {
      const result = formatters.eventCount(1);
      expect(result).toBe("1 evento registrado");
    });

    it("should format plural event count", () => {
      const result = formatters.eventCount(5);
      expect(result).toBe("5 eventos registrados");
    });

    it("should format zero event count", () => {
      const result = formatters.eventCount(0);
      expect(result).toBe("0 eventos registrados");
    });
  });

  describe("percentage", () => {
    it("should format percentage correctly", () => {
      const result = formatters.percentage(50, 100);
      expect(result).toBe("50%");
    });

    it("should handle zero total", () => {
      const result = formatters.percentage(50, 0);
      expect(result).toBe("0%");
    });

    it("should round percentage to whole number", () => {
      const result = formatters.percentage(33, 100);
      expect(result).toBe("33%");
    });
  });

  describe("compactNumber", () => {
    it("should format large numbers with K suffix", () => {
      const result = formatters.compactNumber(1500);
      expect(result).toBe("1.5K");
    });

    it("should format large numbers with M suffix", () => {
      const result = formatters.compactNumber(1500000);
      expect(result).toBe("1.5M");
    });

    it("should format small numbers without suffix", () => {
      const result = formatters.compactNumber(500);
      expect(result).toBe("500");
    });

    it("should handle zero", () => {
      const result = formatters.compactNumber(0);
      expect(result).toBe("0");
    });

    it("should handle negative numbers", () => {
      const result = formatters.compactNumber(-1500);
      expect(result).toBe("-1.5K");
    });
  });
});
