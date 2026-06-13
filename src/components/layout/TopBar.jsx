import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Tooltip, TextField,
} from '@mui/material';
import {ArrowBack as ArrowBackIcon} from '@mui/icons-material';
import {SettingsRounded as SettingsRoundedIcon} from '@mui/icons-material';
import {HistoryRounded as HistoryRoundedIcon} from '@mui/icons-material';
import {Menu as MenuIcon} from '@mui/icons-material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectProject } from '../../features/project/projectSlice';
import { updateProjectApi } from '../../features/project/projectApi';
import { setProject } from '../../features/project/projectSlice';

const SIDEBAR_WIDTH = 240;

const Topbar = ({ onMobileMenuToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectId } = useParams();
  const location = useLocation();
  const project = useSelector(selectProject);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  const isProjectPage = !!projectId;
  const isStudio = location.pathname === `/projects/${projectId}`;

  const handleTitleClick = () => {
    if (!project || !isStudio) return;
    setTitleValue(project.title);
    setEditingTitle(true);
  };

  const handleTitleSave = async () => {
    if (!titleValue.trim() || titleValue === project?.title) {
      setEditingTitle(false);
      return;
    }
    try {
      const res = await updateProjectApi(projectId, { title: titleValue.trim() });
      if (res?.data) dispatch(setProject(res.data));
    } catch {}
    setEditingTitle(false);
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper' }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton edge="start" onClick={onMobileMenuToggle} sx={{ display: { lg: 'none' } }}>
          <MenuIcon />
        </IconButton>

        {isProjectPage && (
          <IconButton onClick={() => navigate(-1)} size="small">
            <ArrowBackIcon />
          </IconButton>
        )}

        {isProjectPage && project ? (
          editingTitle ? (
            <TextField
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              variant="standard"
              autoFocus
              size="small"
              inputProps={{ style: { fontWeight: 600, fontSize: 16 } }}
              sx={{ flex: 1 }}
            />
          ) : (
            <Typography
              variant="h6"
              fontWeight={600}
              noWrap
              sx={{ flex: 1, cursor: isStudio ? 'text' : 'default', '&:hover': isStudio ? { color: 'secondary.main' } : {} }}
              onClick={handleTitleClick}
              title={isStudio ? 'Click to rename' : undefined}
            >
              {project.title}
            </Typography>
          )
        ) : (
          <Typography variant="h6" fontWeight={700} sx={{ flex: 1, color: 'primary.main' }}>
            CinGen AI
          </Typography>
        )}

        {isProjectPage && (
          <>
            <Tooltip title="Settings">
              <IconButton onClick={() => navigate(`/projects/${projectId}/settings`)}>
                <SettingsRoundedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="History">
              <IconButton onClick={() => navigate(`/projects/${projectId}/history`)}>
                <HistoryRoundedIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;