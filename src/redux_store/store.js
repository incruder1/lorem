import { configureStore } from "@reduxjs/toolkit";
import jobsApiSlice from "./slices/jobsApiSlice";
import infiniteScrollerSlice from "./slices/infiniteScrollerSlice";

export const store = configureStore({
  reducer: {
    jobsApi: jobsApiSlice,
    infiniteScroller: infiniteScrollerSlice,
  },
});
