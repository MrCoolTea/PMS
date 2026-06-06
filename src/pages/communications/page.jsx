import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import '../../App.css';

export function MarketingPage() {
  const { data, addSocialMedia } = useResort();
  const [form, setForm] = useState({
    platform: '',
    handle: '',
    url: '',
  });

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addSocialMedia(form);
    setForm({
      platform: '',
      handle: '',
      url: '',
    });
  }

  return (
    <Stack spacing={3}>
      <Paper className="hero-panel" elevation={0}>
        <Typography className="eyebrow">Marketing</Typography>
        <Typography variant="h3" className="hero-title">
          Social media presence and resort outreach
        </Typography>
        <Typography className="hero-copy">
          Add and track resort social accounts so your frontend already has a
          marketing section before backend integrations are wired.
        </Typography>
      </Paper>

      <Box className="dashboard-grid">
        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Social Media Accounts
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.socialMedia.map((account) => (
              <Box key={account.id} className="record-card">
                <Box>
                  <Typography className="row-title">{account.platform}</Typography>
                  <Typography className="row-copy">
                    {account.handle} • {account.url}
                  </Typography>
                </Box>
                <Chip label={account.status} color="success" />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Add Social Media
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField
              label="Platform"
              name="platform"
              value={form.platform}
              onChange={handleChange}
            />
            <TextField label="Handle" name="handle" value={form.handle} onChange={handleChange} />
            <TextField label="URL" name="url" value={form.url} onChange={handleChange} />
            <Button type="submit" variant="contained">
              Save Account
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
