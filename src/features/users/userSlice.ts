// src/features/user/userSlice.ts (or your actual path)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../../app/store'; // Adjust path to your RootState if necessary

export interface User {
    full_name: string;
    email: string;
    role: string; // This is the role we need
    user_id: number;
    address: string;
    phone_number?: string;
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
    name: 'user', // Matches the key in the root reducer
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<UserState>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            // Optional: Persist token to localStorage
            if (action.payload.token) {
                localStorage.setItem('authToken', action.payload.token);
            }
        },
        logOut(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem('authToken');
        }
    }
})

export const { loginSuccess, logOut } = userSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.user.user;
export const selectCurrentToken = (state: RootState) => state.user.token;
export const selectIsAuthenticated = (state: RootState) => !!(state.user.token && state.user.user); // User must exist too
export const selectCurrentUserId = (state: RootState): number | undefined => state.user.user?.user_id;
export const selectUserRole = (state: RootState): string | undefined => state.user.user?.role; // <-- ADDED THIS SELECTOR

export default userSlice.reducer;