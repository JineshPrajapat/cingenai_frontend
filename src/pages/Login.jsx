import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Stack, Alert, Link, Divider,
} from '@mui/material';
import { MovieFilter as MovieFilterIcon } from '@mui/icons-material';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginApi } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [values, setValues] = useState({ email: '', password: '' });
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
    if (!values.email) errs.email = 'Email is required';
    if (!values.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await loginApi(values);
      dispatch(setCredentials(res.data));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Left brand panel */}
      <Box
        sx={{
          flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 40%, #2d1b4e 100%)',
          p: 6, gap: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{
            width: 56, height: 56, borderRadius: 2,
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MovieFilterIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          <Typography variant="h4" fontWeight={800} color="white" letterSpacing="-0.02em">
            CinGen AI
          </Typography>
        </Box>
        <Typography variant="h5" color="rgba(255,255,255,0.7)" fontWeight={300} textAlign="center" maxWidth={360}>
          Turn your ideas into cinematic videos with AI
        </Typography>
        <Stack spacing={2} mt={2}>
          {['Write scripts automatically', 'Generate voice narration', 'Create stunning visuals', 'Render final video'].map((feat) => (
            <Stack key={feat} direction="row" spacing={1.5} alignItems="center">
              <AutoAwesomeIcon sx={{ color: '#7c3aed', fontSize: 18 }} />
              <Typography color="rgba(255,255,255,0.6)" variant="body2">{feat}</Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: { xs: 1, md: 'none' }, width: { md: 680 },
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: 'background.default', p: 3,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={0.5}>Welcome back</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Sign in to your CinGen account
            </Typography>

            {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                <TextField
                  label="Email"
                  type="email"
                  value={values.email}
                  onChange={set('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  autoComplete="email"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={values.password}
                  onChange={set('password')}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  autoComplete="current-password"
                />
                <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
                  {loading ? 'Signing in…' : 'Sign In'}
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />
            <Typography variant="body2" textAlign="center" color="text.secondary">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" fontWeight={600}>
                Create one
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;