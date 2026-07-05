import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  createIntegration,
  deleteIntegration,
  listIntegrations,
  updateIntegration,
} from '../../lib/integrations.js';
import { ui } from '../../styles/ui.js';

const emptyForm = {
  platform: '',
  category: '',
  notes: '',
  status: 'Pending Setup',
  sync: 'Not configured',
};

const statusOptions = ['Connected', 'Pending Setup', 'Disconnected'];

function integrationColor(status) {
  if (status === 'Connected') return 'success';
  if (status === 'Pending Setup') return 'warning';
  return 'default';
}

export function IntegrationsPage() {
  const { accessToken } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let active = true;

    async function loadIntegrations() {
      try {
        setLoading(true);
        setError('');
        const nextIntegrations = await listIntegrations(accessToken);
        if (active) setIntegrations(nextIntegrations);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadIntegrations();
    return () => {
      active = false;
    };
  }, [accessToken]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleEdit(integration) {
    setSelectedId(integration.id);
    setForm({
      platform: integration.platform ?? '',
      category: integration.category ?? '',
      notes: integration.notes ?? '',
      status: integration.status ?? 'Pending Setup',
      sync: integration.sync ?? 'Not configured',
    });
  }

  function resetForm() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      platform: form.platform.trim(),
      category: form.category.trim(),
      notes: form.notes.trim(),
      status: form.status,
      sync: form.sync.trim(),
    };

    try {
      setError('');
      if (selectedId) {
        const updated = await updateIntegration(accessToken, selectedId, payload);
        setIntegrations((current) =>
          current.map((entry) => (entry.id === updated.id ? updated : entry))
        );
      } else {
        const created = await createIntegration(accessToken, payload);
        setIntegrations((current) => [created, ...current]);
      }
      resetForm();
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  async function handleDelete(id) {
    try {
      setError('');
      await deleteIntegration(accessToken, id);
      setIntegrations((current) => current.filter((entry) => entry.id !== id));
      if (selectedId === id) resetForm();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Integrations</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>Booking channels and metasearch setup</Typography>
        <Typography sx={ui.heroCopy}>
          Track OTA and metasearch integrations like Booking.com, Agoda, Expedia, Airbnb, and Trivago.
        </Typography>
      </Paper>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>Connected Channels</Typography>
          {error ? <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert> : null}
          {loading ? (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
              <CircularProgress size={24} />
              <Typography sx={ui.panelCopy}>Loading integrations...</Typography>
            </Stack>
          ) : (
            <Stack spacing={1.5} sx={{ mt: 2.5 }}>
              {integrations.map((integration) => (
                <Box key={integration.id} sx={ui.recordCard}>
                  <Box>
                    <Typography sx={ui.rowTitle}>{integration.platform}</Typography>
                    <Typography sx={ui.rowCopy}>
                      {integration.category} • Last sync: {integration.sync}
                    </Typography>
                    <Typography sx={ui.rowCopy}>{integration.notes}</Typography>
                  </Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Chip label={integration.status} color={integrationColor(integration.status)} />
                    <Button variant="outlined" onClick={() => handleEdit(integration)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(integration.id)}>Delete</Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>{selectedId ? 'Edit Integration' : 'Add Integration'}</Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField required label="Platform" name="platform" value={form.platform} onChange={handleChange} />
            <TextField required label="Category" name="category" value={form.category} onChange={handleChange} />
            <TextField label="Sync Status" name="sync" value={form.sync} onChange={handleChange} />
            <TextField select label="Connection Status" name="status" value={form.status} onChange={handleChange}>
              {statusOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
            </TextField>
            <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} multiline minRows={3} />
            <Stack direction="row" spacing={1.5}>
              <Button type="submit" variant="contained">{selectedId ? 'Save Changes' : 'Save Integration'}</Button>
              {selectedId ? <Button onClick={resetForm}>Cancel</Button> : null}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
