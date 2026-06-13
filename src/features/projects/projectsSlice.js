import { createSlice } from '@reduxjs/toolkit';

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    jobsByProject: {},
    jobsLoading: {}, 
    expandedProjects: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    hasMore: true,
  },
  reducers: {
    setProjects: (state, action) => {
      state.list = action.payload.projects;
      state.total = action.payload.total;
      state.loading = false;
    },
    appendProjects: (state, action) => {
      state.list = [...state.list, ...action.payload.projects];
      state.loading = false;
    },
    setTotal: (state, action) => { state.total = action.payload.total; },
    addProject: (state, action) => {
      state.list = [action.payload.projects, ...state.list];
    },
    updateProjectInList: (state, action) => {
      const idx = state.list.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.list[idx] = action.payload;
    },
    removeProject: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
    setProjectJobs: (state, action) => {
      const { projectId, jobs } = action.payload;
      state.jobsByProject[projectId] = jobs;
      state.jobsLoading[projectId] = false;
    },
    appendProjectJobs: (state, action) => {
      const { projectId, jobs } = action.payload;
      state.jobsByProject[projectId] = [
        ...(state.jobsByProject[projectId] || []),
        ...jobs,
      ];
      state.jobsLoading[projectId] = false;
    },
    prependProjectJob: (state, action) => {
      const { projectId, job } = action.payload;
      state.jobsByProject[projectId] = [
        job,
        ...(state.jobsByProject[projectId] || []),
      ];
    },
    updateProjectJob: (state, action) => {
      const { projectId, job } = action.payload;
      const list = state.jobsByProject[projectId] || [];
      const idx = list.findIndex((j) => j.id === job.id);
      if (idx !== -1) list[idx] = { ...list[idx], ...job };
    },
    setJobsLoading: (state, action) => {
      const { projectId, loading } = action.payload;
      state.jobsLoading[projectId] = loading;
    },
    toggleProjectExpanded: (state, action) => {
      const id = action.payload;
      if (state.expandedProjects.includes(id)) {
        state.expandedProjects = state.expandedProjects.filter((x) => x !== id);
      } else {
        state.expandedProjects = [...state.expandedProjects, id];
      }
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; state.loading = false; },
    setPage: (state, action) => { state.page = action.payload; },
    setHasMore: (state, action) => { state.hasMore = action.payload; },
  },
});

export const {
  setProjects, appendProjects, setTotal, addProject, updateProjectInList, removeProject,
  setProjectJobs, appendProjectJobs, prependProjectJob, updateProjectJob, setJobsLoading,
  toggleProjectExpanded, setProjectExpanded,
  setLoading, setError, setPage, setHasMore,
} = projectsSlice.actions;

export const selectProjects = (state) => state.projects.list;
export const selectProjectsLoading = (state) => state.projects.loading;
export const selectProjectsHasMore = (state) => state.projects.hasMore;
export const selectProjectJobs = (projectId) => (state) =>
  state.projects.jobsByProject[projectId] || [];
export const selectProjectJobsLoading = (projectId) => (state) =>
  !!state.projects.jobsLoading[projectId];
export const selectExpandedProjects = (state) => state.projects.expandedProjects;


export default projectsSlice.reducer;