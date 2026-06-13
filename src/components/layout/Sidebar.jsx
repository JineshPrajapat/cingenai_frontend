import {
  Drawer, Box, Typography, List, ListItemButton, ListItemIcon, ListItemText,
  Divider, Avatar, Stack, IconButton, Tooltip,
} from '@mui/material';
import {DashboardRounded as DashboardRoundedIcon} from '@mui/icons-material';
import {AddCircleOutline as AddCircleOutlineIcon} from '@mui/icons-material';
import {LogoutRounded as LogoutRoundedIcon} from '@mui/icons-material';
import {FolderOutlined as FolderOutlinedIcon} from '@mui/icons-material';
import {MovieFilter as MovieFilterIcon} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectUser } from '../../features/auth/authSlice';
import { selectProjects } from '../../features/projects/projectsSlice';
import { socket } from '../../ws/socket';

const SIDEBAR_WIDTH = 240;

const NavItem = ({ icon, label, to, active }) => {
  const navigate = useNavigate();
  return (
    <ListItemButton
      onClick={() => navigate(to)}
      selected={active}
      sx={{
        borderRadius: 1.5,
        mx: 1,
        mb: 0.25,
        '&.Mui-selected': {
          bgcolor: 'primary.light',
          color: 'primary.main',
          '& .MuiListItemIcon-root': { color: 'primary.main' },
          '&:hover': { bgcolor: 'primary.light' },
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 36 }}>{icon}</ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
    </ListItemButton>
  );
};

const Sidebar = ({ open, onClose, variant }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector(selectUser);
  const projects = useSelector(selectProjects);


  const handleLogout = () => {
    socket.disconnect();
    dispatch(clearCredentials());
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const content = (
    <Box display="flex" flexDirection="column" height="100%" width={SIDEBAR_WIDTH}>
      {/* Logo */}
      <Box px={2.5} py={2.5} display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            width: 34, height: 34, borderRadius: 1.5,
            background: 'linear-gradient(135deg, #1a1a2e, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <MovieFilterIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
          CinGen<Typography component="span" color="secondary.main" fontWeight={800}> AI</Typography>
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 0.5, pt: 1, pb: 0 }}>
        <NavItem
          icon={<DashboardRoundedIcon fontSize="small" />}
          label="Dashboard"
          to="/dashboard"
          active={location.pathname === '/dashboard'}
        />
      </List>

      <Divider sx={{ mx: 2, my: 1 }} />

      <Box px={2.5} mb={0.5}>
        <Typography variant="overline" color="text.secondary" fontWeight={600} fontSize={10}>
          Projects
        </Typography>
      </Box>

      <List sx={{ px: 0.5, flexGrow: 1, overflow: 'auto' }}>
        <NavItem
          icon={<AddCircleOutlineIcon fontSize="small" />}
          label="New Project"
          to="/projects/new"
          active={location.pathname === '/projects/new'}
        />
        
        {projects.length > 0 && projects.slice(0, 5).map((p) => (
          <NavItem
            key={p?.p_id}
            icon={<FolderOutlinedIcon fontSize="small" />}
            label={p?.title}
            to={`/projects/${p?.p_id}`}
            active={location.pathname.startsWith(`/projects/${p?.p_id}`)}
          />
        ))}
        
      </List>

      <Divider />

      {/* User row */}
      <Stack direction="row" alignItems="center" px={2} py={1.5} spacing={1.5}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 13, fontWeight: 700 }}>
          {initials}
        </Avatar>
        <Typography variant="body2" fontWeight={500} noWrap flex={1}>
          {user?.name || user?.email || 'User'}
        </Typography>
        <Tooltip title="Logout">
          <IconButton size="small" onClick={handleLogout}>
            <LogoutRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
      }}
    >
      {content}
    </Drawer>
  );
};

export default Sidebar;
