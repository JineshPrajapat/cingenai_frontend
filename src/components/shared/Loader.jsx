import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ message = 'Loading...' }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    py={8}
    gap={2}
  >
    <CircularProgress size={40} thickness={3} />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Box>
);

export default Loader;