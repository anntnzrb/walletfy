import { describe, it, expect } from "bun:test";
import { eventSchema, eventCreateSchema } from "../eventSchema";

describe("eventSchema", () => {
  const validEventData = {
    id: "123",
    nombre: "Test Event",
    descripcion: "Test description",
    cantidad: 100,
    fecha: new Date("2024-01-15"),
    tipo: "ingreso" as const,
    adjunto: undefined,
  };

  describe("eventSchema validation", () => {
    it("should validate valid event data", () => {
      const result = eventSchema.safeParse(validEventData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validEventData);
      }
    });

    it("should validate event without optional fields", () => {
      const eventWithoutOptionals = {
        id: "123",
        nombre: "Test Event",
        cantidad: 100,
        fecha: new Date("2024-01-15"),
        tipo: "egreso" as const,
      };

      const result = eventSchema.safeParse(eventWithoutOptionals);

      expect(result.success).toBe(true);
    });
  });

  describe("id field validation", () => {
    it("should reject empty id", () => {
      const invalidData = { ...validEventData, id: "" };
      const result = eventSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("ID es requerido");
      }
    });
  });

  describe("nombre field validation", () => {
    it("should reject empty nombre", () => {
      const invalidData = { ...validEventData, nombre: "" };
      const result = eventSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Nombre es requerido");
      }
    });

    it("should reject nombre longer than 20 characters", () => {
      const invalidData = { ...validEventData, nombre: "a".repeat(21) };
      const result = eventSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Nombre debe tener máximo 20 caracteres",
        );
      }
    });

    it("should accept nombre with exactly 20 characters", () => {
      const validData = { ...validEventData, nombre: "a".repeat(20) };
      const result = eventSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("cantidad field validation", () => {
    it("should accept positive numbers", () => {
      const validData = { ...validEventData, cantidad: 0.01 };
      const result = eventSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should reject zero cantidad", () => {
      const invalidData = { ...validEventData, cantidad: 0 };
      const result = eventSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Cantidad debe ser un número positivo",
        );
      }
    });

    it("should reject negative cantidad", () => {
      const invalidData = { ...validEventData, cantidad: -100 };
      const result = eventSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Cantidad debe ser un número positivo",
        );
      }
    });
  });

  describe("tipo field validation", () => {
    it('should accept "ingreso" tipo', () => {
      const validData = { ...validEventData, tipo: "ingreso" as const };
      const result = eventSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept "egreso" tipo', () => {
      const validData = { ...validEventData, tipo: "egreso" as const };
      const result = eventSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it("should reject invalid tipo", () => {
      const invalidData = { ...validEventData, tipo: "invalid" };
      const result = eventSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Invalid enum value. Expected 'ingreso' | 'egreso', received 'invalid'",
        );
      }
    });
  });
});

describe("eventCreateSchema", () => {
  const validCreateData = {
    nombre: "Test Event",
    descripcion: "Test description",
    cantidad: 100,
    fecha: new Date("2024-01-15"),
    tipo: "ingreso" as const,
    adjunto: undefined,
  };

  describe("eventCreateSchema validation", () => {
    it("should validate valid create data without id", () => {
      const result = eventCreateSchema.safeParse(validCreateData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validCreateData);
      }
    });

    it("should apply same validation rules as eventSchema", () => {
      const invalidData = { ...validCreateData, cantidad: -100 };
      const result = eventCreateSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Cantidad debe ser un número positivo",
        );
      }
    });
  });
});
