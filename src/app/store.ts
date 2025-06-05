import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Importing all API slices
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
import { chatsAPI } from "../features/chats/chatsAPI"; // <<< ADDED chatsAPI IMPORT

// Importing regular slices
import userReducer from "../features/users/userSlice"; // Assuming userSlice exports the reducer directly

// Persist configuration
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"], // only the user state (which includes token and user object) will be persisted
};

// Combine reducers
const rootReducer = combineReducers({
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
    [chatsAPI.reducerPath]: chatsAPI.reducer, // <<< ADDED chatsAPI REDUCER
    user: userReducer, // Your user slice reducer
});

// Add persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // It's recommended to ignore specific actions from redux-persist
                // rather than disabling serializableCheck entirely if possible.
                // However, if you have non-serializable data elsewhere, false might be necessary.
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/PURGE'],
            },
        })
            .concat(usersAPI.middleware)
            .concat(caseAndPaymentAPI.middleware)
            .concat(paymentAPI.middleware)
            .concat(logAPI.middleware)
            .concat(feedbackAPI.middleware)
            .concat(TicketAPI.middleware)
            .concat(eventAndReminderAPI.middleware)
            .concat(eventReminderAPI.middleware)
            .concat(locationBranchAPI.middleware)
            .concat(caseDocumentAPI.middleware)
            .concat(appointmentAPI.middleware)
            .concat(loginAPI.middleware)
            .concat(teamApi.middleware)
            .concat(chatsAPI.middleware), // <<< ADDED chatsAPI MIDDLEWARE
});

export const persistor = persistStore(store); // Renamed from persistedStore for common convention

// Define RootState based on the rootReducer to get the clean state shape
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;