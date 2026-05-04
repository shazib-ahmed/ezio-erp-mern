import { configureStore } from '@reduxjs/toolkit';
import industryReducer from '@/core/industry/slice/industrySlice';
import authReducer from '@/core/auth/slice/authSlice';
import tenantsReducer from '@/core/tenants/slice/tenantsSlice';

export const store = configureStore({
  reducer: {
    industry: industryReducer,
    auth: authReducer,
    tenants: tenantsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
