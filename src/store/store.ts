import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/auth.slice';
import accountsReducer from './features/accounts/accounts.slice'
import dashboardReducer from './features/dashboard/dashboard.slice'
import categoriesReducer from './features/categories/categories.slice'
import transactionsReducer from './features/transactions/transactions.slice'
import budgetsReducer from './features/budgets/budgets.slice'
import recurringReducer from './features/recurring/recurring.slice'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
}

const rootReducer = combineReducers({
    auth: authReducer,
    accounts: accountsReducer,
    dashboard: dashboardReducer,
    categories: categoriesReducer, 
    transactions: transactionsReducer,
    budgets: budgetsReducer,
    recurring: recurringReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:{
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })

})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
