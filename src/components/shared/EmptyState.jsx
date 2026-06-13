import { Box, Typography, Button } from '@mui/material';
import {VideoCall as VideoCallIcon} from '@mui/icons-material';

const EmptyState = ({ icon: Icon = VideoCallIcon, title, description, action, actionLabel }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    py={8}
    px={2}
    textAlign="center"
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        bgcolor: 'primary.light',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
      }}
    >
      <Icon sx={{ fontSize: 36, color: 'primary.main' }} />
    </Box>
    <Typography variant="h6" fontWeight={600} gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" maxWidth={360} mb={3}>
        {description}
      </Typography>
    )}
    {action && actionLabel && (
      <Button variant="contained" onClick={action}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;