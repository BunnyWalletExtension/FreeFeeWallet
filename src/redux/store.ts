import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import pageReducer from './slices/pageSlice';
import passwordSlice from './slices/passwordSlice';
import walletsSlice from './slices/walletsSlice';
import chainSlice from './slices/chainSlice';
import txsSlice from './slices/txsSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        page: pageReducer,
        password: passwordSlice,
        wallets: walletsSlice,
        chain: chainSlice,
        txs: txsSlice,
    },
});
