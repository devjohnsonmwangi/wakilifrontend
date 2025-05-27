import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../../app/store'; // Adjust path to your RootState if necessary

export interface User {
    full_name: string;
    email: string;
    role: string;
    user_id: number; // This is the ID we need
    address: string;
    phone_number?: string; // Optional, if your API returns it
    profile_picture: string;
}

export interface UserState {
    token: string | null;
    user: User | null;
}

const initialState: UserState = {
    token: null,
    user: null,
}

const userSlice = createSlice({
    name: 'user', // It's good practice to match the slice name ('user') with the key in the root reducer
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<UserState>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        logOut(state) {
            state.token = null;
            state.user = null;
        }
    }
})

export const { loginSuccess, logOut } = userSlice.actions;

// Selectors
// Make sure 'user' here matches the key you use for this slice in your root reducer (configureStore)
export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectCurrentToken = (state: RootState) => state.user.token;
export const selectIsAuthenticated = (state: RootState) => !!state.user.token && !!state.user.user;
export const selectCurrentUserId = (state: RootState): number | undefined => state.user.user?.user_id;

export default userSlice.reducer;