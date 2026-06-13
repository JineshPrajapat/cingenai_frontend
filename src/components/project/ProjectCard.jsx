import { Card, CardContent, CardActionArea, Box, Typography, Chip, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {VideoLibrary as VideoLibraryIcon} from '@mui/icons-material';
import { relativeDate } from '../../utils/formatters';

const GENRE_COLORS = {
  fitness: '#10b981',
  comedy: '#f59e0b',
  education: '#3b82f6',
  lifestyle: '#ec4899',
  business: '#6366f1',
  other: '#6b7280',
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/projects/${project.p_id}`)}>
        <Box
          sx={{
            height: 100,
            background: `linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <VideoLibraryIcon sx={{ fontSize: 40, color: 'rgba(255,255,255,0.15)' }} />
          {project.genre && (
            <Chip
              label={project.genre}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: GENRE_COLORS[project.genre] || '#6b7280',
                color: 'white',
                fontWeight: 600,
                fontSize: 10,
                textTransform: 'capitalize',
              }}
            />
          )}
        </Box>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} noWrap mb={0.5}>
            {project.title}
          </Typography>
          {project.description && (
            <Typography variant="body2" color="text.secondary" sx={{
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              mb: 1,
            }}>
              {project.description}
            </Typography>
          )}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              {relativeDate(project.updated_at)}
            </Typography>
            {project.video_count !== undefined && (
              <Typography variant="caption" color="text.secondary">
                {project.video_count} video{project.video_count !== 1 ? 's' : ''}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;