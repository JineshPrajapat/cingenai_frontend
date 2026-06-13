import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Stack, Alert, Link, Divider,
} from '@mui/material';
import { MovieFilter as MovieFilterIcon } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerApi } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: '' }));
    setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!values.email) errs.email = 'Email is required';
    if (!values.password) errs.password = 'Password is required';
    else if (values.password.length < 8) errs.password = 'Minimum 8 characters';
    if (values.password !== values.confirm_password) errs.confirm_password = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await registerApi({ name: values.name, email: values.email, password: values.password });
      dispatch(setCredentials({ user: res.data.user, access_token: res.data.access_token, refresh_token: res.data.refresh_token }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Box
        sx={{
          flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 40%, #2d1b4e 100%)',
          p: 6,
        }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Box sx={{
            width: 56, height: 56, borderRadius: 2,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MovieFilterIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h4" fontWeight={800} color="white">CinGen AI</Typography>
        </Box>
        <Typography variant="h5" color="rgba(255,255,255,0.7)" fontWeight={300} textAlign="center" maxWidth={320}>
          Your AI-powered video studio
        </Typography>
      </Box>

      <Box sx={{
        flex: { xs: 1, md: 'none' }, width: { md: 680 },
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        bgcolor: 'background.default', p: 3,
      }}>
        <Card sx={{ width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={0.5}>Create account</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Start creating AI videos today
            </Typography>

            {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                <TextField label="Full Name" value={values.name} onChange={set('name')} error={!!errors.name} helperText={errors.name} fullWidth />
                <TextField label="Email" type="email" value={values.email} onChange={set('email')} error={!!errors.email} helperText={errors.email} fullWidth />
                <TextField label="Password" type="password" value={values.password} onChange={set('password')} error={!!errors.password} helperText={errors.password} fullWidth />
                <TextField label="Confirm Password" type="password" value={values.confirm_password} onChange={set('confirm_password')} error={!!errors.confirm_password} helperText={errors.confirm_password} fullWidth />
                <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
                  {loading ? 'Creating account…' : 'Create Account'}
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" textAlign="center" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" fontWeight={600}>Sign in</Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Register;