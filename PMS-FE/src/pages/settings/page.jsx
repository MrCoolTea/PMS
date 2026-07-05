import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import { getSiteSettings, updateSiteSettings } from '../../lib/site.js';
import { ui } from '../../styles/ui.js';

const emptySettings = {
  resortName: '',
  currency: '',
  timezone: '',
  checkInTime: '',
  checkOutTime: '',
  notifications: true,
  autoConfirmations: true,
};

function toEditableSettings(settings) {
  return {
    resortName: settings.resortName ?? '',
    currency: settings.currency ?? '',
    timezone: settings.timezone ?? '',
    checkInTime: settings.checkInTime ?? '',
    checkOutTime: settings.checkOutTime ?? '',
    notifications: Boolean(settings.notifications),
    autoConfirmations: Boolean(settings.autoConfirmations),
  };
}

export function SettingsPage() {
  const { accessToken } = useAuth();
  const [form, setForm] = useState(emptySettings);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const settings = await getSiteSettings(accessToken);
        if (active) {
          setForm(toEditableSettings(settings));
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    }

    loadSettings();
    return () => {
      active = false;
    };
  }, [accessToken]);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError('');
      setSaved('');
      const updated = await updateSiteSettings(accessToken, toEditableSettings(form));
      setForm(toEditableSettings(updated));
      setSaved('Settings saved.');
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Settings</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>Resort operations configuration</Typography>
        <Typography sx={ui.heroCopy}>
          Configure check-in rules, timezone, currency, and guest notification behavior.
        </Typography>
      </Paper>

      <Paper sx={ui.contentPanel} elevation={0}>
        <Typography variant="h5" sx={ui.panelTitle}>System Settings</Typography>
        {error ? <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert> : null}
        {saved ? <Alert severity="success" sx={{ mt: 2.5 }}>{saved}</Alert> : null}
        <Stack component="form" spacing={2} sx={{ mt: 2.5, maxWidth: 720 }} onSubmit={handleSubmit}>
          <TextField label="Resort Name" name="resortName" value={form.resortName} onChange={handleChange} />
          <TextField label="Currency" name="currency" value={form.currency} onChange={handleChange} />
          <TextField label="Timezone" name="timezone" value={form.timezone} onChange={handleChange} />
          <TextField label="Check-In Time" name="checkInTime" value={form.checkInTime} onChange={handleChange} />
          <TextField label="Check-Out Time" name="checkOutTime" value={form.checkOutTime} onChange={handleChange} />
          <FormControlLabel control={<Switch checked={form.notifications} onChange={handleChange} name="notifications" />} label="Enable notifications" />
          <FormControlLabel control={<Switch checked={form.autoConfirmations} onChange={handleChange} name="autoConfirmations" />} label="Auto-send confirmations" />
          <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>Save Settings</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
