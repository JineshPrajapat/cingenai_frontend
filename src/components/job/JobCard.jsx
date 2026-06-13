import { Card, CardContent, Stack, Box, Typography, Button, LinearProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {Download as DownloadIcon} from '@mui/icons-material';
import {Refresh as RefreshIcon} from '@mui/icons-material';
import StatusBadge from '../shared/StatusBadge';
import { relativeDate } from '../../utils/formatters';
import { STATUS_CONFIG, isActive } from '../../utils/statusConfig';

const JobCard = ({ job, onRetry }) => {
  const {projectId} = useParams();
  const navigate = useNavigate();
  const config = STATUS_CONFIG[job.status] || STATUS_CONFIG.QUEUED;
  const progress = isActive(job.status) ? config.progress : (job.status === 'COMPLETE' ? 100 : 0);

  return (
    <Card sx={{ mb: 1.5 }}>
      <CardContent sx={{ pb: '12px !important' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <StatusBadge status={job.status} />
          <Typography variant="caption" color="text.secondary">
            {relativeDate(job.created_at)}
          </Typography>
        </Stack>

        <Typography variant="subtitle1" fontWeight={600} noWrap mb={1}>
          {job.title || 'Untitled Job'}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 1.5, borderRadius: 1 }}
          color={job.status === 'FAILED' ? 'error' : 'secondary'}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button size="small" variant="outlined" onClick={() => navigate(`/projects/${projectId}/jobs/${job.cj_id}`)}>
            View Details
          </Button>
          {job.status === 'COMPLETE' && job.video_url && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<DownloadIcon />}
              component="a"
              href={job.video_url}
              download
            >
              Download
            </Button>
          )}
          {job.status === 'FAILED' && onRetry && (
            <Button
              size="small"
              variant="outlined"
              color="warning"
              startIcon={<RefreshIcon />}
              onClick={() => onRetry(job)}
            >
              Retry
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default JobCard;