import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface TxsState {
    show: boolean;
}

const initialState: TxsState = {
    show: false,
};

const txsSlice = createSlice({
    name: 'txs',
    initialState,
    reducers: {
        changeShowTxs(state, action: PayloadAction<boolean>) {
            state.show = action.payload;
        },
    },
});

export const { changeShowTxs } = txsSlice.actions;
export default txsSlice.reducer;
