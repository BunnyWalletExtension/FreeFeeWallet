import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PayloadObject {
    index: number;
    amount: number;
}

interface BalanceState {
    value: number[];
}

const initialState: BalanceState = {
    value: [0.77823, 0.11326, 0.45891, 0.23902, 0.43982, 0.49532, 0.23456],
};

const balanceSlice = createSlice({
    name: 'balance',
    initialState,
    reducers: {
        incrementByAmount(state, action: PayloadAction<PayloadObject>) {
            state.value[action.payload.index] += action.payload.amount;
        },
    },
});

export const { incrementByAmount } = balanceSlice.actions;
export default balanceSlice.reducer;
