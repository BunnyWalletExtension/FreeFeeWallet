import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PageState {
    value: string;
}

const initialState: PageState = {
    value: 'login-page',
};

const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        changePage(state, action: PayloadAction<string>) {
            state.value = action.payload;
        }
    },
});

export const { changePage } = pageSlice.actions;
export default pageSlice.reducer;
