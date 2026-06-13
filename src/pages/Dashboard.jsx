import { useEffect } from 'react';
import {
  Box, Grid, Typography, Button, Skeleton, Card, CardActionArea, CardContent,
} from '@mui/material';
import {Add as AddIcon} from '@mui/icons-material';
import {VideoCall as VideoCallIcon} from '@mui/icons-material';
import {AddRounded as AddRoundedIcon} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listProjectsApi } from '../features/projects/projectsApi';
import { setProjects, setLoading, selectProjects, selectProjectsLoading } from '../features/projects/projectsSlice';
import ProjectCard from '../components/project/ProjectCard';
import EmptyState from '../components/shared/EmptyState';

const SkeletonCard = () => (
  <Card>
    <Skeleton variant="rectangular" height={100} />
    <CardContent>
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="50%" />
    </CardContent>
  </Card>
);

const NewProjectCard = ({ onClick }) => (
  <Card sx={{ border: '2px dashed', borderColor: 'divider', bgcolor: 'transparent', boxShadow: 'none' }}>
    <CardActionArea onClick={onClick} sx={{ height: '100%', minHeight: 180 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.light',
          display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5,
        }}>
          <AddRoundedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        </Box>
        <Typography variant="body2" fontWeight={600} color="text.secondary">New Project</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectsLoading);

  console.log("projects", projects)

  useEffect(() => {
    dispatch(setLoading(true));
    listProjectsApi({ page: 1, limit: 20 })
      .then((res) => { 
        if (res?.data) 
          dispatch(setProjects(res.data)); })
      .catch(() => dispatch(setLoading(false)));
  }, [dispatch]);

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight={700}>My Projects</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/projects/new')}>
          New Project
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <SkeletonCard />
            </Grid>
          ))}
        </Grid>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={VideoCallIcon}
          title="Create your first project"
          description="Start a new project and let AI generate cinematic videos from your ideas."
          action={() => navigate('/projects/new')}
          actionLabel="New Project"
        />
      ) : (
        <Grid container spacing={2}>
          {projects.length > 0 && projects.map((p) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
              <ProjectCard project={p} />
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <NewProjectCard onClick={() => navigate('/projects/new')} />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;