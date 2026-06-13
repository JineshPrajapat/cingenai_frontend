import { Box, Typography, Divider } from '@mui/material';

const PageHeader = ({ title, subtitle, action }) => (
  <Box mb={3}>
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
    <Divider />
  </Box>
);

export default PageHeader;