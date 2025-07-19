import { describe, it, expect } from "bun:test";
import { styleHelpers } from "../styleHelpers";

describe("styleHelpers", () => {
  describe("card", () => {
    it("should create card style with default options", () => {
      const result = styleHelpers.card();

      expect(result).toEqual({
        className: "walletfy-card",
        style: {
          padding: "var(--walletfy-space-lg)",
          borderRadius: "var(--walletfy-radius-lg)",
          transition: "all 0.2s ease-in-out",
        },
      });
    });

    it("should create card style with compact option", () => {
      const result = styleHelpers.card({ compact: true });

      expect(result.style.padding).toBe("var(--walletfy-space-md)");
    });

    it("should create card style with hover option", () => {
      const result = styleHelpers.card({ hover: true });

      expect(result.style.cursor).toBe("pointer");
      expect(result.style.transform).toBe("translateY(0)");
    });
  });

  describe("badge", () => {
    it("should create badge style for ingreso type", () => {
      const result = styleHelpers.badge("ingreso");

      expect(result).toEqual({
        className: "walletfy-income-bg",
        style: {
          padding: "var(--walletfy-space-sm) var(--walletfy-space-md)",
          borderRadius: "var(--walletfy-radius-md)",
          fontWeight: "600",
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          gap: "var(--walletfy-space-xs)",
          textAlign: "center",
          minWidth: "fit-content",
        },
      });
    });

    it("should create badge style for egreso type with different sizes", () => {
      const resultSmall = styleHelpers.badge("egreso", "sm");
      const resultLarge = styleHelpers.badge("egreso", "lg");

      expect(resultSmall.style.fontSize).toBe("0.75rem");
      expect(resultLarge.style.fontSize).toBe("1rem");
    });
  });

  describe("button", () => {
    it("should create primary button style with default size", () => {
      const result = styleHelpers.button();

      expect(result).toEqual({
        className: "walletfy-btn-primary",
        style: {
          minHeight: "44px",
          padding: "var(--walletfy-space-sm) var(--walletfy-space-lg)",
          borderRadius: "var(--walletfy-radius-md)",
          fontWeight: "500",
          transition: "all 0.2s ease-in-out",
          fontSize: "1rem",
        },
      });
    });

    it("should create secondary button style with large size", () => {
      const result = styleHelpers.button("secondary", "lg");

      expect(result.className).toBe("walletfy-btn-secondary");
      expect(result.style.fontSize).toBe("1.125rem");
      expect(result.style.padding).toBe(
        "var(--walletfy-space-md) var(--walletfy-space-xl)",
      );
    });
  });

  describe("financialFigure", () => {
    it("should create financial figure style for positive balance", () => {
      const result = styleHelpers.financialFigure(100);

      expect(result.style.color).toBe("var(--walletfy-income)");
      expect(result.style.fontSize).toBe("1.5rem");
      expect(result.style.fontWeight).toBe("700");
    });

    it("should create financial figure style for negative balance", () => {
      const result = styleHelpers.financialFigure(-100);

      expect(result.style.color).toBe("var(--walletfy-expense)");
    });
  });

  describe("sectionTitle", () => {
    it("should create section title style with default size", () => {
      const result = styleHelpers.sectionTitle();

      expect(result.className).toBe("walletfy-section-title");
      expect(result.style.fontSize).toBe("1.25rem");
      expect(result.style.marginBottom).toBe("var(--walletfy-space-lg)");
    });

    it("should create section title style with large size", () => {
      const result = styleHelpers.sectionTitle("lg");

      expect(result.style.fontSize).toBe("1.5rem");
    });
  });
});
