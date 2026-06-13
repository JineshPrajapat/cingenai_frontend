import { useState } from 'react';
import {
  Box, TextField, MenuItem, Stack, Button, Alert, Typography,
} from '@mui/material';

const GENRES = [
  'education',
  'fitness',
  'business',
  'technology',
  'startup',
  'self_improvement',
  'motivation',
  'lifestyle',
  'productivity',
  'finance',
  'marketing',
  'comedy',
  'storytelling',
  'health',
  'travel',
  'other'
];
const defaultValues = {
  title: '',
  description: '',
  genre: '',
  target_audience: '',
  style_notes: '',
};

const ProjectForm = ({ initialValues = {}, onSubmit, loading = false, submitLabel = 'Create Project' }) => {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!values.title.trim()) errs.title = 'Title is required';
    else if (values.title.length > 255) errs.title = 'Max 255 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setApiError('');
    try {
      await onSubmit(values);
    } catch (err) {
      setApiError(err.message || 'Something went wrong');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

      <Stack spacing={2.5}>
        <TextField
          label="Title"
          value={values.title}
          onChange={set('title')}
          error={!!errors.title}
          helperText={errors.title}
          required
          fullWidth
          inputProps={{ maxLength: 255 }}
        />

        <TextField
          label="Description"
          value={values.description}
          onChange={set('description')}
          multiline
          rows={3}
          fullWidth
          placeholder="What's this project about?"
        />

        <TextField
          select
          label="Genre"
          value={values.genre}
          onChange={set('genre')}
          fullWidth
        >
          <MenuItem value=""><em>Select a genre</em></MenuItem>
          {GENRES.map((g) => (
            <MenuItem key={g} value={g} sx={{ textTransform: 'capitalize' }}>{g}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Target Audience"
          value={values.target_audience}
          onChange={set('target_audience')}
          fullWidth
          placeholder="e.g. young professionals, fitness enthusiasts"
        />

        <TextField
          label="Style Notes"
          value={values.style_notes}
          onChange={set('style_notes')}
          multiline
          rows={3}
          fullWidth
          placeholder="e.g. bold text, fast cuts, energetic music"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Saving…' : submitLabel}
        </Button>
      </Stack>
    </Box>
  );
};

export default ProjectForm;