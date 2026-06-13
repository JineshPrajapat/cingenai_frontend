import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '../components/layout/AppShell';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import NewProject from '../pages/NewProject';
import Studio from '../pages/Studio';
import ProjectSettings from '../pages/ProjectSettings';
import ProjectHistory from '../pages/ProjectHistory';
import JobDetail from '../pages/JobDetail';
import { store } from '../app/store';

const AuthGuard = ({ children }) => {
  const isAuth = store.getState().auth.isAuthenticated;
  return isAuth ? <Navigate to="/dashboard" replace /> : children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/projects/new', element: <NewProject /> },
          { path: '/projects/:projectId', element: <Studio /> },
          { path: '/projects/:projectId/settings', element: <ProjectSettings /> },
          { path: '/projects/:projectId/history', element: <ProjectHistory /> },
          { path: '/projects/:projectId/jobs/:jobId', element: <JobDetail /> },
        ],
      },
    ],
  },
]);

export default router;