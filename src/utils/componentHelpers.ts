import { pipe, Option, Match } from "effect";
import React, { useCallback, useMemo } from "react";

const { fromNullable, match } = Option;
const { value, when, orElse } = Match;

/**
 * Component utilities using Effect-ts patterns
 * Provides reusable React component patterns and abstractions
 */
export const componentHelpers = {
  /**
   * Higher-order component for memoization
   */
  withMemo: <T extends Record<string, any>>(
    Component: React.ComponentType<T>,
  ): React.ComponentType<T> => React.memo(Component),

  /**
   * Higher-order component for error boundary
   */
  withErrorBoundary: <T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    fallback: React.ComponentType<{ error: Error }>,
  ): React.ComponentType<T> => {
    const WrappedComponent = (props: T) => {
      const [error, setError] = React.useState<Error | null>(null);

      React.useEffect(() => {
        const handleError = (error: ErrorEvent) => {
          setError(new Error(error.message));
        };

        window.addEventListener("error", handleError);
        return () => window.removeEventListener("error", handleError);
      }, []);

      if (error) {
        return React.createElement(fallback, { error });
      }

      return React.createElement(Component, props);
    };

    return React.memo(WrappedComponent);
  },

  /**
   * Create conditional callback using Option
   */
  createConditionalCallback: <T>(
    callback: ((value: T) => void) | undefined,
    value: T,
  ): (() => void) | undefined =>
    pipe(
      fromNullable(callback),
      match({
        onNone: () => undefined,
        onSome: (fn) => () => fn(value),
      }),
    ),

  /**
   * Create toggle state handler
   */
  createToggleHandler: (
    state: boolean,
    setState: (value: boolean) => void,
  ): (() => void) => useCallback(() => setState(!state), [state, setState]),

  /**
   * Create state with local storage sync
   */
  createPersistedState: <T>(
    key: string,
    defaultValue: T,
  ): [T, (value: T) => void] => {
    const [state, setState] = React.useState<T>(() => {
      try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      } catch {
        return defaultValue;
      }
    });

    const setPersistedState = useCallback(
      (value: T) => {
        setState(value);
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
          console.error(`Failed to persist state for key ${key}:`, error);
        }
      },
      [key],
    );

    return [state, setPersistedState];
  },

  createDebouncedCallback: <T extends any[]>(
    callback: (...args: T) => void,
    delay: number,
  ): ((...args: T) => void) => {
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

    return useCallback(
      (...args: T) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => callback(...args), delay);
      },
      [callback, delay],
    );
  },

  /**
   * Create throttled callback
   */
  createThrottledCallback: <T extends any[]>(
    callback: (...args: T) => void,
    delay: number,
  ): ((...args: T) => void) => {
    const lastCallRef = React.useRef<number>(0);

    return useCallback(
      (...args: T) => {
        const now = Date.now();
        if (now - lastCallRef.current >= delay) {
          lastCallRef.current = now;
          callback(...args);
        }
      },
      [callback, delay],
    );
  },

  /**
   * Create async callback with loading state
   */
  createAsyncCallback: <T extends any[]>(
    callback: (...args: T) => Promise<void>,
  ): {
    execute: (...args: T) => Promise<void>;
    loading: boolean;
    error: Error | null;
  } => {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<Error | null>(null);

    const execute = useCallback(
      async (...args: T) => {
        setLoading(true);
        setError(null);
        try {
          await callback(...args);
        } catch (err) {
          setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
          setLoading(false);
        }
      },
      [callback],
    );

    return { execute, loading, error };
  },

  /**
   * Create modal state handler
   */
  createModalHandler: <T>(): {
    opened: boolean;
    selectedItem: T | null;
    open: (item?: T) => void;
    close: () => void;
  } => {
    const [opened, setOpened] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<T | null>(null);

    const open = useCallback((item?: T) => {
      setSelectedItem(item || null);
      setOpened(true);
    }, []);

    const close = useCallback(() => {
      setSelectedItem(null);
      setOpened(false);
    }, []);

    return { opened, selectedItem, open, close };
  },

  /**
   * Create search state handler
   */
  createSearchHandler: <T>(
    items: T[],
    searchFn: (item: T, query: string) => boolean,
  ): {
    query: string;
    setQuery: (query: string) => void;
    filteredItems: T[];
    clearSearch: () => void;
  } => {
    const [query, setQuery] = React.useState("");

    const filteredItems = useMemo(() => {
      if (!query.trim()) return items;
      return items.filter((item) => searchFn(item, query));
    }, [items, query, searchFn]);

    const clearSearch = useCallback(() => setQuery(""), []);

    return { query, setQuery, filteredItems, clearSearch };
  },

  /**
   * Create form state handler
   */
  createFormHandler: <T extends Record<string, any>>(
    initialValues: T,
    onSubmit: (values: T) => void,
  ): {
    values: T;
    setValue: (field: keyof T, value: any) => void;
    handleSubmit: () => void;
    reset: () => void;
    isDirty: boolean;
  } => {
    const [values, setValues] = React.useState<T>(initialValues);

    const setValue = useCallback((field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = useCallback(() => {
      onSubmit(values);
    }, [values, onSubmit]);

    const reset = useCallback(() => {
      setValues(initialValues);
    }, [initialValues]);

    const isDirty = useMemo(() => {
      return JSON.stringify(values) !== JSON.stringify(initialValues);
    }, [values, initialValues]);

    return { values, setValue, handleSubmit, reset, isDirty };
  },

  /**
   * Create pagination handler
   */
  createPaginationHandler: <T>(
    items: T[],
    pageSize: number = 10,
  ): {
    currentPage: number;
    totalPages: number;
    paginatedItems: T[];
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    canGoNext: boolean;
    canGoPrev: boolean;
  } => {
    const [currentPage, setCurrentPage] = React.useState(1);

    const totalPages = Math.ceil(items.length / pageSize);

    const paginatedItems = useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return items.slice(start, end);
    }, [items, currentPage, pageSize]);

    const goToPage = useCallback(
      (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
      },
      [totalPages],
    );

    const nextPage = useCallback(() => {
      goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const prevPage = useCallback(() => {
      goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    const canGoNext = currentPage < totalPages;
    const canGoPrev = currentPage > 1;

    return {
      currentPage,
      totalPages,
      paginatedItems,
      goToPage,
      nextPage,
      prevPage,
      canGoNext,
      canGoPrev,
    };
  },

  /**
   * Create conditional renderer using Match
   */
  createConditionalRenderer: <T>(
    condition: boolean,
    data: T | null,
    loadingComponent: React.ComponentType,
    errorComponent: React.ComponentType<{ error: Error }>,
    successComponent: React.ComponentType<{ data: T }>,
  ): React.ReactNode =>
    pipe(
      value({ condition, data }),
      when({ condition: false }, () => React.createElement(loadingComponent)),
      when({ condition: true, data: null }, () =>
        React.createElement(errorComponent, { error: new Error("No data") }),
      ),
      orElse(({ data }) =>
        React.createElement(successComponent, { data: data! }),
      ),
    ),

  /**
   * Create compound component builder
   */
  createCompoundComponent: <T extends Record<string, React.ComponentType<any>>>(
    components: T,
  ): T => components,

  /**
   * Create context provider wrapper
   */
  createContextProvider: <T>(
    Context: React.Context<T>,
    useContextHook: () => T,
  ): React.ComponentType<{ children: React.ReactNode }> => {
    return React.memo(({ children }) => {
      const contextValue = useContextHook();
      return React.createElement(
        Context.Provider,
        { value: contextValue },
        children,
      );
    });
  },
};
