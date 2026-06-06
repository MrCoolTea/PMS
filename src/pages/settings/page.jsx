import { useState } from 'react';
import {
  Button,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import '../../App.css';

export function SettingsPage() {
  const { data, updateSettings } = useResort();
  const [form, setForm] = useState(data.settings);

  function handleChange(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    updateSettings(form);
  }

  return (
    <Stack spacing={3}>
      <Paper className="hero-panel" elevation={0}>
        <Typography className="eyebrow">Settings</Typography>
        <Typography variant="h3" className="hero-title">
          Resort operations configuration
        </Typography>
        <Typography className="hero-copy">
          Configure check-in rules, timezone, currency, and guest notification behavior.
        </Typography>
      </Paper>

      <Paper className="content-panel" elevation={0}>
        <Typography variant="h5" className="panel-title">
          System Settings
        </Typography>
        <Stack component="form" spacing={2} sx={{ mt: 2.5, maxWidth: 720 }} onSubmit={handleSubmit}>
          <TextField
            label="Resort Name"
            name="resortName"
            value={form.resortName}
            onChange={handleChange}
          />
          <TextField
            label="Currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
          />
          <TextField
            label="Timezone"
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
          />
          <TextField
            label="Check-In Time"
            name="checkInTime"
            value={form.checkInTime}
            onChange={handleChange}
          />
          <TextField
            label="Check-Out Time"
            name="checkOutTime"
            value={form.checkOutTime}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.notifications}
                onChange={handleChange}
                name="notifications"
              />
            }
            label="Enable notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.autoConfirmations}
                onChange={handleChange}
                name="autoConfirmations"
              />
            }
            label="Auto-send confirmations"
          />
          <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>
            Save Settings
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
