import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  offset: 0,
  isInitialCall: true,
  hasMore: true,
  error: "",
};

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async ({ limit, offset }) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const body = JSON.stringify({
        limit,
        offset: offset * limit,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body,
      };
      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

const infintieScrollerSlice = createSlice({
  name: "infintieScroller",
  initialState: initialState,
  reducers: {
    changeOffset: (state) => {
      state.offset = state.offset + 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchJobs.pending, (state) => {
      state.loading = true;
      state.isInitialCall = false;
    });
    builder.addCase(fetchJobs.fulfilled, (state, action) => {
      state.loading = false;

      state.isInitialCall = false;
      state.data = [...state.data, ...action.payload.jdList];
      if (action.payload.totalCount <= state.data.length) {
        state.hasMore = false;
      }
    });
    builder.addCase(fetchJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.data = [];
    });
  },
});

export default infintieScrollerSlice.reducer;
export const { changeOffset } = infintieScrollerSlice.actions;
export const selectOffset = (state) => state.infiniteScroller.offset;
export const selectJobs = (state) => state.infiniteScroller.data;
export const selectLoading = (state) => state.infiniteScroller.loading;
export const selectError = (state) => state.infiniteScroller.error;
export const selectHasMore = (state) => state.infiniteScroller.hasMore;
export const selectIsInitialCall = (state) =>
  state.infiniteScroller.isInitialCall;
