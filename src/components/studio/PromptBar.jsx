import { useState, useRef, useCallback } from 'react';
import { Box, TextField, IconButton, Typography, Tooltip } from '@mui/material';
import {SendRounded as SendRoundedIcon} from '@mui/icons-material';

const MIN_CHARS = 5;
const MAX_CHARS = 2000;
const COUNTER_THRESHOLD = 1800;

const PromptBar = ({ onSubmit, disabled = false }) => {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef(null);

  const canSubmit = value.trim().length >= MIN_CHARS && !disabled && !submitting;
  const showCounter = value.length >= COUNTER_THRESHOLD;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    const prompt = value.trim();
    setValue('');
    setSubmitting(true);
    try {
      await onSubmit(prompt);
    } finally {
      setSubmitting(false);
      textareaRef.current?.focus();
    }
  }, [canSubmit, value, onSubmit]);

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          bgcolor: disabled ? 'grey.50' : 'background.paper',
          border: '1.5px solid',
          borderColor: disabled ? 'divider' : 'primary.main',
          borderRadius: 2,
          px: 1.5,
          py: 1,
          transition: 'border-color 0.2s',
        }}
      >
        <TextField
          inputRef={textareaRef}
          multiline
          maxRows={4}
          fullWidth
          variant="standard"
          placeholder={disabled ? 'Generation in progress…' : 'Describe your video idea…'}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          InputProps={{ disableUnderline: true }}
          sx={{ '& textarea': { fontSize: 14, lineHeight: 1.6 } }}
        />
        <Tooltip title={disabled ? 'Generation in progress…' : 'Send (⌘↵)'}>
          <span>
            <IconButton
              onClick={handleSubmit}
              disabled={!canSubmit}
              size="small"
              sx={{
                bgcolor: canSubmit ? 'primary.main' : 'transparent',
                color: canSubmit ? 'white' : 'text.disabled',
                '&:hover': { bgcolor: canSubmit ? 'primary.dark' : 'transparent' },
                transition: 'all 0.2s',
                flexShrink: 0,
                mb: 0.25,
              }}
            >
              <SendRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Box display="flex" justifyContent="space-between" mt={0.5} px={0.5}>
        {disabled ? (
          <Typography variant="caption" color="warning.main" fontWeight={500}>
            Generation in progress…
          </Typography>
        ) : (
          <Typography variant="caption" color="text.disabled">
            ⌘↵ to send · min {MIN_CHARS} chars
          </Typography>
        )}
        {showCounter && (
          <Typography
            variant="caption"
            color={value.length >= MAX_CHARS ? 'error.main' : 'text.secondary'}
          >
            {value.length}/{MAX_CHARS}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PromptBar;