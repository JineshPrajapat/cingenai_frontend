import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    current: null,
    messages: [],
    loading: false,
    messagesLoading: false,
    error: null,
    activeJobId: null,
  },
  reducers: {
    setProject: (state, action) => { state.current = action.payload; state.loading = false; },
    setMessages: (state, action) => { state.messages = action.payload.messages; state.messagesLoading = false; },
    appendMessage: (state, action) => { state.messages = [...state.messages, action.payload]; },
    replaceOptimisticMessage: (state, action) => {
      const { tempId, message } = action.payload;
      const idx = state.messages.findIndex((m) => m.id === tempId);
      if (idx !== -1) state.messages[idx] = message;
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    setActiveJobId: (state, action) => { state.activeJobId = action.payload; },
    setLoading: (state, action) => { state.loading = action.payload; },
    setMessagesLoading: (state, action) => { state.messagesLoading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; },
    clearProject: (state) => {
      state.current = null; state.messages = []; state.activeJobId = null; state.error = null;
    },
  },
});

export const {
  setProject, setMessages, appendMessage, replaceOptimisticMessage,
  removeMessage, setActiveJobId, setLoading, setMessagesLoading, setError, clearProject,
} = projectSlice.actions;

export const selectProject = (state) => state.project.current;
export const selectMessages = (state) => state.project.messages;
export const selectActiveJobId = (state) => state.project.activeJobId;
export const selectProjectLoading = (state) => state.project.loading;
export const selectMessagesLoading = (state) => state.project.messagesLoading;

export default projectSlice.reducer;