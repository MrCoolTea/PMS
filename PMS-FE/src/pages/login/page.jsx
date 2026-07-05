import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { alpha, useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext.jsx';

export function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { status, isAuthenticated, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login({
          email: form.email,
          password: form.password,
        });
      } else {
        await register({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        });
      }

      navigate('/admin');
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSubmitting(false);
    }
  }

  const styles = {
    shell: {
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
      gap: 4,
      p: { xs: 2.5, md: 4 },
      alignItems: 'center',
    },
    hero: {
      p: { xs: 0, md: 1 },
    },
    eyebrowPill: {
      width: 'fit-content',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1.25,
      px: 1.75,
      py: 1.25,
      borderRadius: 999,
      bgcolor: alpha(theme.palette.common.white, 0.84),
      border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
      boxShadow: `0 10px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
    eyebrow: {
      fontSize: '0.78rem',
      fontWeight: 700,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'primary.main',
    },
    title: {
      mt: 3,
      maxWidth: '14ch',
      color: 'text.primary',
    },
    copy: {
      mt: 2,
      maxWidth: 640,
      color: 'text.secondary',
    },
    previewGrid: {
      mt: 3.5,
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
      gap: 1.75,
    },
    previewItem: {
      p: 2.25,
      borderRadius: 2.25,
      border: `1px solid ${alpha(theme.palette.grey[500], 0.18)}`,
      bgcolor: alpha(theme.palette.common.white, 0.72),
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
    },
    card: {
      p: 4,
      borderRadius: 3.5,
      border: `1px solid ${alpha(theme.palette.grey[500], 0.18)}`,
      bgcolor: alpha(theme.palette.common.white, 0.88),
      backdropFilter: 'blur(18px)',
    },
    panelTitle: {
      mt: 1,
      fontWeight: 700,
      color: 'text.primary',
    },
    panelCopy: {
      color: 'text.secondary',
    },
    formNote: {
      p: 2,
      borderRadius: 2.25,
      border: `1px solid ${alpha(theme.palette.grey[500], 0.18)}`,
      bgcolor: theme.palette.grey[100],
    },
  };

  if (status === 'loading') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Checking session...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={styles.shell}>
      <Box sx={styles.hero}>
        <Box sx={styles.eyebrowPill}>
          <AutoAwesomeRoundedIcon fontSize="small" />
          <Typography sx={styles.eyebrow}>Resort Management System</Typography>
        </Box>

        <Typography variant="h2" sx={styles.title}>
          Manage rooms, guest stays, resort programs, payments, and OTA channels.
        </Typography>
        <Typography sx={styles.copy}>
          Sign in with a real backend account, or create one now against the NestJS
          auth service running on <strong>http://localhost:4000/api</strong>.
        </Typography>

        <Box sx={styles.previewGrid}>
          <Box sx={styles.previewItem}>
            <Typography variant="overline" sx={styles.eyebrow}>
              Operations
            </Typography>
            <Typography variant="h6">Reservations, rooms, and guest flow</Typography>
          </Box>
          <Box sx={styles.previewItem}>
            <Typography variant="overline" sx={styles.eyebrow}>
              Channels
            </Typography>
            <Typography variant="h6">Socials, OTA sync, and direct bookings</Typography>
          </Box>
        </Box>
      </Box>

      <Paper sx={styles.card}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
          <Tabs
            value={mode}
            onChange={(_event, nextMode) => {
              setMode(nextMode);
              setError('');
            }}
          >
            <Tab label="Sign In" value="login" />
            <Tab label="Create Account" value="register" />
          </Tabs>

          <Box>
            <Typography variant="overline" sx={styles.eyebrow}>
              {mode === 'login' ? 'Welcome back' : 'First-time setup'}
            </Typography>
            <Typography variant="h4" sx={styles.panelTitle}>
              {mode === 'login' ? 'Sign in to the dashboard' : 'Create your admin account'}
            </Typography>
            <Typography sx={styles.panelCopy}>
              {mode === 'login'
                ? 'Use an account stored in your backend database.'
                : 'This creates a real user record in PostgreSQL and signs you in immediately.'}
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          {mode === 'register' ? (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                fullWidth
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
                fullWidth
              />
            </Stack>
          ) : null}

          <TextField
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            fullWidth
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? (
                        <VisibilityOffRoundedIcon fontSize="small" />
                      ) : (
                        <VisibilityRoundedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            fullWidth
          />

          {mode === 'register' ? (
            <TextField
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
            />
          ) : null}

          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Submitting...' : mode === 'login' ? 'Login' : 'Create Account'}
          </Button>

          <Box sx={styles.formNote}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Backend requirements
            </Typography>
            <Typography variant="body2">
              Backend must be running on <strong>http://localhost:4000</strong>.
            </Typography>
            <Typography variant="body2">
              If login fails because no user exists yet, switch to <strong>Create Account</strong>.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
