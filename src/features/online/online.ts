import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface OnlineStatusState {
  // A simple and efficient key-value store: { [userId]: true, [anotherUserId]: true }
  onlineUsers: Record<number, boolean>;
}

export const initialState: OnlineStatusState = {
  onlineUsers: {},
};

const onlineStatusSlice = createSlice({
  name: 'onlineStatus',
  initialState,
  reducers: {
    // Action to set a single user's status (online or offline)
    setUserStatus(state, action: PayloadAction<{ userId: number; isOnline: boolean }>) {
      const { userId, isOnline } = action.payload;
      if (isOnline) {
        state.onlineUsers[userId] = true;
      } else {
        // It's more efficient to remove offline users than to store them as 'false'
        delete state.onlineUsers[userId];
      }
    },
    // Action to populate the entire list when we first connect
    setInitialOnlineUsers(state, action: PayloadAction<number[]>) {
      state.onlineUsers = {}; // Clear any previous state
      for (const userId of action.payload) {
        state.onlineUsers[userId] = true;
      }
    },
  },
});

export const { setUserStatus, setInitialOnlineUsers } = onlineStatusSlice.actions;

// Selector to easily check a user's status from any component
export const selectIsUserOnline = (state: RootState, userId: number) => !!state.onlineStatus.onlineUsers[userId];

export default onlineStatusSlice.reducer;