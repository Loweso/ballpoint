import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import filtersReducer from "@/slices/filterSlice";
import sortsReducer from "@/slices/sortSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    sort: sortsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
