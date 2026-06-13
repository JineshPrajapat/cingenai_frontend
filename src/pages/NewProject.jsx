import { Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ProjectForm from '../components/project/ProjectForm';
import { createProjectApi } from '../features/projects/projectsApi';
import { addProject } from '../features/projects/projectsSlice';

const NewProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    const res = await createProjectApi(values);
    if (res?.data) {
      dispatch(addProject(res.data));
      navigate(`/projects/${res.data.p_id}`);
    }
  };

  return (
    <Box display="flex" justifyContent="center" p={3}>
      <Paper
        elevation={0}
        sx={{
          width: '100%', maxWidth: 560, p: 4,
          border: '1px solid', borderColor: 'divider',
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={0.5}>New Project</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Set up your project and start generating videos.
        </Typography>
        <ProjectForm onSubmit={handleSubmit} submitLabel="Create Project" />
      </Paper>
    </Box>
  );
};

export default NewProject;