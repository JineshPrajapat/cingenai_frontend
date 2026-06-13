import { Card, CardContent, Typography, Stack, Button, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PipelineTracker from './PipelineTracker';

const FailedJobCard = ({ event, onRetry }) => {
  return (
    <Card sx={{ my: 1, border: '1px solid', borderColor: 'error.light' }}>
      <CardContent>
        <Alert severity="error" sx={{ mb: 1.5, borderRadius: 1 }}>
          {event?.error_message || 'Generation failed. Please try again.'}
          {event?.failed_at_step && (
            <Typography variant="caption" display="block" mt={0.5}>
              Failed at: {event.failed_at_step}
            </Typography>
          )}
        </Alert>
        <PipelineTracker status="FAILED" />
        {onRetry && (
          <Stack direction="row" justifyContent="flex-end" mt={1}>
            <Button
              size="small"
              variant="outlined"
              color="warning"
              startIcon={<RefreshIcon />}
              onClick={onRetry}
            >
              Retry
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default FailedJobCard;