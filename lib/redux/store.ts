import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import filtersReducer from "@/slices/filterSlice";
import sortsReducer from "@/slices/sortSlice";
import searchReducer from "@/slices/searchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    sort: sortsReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
