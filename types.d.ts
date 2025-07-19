// Global type declarations for Bun test
declare module "bun:test" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
  export function expect(value: any): {
    toBe(expected: any): void;
    toEqual(expected: any): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toContain(expected: any): void;
    toHaveLength(length: number): void;
    toThrow(expected?: string | RegExp | Error): void;
    toHaveBeenCalled(): void;
    toHaveBeenCalledWith(...args: any[]): void;
    toHaveBeenCalledTimes(count: number): void;
    toBeInTheDocument(): void;
    toHaveValue(value: any): void;
    toHaveTextContent(text: string | RegExp): void;
    toBeVisible(): void;
    toBeDisabled(): void;
    toBeEnabled(): void;
    toHaveAttribute(name: string, value?: string): void;
    toHaveClass(...classNames: string[]): void;
    toHaveStyle(style: Partial<CSSStyleDeclaration>): void;
  };
  export const vi: any;
  export function beforeAll(fn: () => void | Promise<void>): void;
  export function afterAll(fn: () => void | Promise<void>): void;
  export function beforeEach(fn: () => void | Promise<void>): void;
  export function afterEach(fn: () => void | Promise<void>): void;
}
