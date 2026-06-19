import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { alpha, useTheme } from '@mui/material/styles';
import { isAuthenticated, loginUser } from '../../lib/auth.js';

const DEMO_EMAIL = 'admin@resortdesk.local';
const DEMO_PASSWORD = 'resort123';

export function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState('');

  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Use the demo resort credentials shown below.');
      return;
    }

    loginUser(email);
    navigate('/admin');
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
    demoNote: {
      p: 2,
      borderRadius: 2.25,
      border: `1px solid ${alpha(theme.palette.grey[500], 0.18)}`,
      bgcolor: theme.palette.grey[100],
    },
  };

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
          This frontend is now structured for resort operations, with room control,
          reservation handling, activity scheduling, social media, and booking
          integrations ready for backend hookup later.
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
          <Box>
            <Typography variant="overline" sx={styles.eyebrow}>
              Welcome back
            </Typography>
            <Typography variant="h4" sx={styles.panelTitle}>
              Sign in to the dashboard
            </Typography>
            <Typography sx={styles.panelCopy}>
              Use the demo account to enter the resort operations dashboard.
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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

          <Button type="submit" variant="contained" size="large">
            Login
          </Button>

          <Box sx={styles.demoNote}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Demo credentials
            </Typography>
            <Typography variant="body2">
              Demo email: <strong>{DEMO_EMAIL}</strong>
            </Typography>
            <Typography variant="body2">
              Demo password: <strong>{DEMO_PASSWORD}</strong>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
