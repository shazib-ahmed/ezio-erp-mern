import { configureStore } from '@reduxjs/toolkit';
import industryReducer from '@/core/industry/slice/industrySlice';
import authReducer from '@/core/auth/slice/authSlice';
import tenantsReducer from '@/core/tenants/slice/tenantsSlice';
import inventoryReducer from '@/modules/inventory/slice/inventorySlice';
import categoryReducer from '@/modules/inventory/slice/categorySlice';
import brandReducer from '@/modules/inventory/slice/brandSlice';

export const store = configureStore({
  reducer: {
    industry: industryReducer,
    auth: authReducer,
    tenants: tenantsReducer,
    inventory: inventoryReducer,
    category: categoryReducer,
    brand: brandReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
