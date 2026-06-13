import { createSlice } from '@reduxjs/toolkit';

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    total: 0,
  },
  reducers: {
    setJobs: (state, action) => { state.list = action.payload.jobs; state.loading = false; },
    appendJobs: (state, action) => { state.list = [...state.list, ...action.payload]; state.loading = false; },
    setTotal: (state, action) => { state.total = action.payload.total; },
    setJob: (state, action) => { 
      console.log("action.payload", action.payload)
      state.current = action.payload; state.loading = false; },
    updateJobInList: (state, action) => {
          const j = action.payload;
          const idx = state.list.findIndex((x) => x.id === j.cj_id);
          if (idx !== -1) state.list[idx] = { ...state.list[idx], ...j };
          if (state.current?.id === j.id) state.current = { ...state.current, ...j };
        },
    updateJobStatus: (state, action) => {
      const { jobId, status, current_step } = action.payload;
      if (state.current?.id === jobId) {
        state.current.status = status;
        if (current_step !== undefined) state.current.current_step = current_step;
      }
      const idx = state.list.findIndex((j) => j.id === jobId);
      if (idx !== -1) {
        state.list[idx].status = status;
        if (current_step !== undefined) state.list[idx].current_step = current_step;
      }
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; },
    setPage: (state, action) => { state.page = action.payload; },
    setHasMore: (state, action) => { state.hasMore = action.payload; },
  },
});

export const {
  setJobs, appendJobs, setTotal, setJob, updateJobInList, updateJobStatus,
  setLoading, setError, setPage, setHasMore,
} = jobsSlice.actions;

export const selectJobs = (state) => state.jobs.list;
export const selectJob = (state) => state.jobs.current;
export const selectJobsLoading = (state) => state.jobs.loading;
export const selectJobsHasMore = (state) => state.jobs.hasMore;
export const selectJobsTotal = (state) => state.jobs.total;

export default jobsSlice.reducer;