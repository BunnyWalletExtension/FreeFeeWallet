import { configureStore } from '@reduxjs/toolkit';
import pageReducer from './slices/pageSlice';
import passwordSlice from './slices/passwordSlice';
import walletsSlice from './slices/walletsSlice';
import chainSlice from './slices/chainSlice';
import txsSlice from './slices/txsSlice';
import balanceSlice from './slices/balanceSlice';

export const store = configureStore({
    reducer: {
        page: pageReducer,
        password: passwordSlice,
        wallets: walletsSlice,
        chain: chainSlice,
        txs: txsSlice,
        balance: balanceSlice,
    },
});
