import { describe, it, expect } from "bun:test";
import { dateHelpers } from "../dateHelpers";
import type { Event } from "@/types/Event";

describe("dateHelpers", () => {
  const mockEvents: Event[] = [
    {
      id: "1",
      nombre: "Event 1",
      descripcion: "First event",
      cantidad: 100,
      fecha: new Date("2024-01-15"),
      tipo: "ingreso",
      adjunto: undefined,
    },
    {
      id: "2",
      nombre: "Event 2",
      descripcion: "Second event",
      cantidad: 200,
      fecha: new Date("2024-01-10"),
      tipo: "egreso",
      adjunto: undefined,
    },
    {
      id: "3",
      nombre: "Event 3",
      descripcion: "Third event",
      cantidad: 300,
      fecha: new Date("2024-02-05"),
      tipo: "ingreso",
      adjunto: undefined,
    },
  ];

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-01-15");
      const result = dateHelpers.formatDate(date);

      expect(result).toBe("15/01/2024");
    });

    it("should handle single digit days and months", () => {
      const date = new Date("2024-03-05");
      const result = dateHelpers.formatDate(date);

      expect(result).toBe("05/03/2024");
    });
  });

  describe("getMonthKey", () => {
    it("should return month key in YYYY-MM format", () => {
      const date = new Date("2024-01-15");
      const result = dateHelpers.getMonthKey(date);

      expect(result).toBe("2024-01");
    });

    it("should handle single digit months", () => {
      const date = new Date("2024-03-05");
      const result = dateHelpers.getMonthKey(date);

      expect(result).toBe("2024-03");
    });
  });

  describe("groupEventsByMonth", () => {
    it("should group events by month correctly", () => {
      const result = dateHelpers.groupEventsByMonth(mockEvents);

      expect(result).toHaveProperty("2024-01");
      expect(result).toHaveProperty("2024-02");
      expect(result["2024-01"]).toHaveLength(2);
      expect(result["2024-02"]).toHaveLength(1);
    });

    it("should handle empty events array", () => {
      const result = dateHelpers.groupEventsByMonth([]);

      expect(result).toEqual({});
    });
  });

  describe("sortEventsByDate", () => {
    it("should sort events by date in descending order", () => {
      const result = dateHelpers.sortEventsByDate(mockEvents);

      expect(result[0].fecha).toEqual(new Date("2024-02-05")); // Event 3
      expect(result[1].fecha).toEqual(new Date("2024-01-15")); // Event 1
      expect(result[2].fecha).toEqual(new Date("2024-01-10")); // Event 2
    });

    it("should handle empty events array", () => {
      const result = dateHelpers.sortEventsByDate([]);

      expect(result).toEqual([]);
    });
  });

  describe("getMonthName", () => {
    it("should return month name in Spanish", () => {
      const result = dateHelpers.getMonthName("2024-01");

      expect(result).toBe("enero 2024");
    });

    it("should handle different months", () => {
      const result = dateHelpers.getMonthName("2024-12");

      expect(result).toBe("diciembre 2024");
    });
  });

  describe("isValidDate", () => {
    it("should return true for valid dates", () => {
      const validDate = new Date("2024-01-15");
      const result = dateHelpers.isValidDate(validDate);

      expect(result).toBe(true);
    });

    it("should return false for invalid dates", () => {
      const invalidDate = new Date("invalid-date");
      const result = dateHelpers.isValidDate(invalidDate);

      expect(result).toBe(false);
    });
  });

  describe("getCurrentDate", () => {
    it("should return current date", () => {
      const result = dateHelpers.getCurrentDate();

      expect(result).toBeInstanceOf(Date);
    });
  });

  describe("parseDate", () => {
    it("should parse date string correctly", () => {
      const result = dateHelpers.parseDate("2024-01-15");

      expect(result).toEqual(new Date("2024-01-15"));
    });
  });
});
