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

function integrationColor(status) {
  if (status === 'Connected') {
    return 'success';
  }
  if (status === 'Pending Setup') {
    return 'warning';
  }
  return 'default';
}

export function IntegrationsPage() {
  const { data, addIntegration } = useResort();
  const [form, setForm] = useState({
    platform: '',
    category: '',
    notes: '',
  });

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addIntegration(form);
    setForm({
      platform: '',
      category: '',
      notes: '',
    });
  }

  return (
    <Stack spacing={3}>
      <Paper className="hero-panel" elevation={0}>
        <Typography className="eyebrow">Integrations</Typography>
        <Typography variant="h3" className="hero-title">
          Booking channels and metasearch setup
        </Typography>
        <Typography className="hero-copy">
          Track OTA and metasearch integrations like Booking.com, Agoda, Expedia,
          Airbnb, and Trivago before wiring in the real backend sync.
        </Typography>
      </Paper>

      <Box className="dashboard-grid">
        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Connected Channels
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.integrations.map((integration) => (
              <Box key={integration.id} className="record-card">
                <Box>
                  <Typography className="row-title">{integration.platform}</Typography>
                  <Typography className="row-copy">
                    {integration.category} • Last sync: {integration.sync}
                  </Typography>
                  <Typography className="row-copy">{integration.notes}</Typography>
                </Box>
                <Chip
                  label={integration.status}
                  color={integrationColor(integration.status)}
                  variant={integration.status === 'Connected' ? 'filled' : 'outlined'}
                />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Add Integration
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField
              label="Platform"
              name="platform"
              value={form.platform}
              onChange={handleChange}
            />
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              multiline
              minRows={3}
            />
            <Button type="submit" variant="contained">
              Save Integration
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
