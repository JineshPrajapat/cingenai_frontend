import { createSlice } from '@reduxjs/toolkit';

const wsSlice = createSlice({
  name: 'ws',
  initialState: {
    connected: false,
    events: {}, // keyed by job_id
  },
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    handleWSEvent: (state, action) => {
      const event = action.payload;
      if (event.event === 'job_status' && event.cj_id) {
        state.events[event.cj_id] = event;
      }
    },
    clearJobEvent: (state, action) => {
      delete state.events[action.payload];
    },
    optimisticQueueJob: (state, action) => {
      const { job_id, project_id } = action.payload;
      state.events[job_id] = {
        event: 'job_status',
        job_id,
        project_id,
        status: 'QUEUED',
        current_step: 0,
        total_steps: 5,
        message: 'Waiting in queue...',
        timestamp: new Date().toISOString(),
      };
    },
    optimisticCancelJob: (state, action) => {
      const jobId = action.payload;
      if (state.events[jobId]) {
        state.events[jobId].status = 'CANCELLED';
      }
    },
  },
});

export const {
  setConnected,
  handleWSEvent,
  clearJobEvent,
  optimisticQueueJob,
  optimisticCancelJob,
} = wsSlice.actions;

export const selectWSConnected = (state) => state.ws.connected;
export const selectJobEvent = (jobId) => (state) => state.ws.events[jobId];
export const selectAllEvents = (state) => state.ws.events;

export default wsSlice.reducer;