// src/app/store.ts (or your store setup file) - UPDATED

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// all API slices
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
//import   news  api
import {newsApi}  from   "../features/news/newsAPI";


import userReducer from "../features/users/userSlice";
import onlineStatusReducer from "../features/online/online";

// Persist configuration
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"], 
};

// Combine reducers
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
    [notificationsAPI.reducerPath]: notificationsAPI.reducer, // <<< 2. ADD the new notifications reducer
    [newsApi.reducerPath]: newsApi.reducer, 

    // Regular Reducers
    user: userReducer,
    onlineStatus: onlineStatusReducer,
});

//  persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//  store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/PURGE'],
            },
        }).concat(
            // Concatenate all API middlewares
            newsApi.middleware,
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
            notificationsAPI.middleware 
        )
});

export const persistor = persistStore(store);

// Define RootState based on the rootReducer to get the clean state shape
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;