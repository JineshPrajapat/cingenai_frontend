import { Card, CardContent, Stack, Box, Typography, LinearProgress, Button } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import StatusBadge from '../shared/StatusBadge';
import PipelineTracker from '../job/PipelineTracker';
import { useJobEvents } from '../../hooks/useJobEvents';

const LiveJobCard = ({ jobId, jobTitle, onCancel }) => {
  const { status, progress, message, sceneProgress } = useJobEvents(jobId);

  if (!status) return null;

  return (
    <Box display="flex" justifyContent="flex-start" mb={1.5}>
      <Card sx={{ width: '100%', maxWidth: 480, border: '1px solid', borderColor: 'secondary.light' }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 260 }}>
              {jobTitle || 'Generating video…'}
            </Typography>
            <StatusBadge status={status} />
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progress}
            color="secondary"
            sx={{ my: 1, borderRadius: 1 }}
          />

          {message && (
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              {message}
            </Typography>
          )}

          {sceneProgress && (
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              Scene {sceneProgress.current} of {sceneProgress.total}
            </Typography>
          )}

          <PipelineTracker status={status} />

          {onCancel && (
            <Stack direction="row" justifyContent="flex-end" mt={1}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => onCancel(jobId)}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default LiveJobCard;