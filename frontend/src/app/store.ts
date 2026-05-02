import { configureStore } from '@reduxjs/toolkit';
import industryReducer from '@/core/industry/slice/industrySlice';
import authReducer from '@/core/auth/slice/authSlice';

export const store = configureStore({
  reducer: {
    industry: industryReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
