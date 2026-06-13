import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import {ExpandMore as ExpandMoreIcon} from '@mui/icons-material';

const ScriptViewer = ({ scenes = [], loading = false }) => {
  if (loading) {
    return (
      <Box>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rounded" height={48} sx={{ mb: 1 }} />
        ))}
      </Box>
    );
  }

  if (!scenes.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        Script not available yet.
      </Typography>
    );
  }

  return (
    <Box>
      {scenes.map((scene, idx) => (
        <Accordion key={scene.scene_order ?? idx} disableGutters elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider', mb: 0.5, borderRadius: '8px !important',
            '&:before': { display: 'none' }, overflow: 'hidden' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2" fontWeight={600} mr={2} flexShrink={0}>
              Scene {scene.scene_order ?? idx + 1}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {scene.caption?.slice(0, 50)}
              {scene.caption?.length > 50 ? '…' : ''}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: 'background.default', pt: 1 }}>
            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
              CAPTION
            </Typography>
            <Typography variant="body2" fontFamily="monospace" mb={1.5} sx={{ whiteSpace: 'pre-wrap' }}>
              {scene.caption}
            </Typography>
            {scene.image_prompt && (
              <>
                <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
                  IMAGE PROMPT
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {scene.image_prompt}
                </Typography>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ScriptViewer;