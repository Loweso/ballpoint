import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  selectedCategories: string[];
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

const initialState: FiltersState = {
  selectedCategories: [],
  dateRange: {
    startDate: null,
    endDate: null,
  },
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedCategories = action.payload;
    },
    setDateRange: (
      state,
      action: PayloadAction<{
        startDate: string | null;
        endDate: string | null;
      }>
    ) => {
      state.dateRange = action.payload;
    },
    clearFilters: (state) => {
      state.selectedCategories = [];
      state.dateRange = { startDate: null, endDate: null };
    },
  },
});

export const { setSelectedCategories, setDateRange, clearFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
