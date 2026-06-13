import { useEffect, useState } from 'react';
import { Box, Paper, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectProject, setProject } from '../features/project/projectSlice';
import { getProjectApi, updateProjectApi, archiveProjectApi } from '../features/project/projectApi';
import { removeProject } from '../features/projects/projectsSlice';
import ProjectForm from '../components/project/ProjectForm';
import { useNotify } from '../hooks';
import Loader from '../components/shared/Loader';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = useNotify();
  const project = useSelector(selectProject);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    if (!project || project.id !== projectId) {
      getProjectApi(projectId)
        .then((r) => { if (r?.data) dispatch(setProject(r.data)); })
        .catch((err) => notify.error(err.message));
    }
  }, [projectId]);

  const handleUpdate = async (values) => {
    const res = await updateProjectApi(projectId, values);
    if (res?.data) {
      dispatch(setProject(res.data));
      notify.success('Project updated');
    }
  };

  const handleArchive = async () => {
    setArchiving(true);
    try {
      await archiveProjectApi(projectId);
      dispatch(removeProject(projectId));
      navigate('/dashboard');
      notify.success('Project archived');
    } catch (err) {
      notify.error(err.message || 'Failed to archive project');
    } finally {
      setArchiving(false);
    }
  };

  if (!project) return <Loader />;

  return (
    <Box display="flex" justifyContent="center" p={3}>
      <Box width="100%" maxWidth={560}>
        <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Typography variant="h5" fontWeight={700} mb={0.5}>Project Settings</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>Update your project details</Typography>
          <ProjectForm
            initialValues={project}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
          />
        </Paper>

        {/* Danger Zone */}
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'error.light' }}>
          <Typography variant="subtitle1" fontWeight={700} color="error.main" mb={1}>Danger Zone</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2" fontWeight={500}>Archive this project</Typography>
              <Typography variant="caption" color="text.secondary">
                This action cannot be undone.
              </Typography>
            </Box>
            <Button variant="outlined" color="error" onClick={() => setArchiveDialogOpen(true)}>
              Archive
            </Button>
          </Box>
        </Paper>
      </Box>

      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Archive Project?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently archive <strong>{project.title}</strong>. This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setArchiveDialogOpen(false)} disabled={archiving}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleArchive} disabled={archiving}>
            {archiving ? 'Archiving…' : 'Archive Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectSettings;