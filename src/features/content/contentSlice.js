import { createSlice } from '@reduxjs/toolkit';

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    scripts: {},      // keyed by jobId
    audioFiles: {},
    imageFiles: {},
    videos: {},
    loading: {},
  },
  reducers: {
    setScript: (state, action) => {
      const { jobId, script } = action.payload;
      state.scripts[jobId] = script;
    },
    setAudioFiles: (state, action) => {
      const { jobId, files } = action.payload;
      state.audioFiles[jobId] = files;
    },
    setImageFiles: (state, action) => {
      const { jobId, files } = action.payload;
      state.imageFiles[jobId] = files;
    },
    setVideo: (state, action) => {
      const { jobId, video } = action.payload;
      state.videos[jobId] = video;
    },
    setContentLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
  },
});

export const { setScript, setAudioFiles, setImageFiles, setVideo, setContentLoading } =
  contentSlice.actions;

export const selectScript = (jobId) => (state) => state.content.scripts[jobId];
export const selectAudioFiles = (jobId) => (state) => state.content.audioFiles[jobId];
export const selectImageFiles = (jobId) => (state) => state.content.imageFiles[jobId];
export const selectVideo = (jobId) => (state) => state.content.videos[jobId];

export default contentSlice.reducer;