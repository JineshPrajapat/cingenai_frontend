import { Card, CardContent, CardMedia, Box, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import { duration, filesize } from '../../utils/formatters';

const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTJlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiM3YzNhZWQiIGZvbnQtc2l6ZT0iNDgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7imJM8L3RleHQ+PC9zdmc+';

const JobResultCard = ({ message }) => {
  const navigate = useNavigate();
  const meta = message?.metadata || {};
  const jobId = meta.job_id;
  const videoUrl = meta.video_url;
  const thumbnail = meta.thumbnail_url || PLACEHOLDER;

  return (
    <Card sx={{ my: 1, maxWidth: 400 }}>
      <Box position="relative">
        <CardMedia
          component="img"
          height={180}
          image={thumbnail}
          alt="Video thumbnail"
          sx={{ bgcolor: 'primary.main' }}
        />
        <Box
          position="absolute"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            background: 'rgba(0,0,0,0.3)',
            cursor: 'pointer',
            '&:hover': { background: 'rgba(0,0,0,0.5)' },
            transition: 'background 0.2s',
          }}
          onClick={() => jobId && navigate(`/jobs/${jobId}`)}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlayArrowIcon sx={{ color: 'primary.main', fontSize: 32, ml: 0.5 }} />
          </Box>
        </Box>
      </Box>
      <CardContent sx={{ pb: '12px !important' }}>
        <Typography variant="subtitle1" fontWeight={600} mb={0.5} noWrap>
          {meta.title || 'Generated Video'}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
          {duration(meta.duration_s)} · {meta.resolution || 'HD'} · {filesize(meta.file_size)}
        </Typography>
        <Stack direction="row" spacing={1}>
          {jobId && (
            <Button size="small" variant="contained" startIcon={<PlayArrowIcon />} onClick={() => navigate(`/jobs/${jobId}`)}>
              Play
            </Button>
          )}
          {videoUrl && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadIcon />}
              component="a"
              href={videoUrl}
              download
            >
              Download
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default JobResultCard;