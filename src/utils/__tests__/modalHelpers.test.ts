import { describe, it, expect } from "bun:test";
import { modalHelpers } from "../modalHelpers";

describe("modalHelpers", () => {
  describe("createProps", () => {
    it("should create modal props with default values", () => {
      const mockFn = () => {};
      const result = modalHelpers.createProps(true, mockFn, "Test Title");

      expect(result).toEqual({
        opened: true,
        onClose: mockFn,
        title: "Test Title",
        size: "md",
        centered: true,
        closeOnClickOutside: true,
        closeOnEscape: true,
        radius: "lg",
        overlayProps: { blur: 4 },
      });
    });

    it("should create modal props with custom options", () => {
      const mockFn = () => {};
      const result = modalHelpers.createProps(true, mockFn, "Test Title", {
        size: "lg",
        centered: false,
        closeOnClickOutside: false,
        closeOnEscape: false,
      });

      expect(result).toEqual({
        opened: true,
        onClose: mockFn,
        title: "Test Title",
        size: "lg",
        centered: false,
        closeOnClickOutside: false,
        closeOnEscape: false,
        radius: "lg",
        overlayProps: { blur: 4 },
      });
    });
  });

  describe("createConfirmationHandler", () => {
    it("should create confirmation handler props", () => {
      const onConfirm = () => {};
      const onCancel = () => {};

      const result = modalHelpers.createConfirmationHandler(
        "Confirm",
        "Are you sure?",
        onConfirm,
        onCancel,
      );

      expect(result).toEqual({
        title: "Confirm",
        message: "Are you sure?",
        onConfirm,
        onCancel,
        confirmText: "Confirmar",
        cancelText: "Cancelar",
      });
    });

    it("should create confirmation handler with default onCancel", () => {
      const onConfirm = () => {};

      const result = modalHelpers.createConfirmationHandler(
        "Confirm",
        "Are you sure?",
        onConfirm,
      );

      expect(result.onCancel).toEqual(expect.any(Function));
    });
  });

  describe("createActions", () => {
    it("should create actions with primary action only", () => {
      const primaryAction = {
        label: "Save",
        onClick: () => {},
      };

      const result = modalHelpers.createActions(primaryAction);

      expect(result).toEqual({
        primary: {
          variant: "filled",
          loading: false,
          ...primaryAction,
        },
        secondary: undefined,
      });
    });

    it("should create actions with both primary and secondary actions", () => {
      const primaryAction = {
        label: "Save",
        onClick: () => {},
      };

      const secondaryAction = {
        label: "Cancel",
        onClick: () => {},
      };

      const result = modalHelpers.createActions(primaryAction, secondaryAction);

      expect(result).toEqual({
        primary: {
          variant: "filled",
          loading: false,
          ...primaryAction,
        },
        secondary: {
          variant: "outline",
          ...secondaryAction,
        },
      });
    });
  });
});
