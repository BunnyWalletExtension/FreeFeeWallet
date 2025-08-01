import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ChainState {
    curr: string;
    rpc: string;
}

const initialState: ChainState = {
    curr: 'Solana Devnet',
    rpc: 'https://api.devnet.solana.com',
};

const chainSlice = createSlice({
    name: 'chain',
    initialState,
    reducers: {
        changeCurrentChain: (state, action: PayloadAction<string>) => {
            state.curr = action.payload;
        },
        changeRpc: (state, action: PayloadAction<string>) => {
            state.rpc = action.payload;
        }
    },
});

export const { changeCurrentChain, changeRpc } = chainSlice.actions;
export default chainSlice.reducer;
