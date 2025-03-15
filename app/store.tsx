import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "@/slices/filterSlice";
import sortsReducer from "@/slices/sortSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    sort: sortsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
