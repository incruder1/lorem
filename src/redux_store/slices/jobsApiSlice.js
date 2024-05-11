import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  filters: {},
  companyName: "",
};

// reducers to set filters and company name from Filters component
const jobsApiSlice = createSlice({
  name: "jobsApi",
  initialState,
  reducers: {
    selectedFilters: (state, action) => {
      state.filters = action.payload;
    },
    setCompanyname: (state, action) => {
      state.companyName = action.payload;
    },
  },
});

export default jobsApiSlice.reducer;
export const { selectedFilters, setCompanyname } = jobsApiSlice.actions;
export const filters = (state) => state.jobsApi.filters;
export const companyName = (state) => state.jobsApi.companyName;
