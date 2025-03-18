import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SortState {
  sortType: string | null;
  sortOrder: string | null;
}

const initialState: SortState = {
  sortType: null,
  sortOrder: null,
};

const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSortType: (state, action: PayloadAction<string | null>) => {
      state.sortType = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<string | null>) => {
      state.sortOrder = action.payload;
    },
    clearSort: (state) => {
      state.sortType = null;
      state.sortOrder = null;
    },
  },
});

export const { setSortType, setSortOrder, clearSort } = sortSlice.actions;
export default sortSlice.reducer;
