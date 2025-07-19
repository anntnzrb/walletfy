import { describe, it, expect } from "bun:test";
import { componentHelpers } from "../componentHelpers";

describe("componentHelpers", () => {
  describe("withMemo", () => {
    it("should return a memoized component", () => {
      const TestComponent = () => "Test";
      const MemoizedComponent = componentHelpers.withMemo(TestComponent);

      expect(MemoizedComponent).toBeDefined();
    });
  });

  describe("createConditionalCallback", () => {
    it("should return undefined when callback is undefined", () => {
      const result = componentHelpers.createConditionalCallback(
        undefined,
        "test",
      );
      expect(result).toBeUndefined();
    });

    it("should return a function that calls the callback with value when callback is defined", () => {
      let calledValue: string | undefined;
      const mockCallback = (value: string) => {
        calledValue = value;
      };
      const result = componentHelpers.createConditionalCallback(
        mockCallback,
        "test",
      );

      expect(result).toBeTypeOf("function");
      result?.();

      expect(calledValue).toBe("test");
    });
  });
});
