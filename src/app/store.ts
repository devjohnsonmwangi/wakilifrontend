// src/app/store.ts

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// All API slices
import { usersAPI } from "../features/users/usersAPI";
import { caseAndPaymentAPI } from "../features/case/caseAPI";
import { paymentAPI } from "../features/payment/paymentAPI";
import { logAPI } from "../features/log/logsapi";
import { feedbackAPI } from "../features/feedback/feedbackapi";
import { TicketAPI } from "../features/Tickets/AllTickets";
import { eventAndReminderAPI } from "../features/events/events";
import { eventReminderAPI } from "../features/events/eventreminder";
import { locationBranchAPI } from "../features/branchlocation/branchlocationapi";
import { caseDocumentAPI } from "../features/casedocument/casedocmentapi";
import { appointmentAPI } from "../features/appointment/appointmentapi";
import { loginAPI } from "../features/login/loginAPI";
import { teamApi } from "../features/team/teamApi";
import { chatsAPI } from "../features/chats/chatsAPI";
import { notificationsAPI } from "../features/notifications/notificationAPI";
import { newsApi } from "../features/news/newsAPI";

// Regular Redux Slices
import userReducer from "../features/users/userSlice";
import onlineStatusReducer from "../features/online/online";

// --- Persist Configuration ---
// This tells redux-persist what to save.
const persistConfig = {
    key: "root",
    storage,
    version: 1, // It's good practice to version your persisted state.
    
    // Whitelist: The slices of state you WANT to save to storage.
    // We are now saving the user auth slice and the state of ALL API calls.
    whitelist: [
        "user", // Persist user auth info (like tokens, user details)
        usersAPI.reducerPath,
        caseAndPaymentAPI.reducerPath,
        paymentAPI.reducerPath,
        logAPI.reducerPath,
        feedbackAPI.reducerPath,
        TicketAPI.reducerPath,
        eventAndReminderAPI.reducerPath,
        eventReminderAPI.reducerPath,
        locationBranchAPI.reducerPath,
        caseDocumentAPI.reducerPath,
        appointmentAPI.reducerPath,
        loginAPI.reducerPath,
        teamApi.reducerPath,
        chatsAPI.reducerPath,
        notificationsAPI.reducerPath,
        newsApi.reducerPath,
    ],
    
    // Blacklist: The slices of state you DON'T want to save.
    // 'onlineStatus' should reflect the real-time status, not a saved one.
    blacklist: ["onlineStatus"],
};

// Combine all reducers
const rootReducer = combineReducers({
    // API Reducers
    [teamApi.reducerPath]: teamApi.reducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
    [caseAndPaymentAPI.reducerPath]: caseAndPaymentAPI.reducer,
    [paymentAPI.reducerPath]: paymentAPI.reducer,
    [logAPI.reducerPath]: logAPI.reducer,
    [feedbackAPI.reducerPath]: feedbackAPI.reducer,
    [TicketAPI.reducerPath]: TicketAPI.reducer,
    [eventAndReminderAPI.reducerPath]: eventAndReminderAPI.reducer,
    [eventReminderAPI.reducerPath]: eventReminderAPI.reducer,
    [locationBranchAPI.reducerPath]: locationBranchAPI.reducer,
    [caseDocumentAPI.reducerPath]: caseDocumentAPI.reducer,
    [appointmentAPI.reducerPath]: appointmentAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
    [chatsAPI.reducerPath]: chatsAPI.reducer,
    [notificationsAPI.reducerPath]: notificationsAPI.reducer,

    [newsApi.reducerPath]: newsApi.reducer,

    // Regular Reducers
    user: userReducer,
    onlineStatus: onlineStatusReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // This is required to ignore the non-serializable actions that redux-persist dispatches.
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(
            // Concatenate all API middlewares
            usersAPI.middleware,
            caseAndPaymentAPI.middleware,
            paymentAPI.middleware,
            logAPI.middleware,
            feedbackAPI.middleware,
            TicketAPI.middleware,
            eventAndReminderAPI.middleware,
            eventReminderAPI.middleware,
            locationBranchAPI.middleware,
            caseDocumentAPI.middleware,
            appointmentAPI.middleware,
            loginAPI.middleware,
            teamApi.middleware,
            chatsAPI.middleware,
            notificationsAPI.middleware,
            newsApi.middleware
        ),
});

// Create the persistor
export const persistor = persistStore(store);

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;