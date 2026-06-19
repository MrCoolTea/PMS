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
import { ui } from '../../styles/ui.js';

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
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Integrations</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Booking channels and metasearch setup
        </Typography>
        <Typography sx={ui.heroCopy}>
          Track OTA and metasearch integrations like Booking.com, Agoda, Expedia,
          Airbnb, and Trivago before wiring in the real backend sync.
        </Typography>
      </Paper>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Connected Channels
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.integrations.map((integration) => (
              <Box key={integration.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{integration.platform}</Typography>
                  <Typography sx={ui.rowCopy}>
                    {integration.category} • Last sync: {integration.sync}
                  </Typography>
                  <Typography sx={ui.rowCopy}>{integration.notes}</Typography>
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

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
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
