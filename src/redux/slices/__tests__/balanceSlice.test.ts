import { describe, it, expect } from "bun:test";
import balanceReducer, {
  setInitialBalance,
  resetInitialBalance,
} from "../balanceSlice";

describe("balanceSlice", () => {
  const initialState = {
    initialBalance: 0,
  };

  describe("setInitialBalance", () => {
    it("should set initial balance correctly", () => {
      const action = setInitialBalance(1000);
      const newState = balanceReducer(initialState, action);

      expect(newState.initialBalance).toBe(1000);
    });

    it("should handle positive balance", () => {
      const action = setInitialBalance(5000.5);
      const newState = balanceReducer(initialState, action);

      expect(newState.initialBalance).toBe(5000.5);
    });

    it("should handle negative balance", () => {
      const action = setInitialBalance(-500);
      const newState = balanceReducer(initialState, action);

      expect(newState.initialBalance).toBe(-500);
    });

    it("should handle zero balance", () => {
      const action = setInitialBalance(0);
      const newState = balanceReducer(initialState, action);

      expect(newState.initialBalance).toBe(0);
    });

    it("should update existing balance", () => {
      const stateWithBalance = { initialBalance: 1000 };
      const action = setInitialBalance(2000);
      const newState = balanceReducer(stateWithBalance, action);

      expect(newState.initialBalance).toBe(2000);
    });
  });

  describe("resetInitialBalance", () => {
    it("should reset initial balance to zero", () => {
      const stateWithBalance = { initialBalance: 1000 };
      const action = resetInitialBalance();
      const newState = balanceReducer(stateWithBalance, action);

      expect(newState.initialBalance).toBe(0);
    });

    it("should reset negative balance to zero", () => {
      const stateWithBalance = { initialBalance: -500 };
      const action = resetInitialBalance();
      const newState = balanceReducer(stateWithBalance, action);

      expect(newState.initialBalance).toBe(0);
    });

    it("should not change state if already zero", () => {
      const action = resetInitialBalance();
      const newState = balanceReducer(initialState, action);

      expect(newState.initialBalance).toBe(0);
    });
  });
});
