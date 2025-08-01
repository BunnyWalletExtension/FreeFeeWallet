import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface PasswordState {
    value: string;
}

const initialState: PasswordState = {
    value: '',
};

const passwordSlice = createSlice({
    name: 'password',
    initialState,
    reducers: {
        changePassword(state, action: PayloadAction<string>) {
            state.value = action.payload;
        }
    },
});

export const { changePassword } = passwordSlice.actions;
export default passwordSlice.reducer;
