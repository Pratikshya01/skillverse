import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

import authReducer from '../features/auth/authSlice';
import courseReducer from '../features/courses/courseSlice';
import userReducer from '../features/user/userSlice';
import categoryReducer from '../features/categories/categorySlice';
import cartReducer from '../features/cart/cartSlice';
import paymentReducer from '../features/payment/paymentSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['payment'],
};

const appReducer = combineReducers({
  auth: authReducer,
  courses: courseReducer,
  user: userReducer,
  categories: categoryReducer,
  cart: cartReducer,
  payment: paymentReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    // Clear persisted state
    storage.removeItem('persist:root');
    // Reset state to initial state
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store); 