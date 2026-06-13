import { Box, LinearProgress, Typography } from '@mui/material';
import PipelineTracker from './PipelineTracker';
import { useJobEvents } from '../../hooks/useJobEvents';

const ActiveJobSummary = ({ jobId }) => {
  const { status, progress, message, sceneProgress } = useJobEvents(jobId);
  if (!status) return null;

  return (
    <Box>
      <PipelineTracker status={status} />
      <LinearProgress variant="determinate" value={progress} color="secondary" sx={{ my: 1 }} />
      {message && (
        <Typography variant="body2" color="text.secondary" mb={0.5}>{message}</Typography>
      )}
      {sceneProgress && (
        <Typography variant="caption" color="secondary.main" fontWeight={600}>
          Scene {sceneProgress.current} of {sceneProgress.total}
        </Typography>
      )}
    </Box>
  );
};

export default ActiveJobSummary;