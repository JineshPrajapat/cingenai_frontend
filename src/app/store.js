import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectsReducer from '../features/projects/projectsSlice';
import projectReducer from '../features/project/projectSlice';
import jobsReducer from '../features/jobs/jobsSlice';
import contentReducer from '../features/content/contentSlice';
import wsReducer from '../features/ws/wsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    project: projectReducer,
    jobs: jobsReducer,
    content: contentReducer,
    ws: wsReducer,
    ui: uiReducer,
  },
});

export default store;