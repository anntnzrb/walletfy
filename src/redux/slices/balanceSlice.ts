import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface BalanceState {
  initialBalance: number;
}

const initialState: BalanceState = {
  initialBalance: 0,
};

const balanceSlice = createSlice({
  name: "balance",
  initialState,
  reducers: {
    setInitialBalance: (state, action: PayloadAction<number>) => {
      state.initialBalance = action.payload;
    },
    resetInitialBalance: (state) => {
      state.initialBalance = 0;
    },
  },
});

export const { setInitialBalance, resetInitialBalance } = balanceSlice.actions;
export default balanceSlice.reducer;
