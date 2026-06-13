import { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme, Alert } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Topbar from './TopBar';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { selectWSConnected } from '../../features/ws/wsSlice';
import { socket } from '../../ws/socket';
import { listProjectsApi } from '../../features/projects/projectsApi';
import { setProjects } from '../../features/projects/projectsSlice';

const SIDEBAR_WIDTH = 240;
const TOPBAR_HEIGHT = 64;

const AppShell = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wsConnected = useSelector(selectWSConnected);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      socket.connect();
      listProjectsApi({ page: 1, limit: 20 })
        .then((res) => { if (res?.data) dispatch(setProjects(res.data)); })
        .catch(() => {});
    }
    return () => {};
  }, [isAuthenticated, dispatch]);

  return (
    <Box display="flex" minHeight="100vh" bgcolor="background.default">
      <Topbar onMobileMenuToggle={() => setMobileOpen((o) => !o)} />

      <Sidebar
        open={isLg ? true : mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant={isLg ? 'permanent' : 'temporary'}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          // ml: isLg ? `${SIDEBAR_WIDTH}px` : 0,
          mt: `${TOPBAR_HEIGHT}px`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {!wsConnected && (
          <Alert
            severity="warning"
            variant="outlined"
            sx={{ borderRadius: 0, border: 'none', borderBottom: '1px solid', borderColor: 'warning.light', py: 0.25, fontSize: 12 }}
          >
            Live updates paused. Reconnecting…
          </Alert>
        )}
        <Box flexGrow={1} display="flex" flexDirection="column" overflow="hidden">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppShell;