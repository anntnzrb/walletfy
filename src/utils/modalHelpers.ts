import { pipe, Option } from "effect";

const { fromNullable, match } = Option;

/**
 * Modal utility helpers using Effect-ts patterns
 * Provides reusable modal handling patterns
 */
export const modalHelpers = {
  /**
   * Create modal state handler
   */
  createHandler:
    <T>(open: () => void, setSelected: (item: T | null) => void) =>
    (item: T) => {
      setSelected(item);
      open();
    },

  /**
   * Create modal close handler
   */
  createCloseHandler:
    <T>(close: () => void, setSelected: (item: T | null) => void) =>
    () => {
      setSelected(null);
      close();
    },

  /**
   * Create modal props with common settings
   */
  createProps: (
    opened: boolean,
    onClose: () => void,
    title: string,
    options: {
      size?: "sm" | "md" | "lg";
      centered?: boolean;
      closeOnClickOutside?: boolean;
      closeOnEscape?: boolean;
    } = {},
  ) => ({
    opened,
    onClose,
    title,
    size: options.size || "md",
    centered: options.centered ?? true,
    closeOnClickOutside: options.closeOnClickOutside ?? true,
    closeOnEscape: options.closeOnEscape ?? true,
    radius: "lg",
    overlayProps: { blur: 4 },
  }),

  /**
   * Create confirmation modal handler
   */
  createConfirmationHandler: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => ({
    title,
    message,
    onConfirm,
    onCancel: onCancel || (() => {}),
    confirmText: "Confirmar",
    cancelText: "Cancelar",
  }),

  /**
   * Create modal with loading state
   */
  createLoadingModal: (
    loading: boolean,
    title: string,
    content: React.ReactNode,
  ) => ({
    loading,
    title,
    content,
    size: "md" as const,
    centered: true,
    closeOnClickOutside: !loading,
    closeOnEscape: !loading,
  }),

  /**
   * Create modal content with optional data
   */
  createContent: <T>(
    data: T | null,
    renderContent: (data: T) => React.ReactNode,
    emptyContent?: React.ReactNode,
  ): React.ReactNode =>
    pipe(
      fromNullable(data),
      match({
        onNone: () => emptyContent || null,
        onSome: (data) => renderContent(data),
      }),
    ),

  /**
   * Create modal actions
   */
  createActions: (
    primaryAction: {
      label: string;
      onClick: () => void;
      variant?: "filled" | "outline";
      loading?: boolean;
    },
    secondaryAction?: {
      label: string;
      onClick: () => void;
      variant?: "filled" | "outline";
    },
  ) => ({
    primary: {
      variant: primaryAction.variant || "filled",
      loading: primaryAction.loading || false,
      ...primaryAction,
    },
    secondary: secondaryAction
      ? {
          variant: secondaryAction.variant || "outline",
          ...secondaryAction,
        }
      : undefined,
  }),

  /**
   * Create modal with form validation
   */
  createFormModal: <T>(
    isValid: boolean,
    onSubmit: (data: T) => void,
    onCancel: () => void,
    submitLabel: string = "Guardar",
    cancelLabel: string = "Cancelar",
  ) => ({
    actions: {
      submit: {
        label: submitLabel,
        onClick: onSubmit,
        disabled: !isValid,
        variant: "filled" as const,
      },
      cancel: {
        label: cancelLabel,
        onClick: onCancel,
        variant: "outline" as const,
      },
    },
  }),

  /**
   * Create modal with async action
   */
  createAsyncModal: <T>(
    loading: boolean,
    onExecute: (data: T) => Promise<void>,
    onCancel: () => void,
    executeLabel: string = "Ejecutar",
    cancelLabel: string = "Cancelar",
  ) => ({
    actions: {
      execute: {
        label: executeLabel,
        onClick: onExecute,
        loading,
        variant: "filled" as const,
      },
      cancel: {
        label: cancelLabel,
        onClick: onCancel,
        variant: "outline" as const,
        disabled: loading,
      },
    },
  }),
};
