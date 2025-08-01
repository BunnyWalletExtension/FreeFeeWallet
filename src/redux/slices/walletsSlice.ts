import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WalletsState {
    value: Object[];
    indexWallet: number;
}

const initialState: WalletsState = {
    value: [],
    indexWallet: -1,
};

const walletsSlice = createSlice({
    name: 'wallets',
    initialState,
    reducers: {
        changeWallets(state, action: PayloadAction<Object[]>) {
            state.value = action.payload;
        },
        changeIndexWallet(state, action: PayloadAction<number>) {
            state.indexWallet = action.payload;
        }
    },
});

export const { changeWallets, changeIndexWallet } = walletsSlice.actions;
export default walletsSlice.reducer;
