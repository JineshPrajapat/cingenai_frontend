import { useEffect, useRef } from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import MessageBubble from './MessageBubble';
import LiveJobCard from './LiveJobCard';

const TypingSkeletons = () => (
  <Stack spacing={0.5} mb={1.5}>
    <Skeleton variant="rounded" width="60%" height={36} />
  </Stack>
);

const ChatThread = ({ messages = [], activeJobId, activeJobTitle, onCancelJob, loading = false }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeJobId]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        px: 2,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        '&::-webkit-scrollbar': { width: 6 },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: 3 },
      }}
    >
      {loading && (
        <>
          <Box display="flex" justifyContent="flex-end" mb={1.5}>
            <Skeleton variant="rounded" width="50%" height={40} />
          </Box>
          <Box display="flex" justifyContent="flex-start" mb={1.5}>
            <Skeleton variant="rounded" width="65%" height={40} />
          </Box>
        </>
      )}

      {messages.length > 0 && messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {activeJobId && (
        <LiveJobCard
          jobId={activeJobId}
          jobTitle={activeJobTitle}
          onCancel={onCancelJob}
        />
      )}

      <div ref={bottomRef} />
    </Box>
  );
};

export default ChatThread;