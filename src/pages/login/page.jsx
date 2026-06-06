import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { isAuthenticated, loginUser } from '../../lib/auth.js';
import '../../App.css';

const DEMO_EMAIL = 'admin@resortdesk.local';
const DEMO_PASSWORD = 'resort123';

export function LoginPage() {
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

  return (
    <Box className="login-shell">
      <Box className="login-hero">
        <Typography className="eyebrow">Resort Management System</Typography>
        <Typography variant="h2" className="login-title">
          Manage rooms, guest stays, resort programs, payments, and OTA channels.
        </Typography>
        <Typography className="login-copy">
          This frontend is now structured for resort operations, with room control,
          reservation handling, activity scheduling, social media, and booking
          integrations ready for backend hookup later.
        </Typography>
      </Box>

      <Paper className="login-card" elevation={0}>
        <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
          <Box>
            <Typography variant="h4" className="panel-title">
              Sign in
            </Typography>
            <Typography className="panel-copy">
              Use the demo account to enter the resort operations dashboard.
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
          />

          <Button type="submit" variant="contained" size="large">
            Login
          </Button>

          <Box className="demo-note">
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
