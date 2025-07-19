import { describe, it, expect, vi } from "bun:test";
import { formHelpers } from "../formHelpers";

describe("formHelpers", () => {
  describe("getInitialValue", () => {
    it("should return the value when it is defined", () => {
      const result = formHelpers.getInitialValue("test", "default");
      expect(result).toBe("test");
    });

    it("should return the default value when the value is undefined", () => {
      const result = formHelpers.getInitialValue(undefined, "default");
      expect(result).toBe("default");
    });
  });

  describe("createInitialValues", () => {
    it("should create initial values with provided data", () => {
      const data = { name: "John", age: 30 };
      const defaults = { name: "", age: 0, email: "" };

      const result = formHelpers.createInitialValues(data, defaults);
      expect(result).toEqual({ name: "John", age: 30, email: "" });
    });

    it("should use defaults when data is undefined", () => {
      const defaults = { name: "Default", age: 25 };

      const result = formHelpers.createInitialValues(undefined, defaults);
      expect(result).toEqual({ name: "Default", age: 25 });
    });
  });

  describe("validateRequired", () => {
    it("should return error message for undefined value", () => {
      const result = formHelpers.validateRequired(undefined, "Name");
      expect(result).toBe("Name es requerido");
    });

    it("should return error message for empty string", () => {
      const result = formHelpers.validateRequired("", "Name");
      expect(result).toBe("Name es requerido");
    });

    it("should return null for valid value", () => {
      const result = formHelpers.validateRequired("John", "Name");
      expect(result).toBeNull();
    });
  });

  describe("validateLength", () => {
    it("should return error for string shorter than minimum", () => {
      const result = formHelpers.validateLength("Hi", 5, 10, "Name");
      expect(result).toBe("Name debe tener al menos 5 caracteres");
    });

    it("should return error for string longer than maximum", () => {
      const result = formHelpers.validateLength(
        "This is a very long string",
        5,
        10,
        "Name",
      );
      expect(result).toBe("Name debe tener máximo 10 caracteres");
    });

    it("should return null for string within valid range", () => {
      const result = formHelpers.validateLength("Hello", 3, 10, "Name");
      expect(result).toBeNull();
    });
  });

  describe("validatePositiveNumber", () => {
    it("should return error for zero", () => {
      const result = formHelpers.validatePositiveNumber(0, "Amount");
      expect(result).toBe("Amount debe ser un número positivo");
    });

    it("should return error for negative number", () => {
      const result = formHelpers.validatePositiveNumber(-10, "Amount");
      expect(result).toBe("Amount debe ser un número positivo");
    });

    it("should return null for positive number", () => {
      const result = formHelpers.validatePositiveNumber(10, "Amount");
      expect(result).toBeNull();
    });
  });

  describe("batchValidate", () => {
    it("should validate multiple fields", () => {
      const values = { name: "", age: -5 };
      const validators = {
        name: (value: string) => formHelpers.validateRequired(value, "Name"),
        age: (value: number) =>
          formHelpers.validatePositiveNumber(value, "Age"),
      };

      const result = formHelpers.batchValidate(values, validators);
      expect(result).toEqual({
        name: "Name es requerido",
        age: "Age debe ser un número positivo",
      });
    });

    it("should return null for valid fields", () => {
      const values = { name: "John", age: 30 };
      const validators = {
        name: (value: string) => formHelpers.validateRequired(value, "Name"),
        age: (value: number) =>
          formHelpers.validatePositiveNumber(value, "Age"),
      };

      const result = formHelpers.batchValidate(values, validators);
      expect(result).toEqual({
        name: null,
        age: null,
      });
    });
  });
});
