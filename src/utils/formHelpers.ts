import { pipe, Option, Match, Effect } from "effect";

const { fromNullable, getOrElse, match } = Option;
const { value, when, orElse } = Match;
const { sync, tryPromise, tap, catchAll, runPromise } = Effect;

/**
 * Form utilities using Effect-ts patterns
 * Provides reusable form handling and validation patterns
 */
export const formHelpers = {
  /**
   * Get initial value with fallback using Option
   */
  getInitialValue: <T>(value: T | undefined, defaultValue: T): T =>
    pipe(
      fromNullable(value),
      getOrElse(() => defaultValue),
    ),

  /**
   * Create initial form values from optional data
   */
  createInitialValues: <T extends Record<string, any>>(
    data: Partial<T> | undefined,
    defaults: T,
  ): T =>
    pipe(Object.keys(defaults), (keys) =>
      keys.reduce(
        (acc, key) => ({
          ...acc,
          [key]: formHelpers.getInitialValue(data?.[key], defaults[key]),
        }),
        {} as T,
      ),
    ),

  /**
   * Handle edit vs create mode using Match pattern
   */
  handleFormMode: <T, R>(
    isEditing: boolean,
    data: T | undefined,
    editHandler: (data: T) => R,
    createHandler: () => R,
  ): R =>
    pipe(
      value({ isEditing, data }),
      when({ isEditing: true }, ({ data }) => editHandler(data!)),
      orElse(() => createHandler()),
    ),

  /**
   * File upload handler with Effect-ts
   */
  handleFileUpload: (
    file: File | null,
    onSuccess: (base64: string) => void,
    onError?: (error: unknown) => void,
  ): void => {
    const readFileAsBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    pipe(
      fromNullable(file),
      match({
        onNone: () => sync(() => onSuccess("")),
        onSome: (file) =>
          tryPromise(() => readFileAsBase64(file)).pipe(
            tap((base64) => sync(() => onSuccess(base64))),
            catchAll((error) =>
              sync(() =>
                onError
                  ? onError(error)
                  : console.error("Failed to read file:", error),
              ),
            ),
          ),
      }),
      runPromise,
    );
  },

  /**
   * Validate form field with custom validator
   */
  validateField: <T>(
    value: T,
    validator: (value: T) => boolean,
    errorMessage: string,
  ): string | null => pipe(value, (v) => (validator(v) ? null : errorMessage)),

  /**
   * Validate required field
   */
  validateRequired: <T>(value: T, fieldName: string): string | null =>
    pipe(
      fromNullable(value),
      match({
        onNone: () => `${fieldName} es requerido`,
        onSome: (val) => {
          if (typeof val === "string" && val.trim() === "") {
            return `${fieldName} es requerido`;
          }
          return null;
        },
      }),
    ),

  /**
   * Validate field length
   */
  validateLength: (
    value: string,
    min: number,
    max: number,
    fieldName: string,
  ): string | null =>
    pipe(value, (v) => {
      if (v.length < min)
        return `${fieldName} debe tener al menos ${min} caracteres`;
      if (v.length > max)
        return `${fieldName} debe tener máximo ${max} caracteres`;
      return null;
    }),

  /**
   * Validate positive number
   */
  validatePositiveNumber: (value: number, fieldName: string): string | null =>
    pipe(value, (v) =>
      v > 0 ? null : `${fieldName} debe ser un número positivo`,
    ),

  /**
   * Create form submit handler with error handling
   */
  createSubmitHandler:
    <T>(handler: (values: T) => void, onError?: (error: unknown) => void) =>
    (values: T) => {
      try {
        handler(values);
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          console.error("Form submission error:", error);
        }
      }
    },

  /**
   * Handle form field change with validation
   */
  handleFieldChange: <T>(
    form: {
      setFieldValue: (field: string, value: T) => void;
      clearFieldError: (field: string) => void;
    },
    field: string,
    value: T,
    validator?: (value: T) => boolean,
  ): void => {
    form.setFieldValue(field, value);
    if (validator && !validator(value)) {
      return;
    }
    form.clearFieldError(field);
  },

  /**
   * Create date change handler
   */
  createDateChangeHandler:
    (
      form: {
        setFieldValue: (field: string, value: Date | null) => void;
        clearFieldError: (field: string) => void;
      },
      field: string,
    ) =>
    (value: Date | string | null) => {
      const dateValue =
        value instanceof Date ? value : value ? new Date(value) : null;
      form.setFieldValue(field, dateValue);
      form.clearFieldError(field);
    },

  /**
   * Create event type button props
   */
  createEventTypeButtonProps: (
    currentType: "ingreso" | "egreso",
    buttonType: "ingreso" | "egreso",
    onTypeChange: (type: "ingreso" | "egreso") => void,
  ) => ({
    variant: (currentType === buttonType ? "filled" : "outline") as const,
    onClick: () => onTypeChange(buttonType),
    style: {
      backgroundColor:
        currentType === buttonType
          ? `var(--walletfy-${buttonType === "ingreso" ? "income" : "expense"})`
          : "transparent",
      borderColor: `var(--walletfy-${buttonType === "ingreso" ? "income" : "expense"})`,
      color:
        currentType === buttonType
          ? "white"
          : `var(--walletfy-${buttonType === "ingreso" ? "income" : "expense"})`,
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: "var(--walletfy-space-xs)",
    },
  }),

  /**
   * Create form button props based on mode
   */
  createFormButtonProps: (isEditing: boolean) => ({
    type: "submit" as const,
    className: isEditing ? "walletfy-btn-secondary" : "walletfy-btn-primary",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--walletfy-space-xs)",
      backgroundColor: isEditing ? "transparent" : "var(--walletfy-primary)",
      color: isEditing ? "var(--walletfy-primary)" : "white",
      border: isEditing ? "2px solid var(--walletfy-primary)" : "none",
    },
  }),

  /**
   * Create cancel button props
   */
  createCancelButtonProps: (onCancel: () => void) => ({
    variant: "subtle" as const,
    onClick: onCancel,
    className: "walletfy-btn-ghost",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--walletfy-space-xs)",
    },
  }),

  /**
   * Batch validation for multiple fields
   */
  batchValidate: <T extends Record<string, any>>(
    values: T,
    validators: Record<keyof T, (value: any) => string | null>,
  ): Record<keyof T, string | null> =>
    pipe(Object.keys(validators), (keys) =>
      keys.reduce(
        (acc, key) => ({
          ...acc,
          [key]: validators[key](values[key]),
        }),
        {} as Record<keyof T, string | null>,
      ),
    ),

  /**
   * Transform form data before submission
   */
  transformFormData: <T, R>(data: T, transformer: (data: T) => R): R =>
    pipe(data, transformer),

  /**
   * Create form reset handler
   */
  createResetHandler:
    (form: { reset: () => void }, onReset?: () => void) => () => {
      form.reset();
      onReset?.();
    },
};
