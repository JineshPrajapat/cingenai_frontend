import { Box, Typography, Paper } from '@mui/material';
import JobResultCard from '../job/JobResultCard';
import FailedJobCard from '../job/FailedJobCard';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  const type = message.message_type;

  if (type === 'generation_complete') {
    return (
      <Box display="flex" justifyContent="flex-start" mb={1.5}>
        <JobResultCard message={message} />
      </Box>
    );
  }

  if (type === 'error') {
    return (
      <Box display="flex" justifyContent="flex-start" mb={1.5}>
        <Paper
          elevation={0}
          sx={{
            px: 2, py: 1.5, maxWidth: '75%', borderRadius: 2,
            bgcolor: '#fef2f2', border: '1px solid #fecaca',
          }}
        >
          <Typography variant="body2" color="error.main">{message.content}</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'} mb={1.5}>
      <Paper
        elevation={0}
        sx={{
          px: 2, py: 1.5, maxWidth: '75%', borderRadius: 2,
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          border: isUser ? 'none' : '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {message.content}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MessageBubble;