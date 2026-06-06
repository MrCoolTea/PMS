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

function guestColor(vip) {
  if (vip === 'VIP') return 'warning';
  if (vip === 'Returning') return 'success';
  return 'default';
}

export function GuestsPage() {
  const { data, addGuest } = useResort();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '',
    notes: '',
  });

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addGuest(form);
    setForm({
      name: '',
      phone: '',
      email: '',
      nationality: '',
      notes: '',
    });
  }

  return (
    <Stack spacing={3}>
      <Paper className="hero-panel" elevation={0}>
        <Typography className="eyebrow">Guests</Typography>
        <Typography variant="h3" className="hero-title">
          Guest profiles and stay preferences
        </Typography>
        <Typography className="hero-copy">
          Keep a clean guest list with contact details, nationality, loyalty status,
          and special notes for service teams.
        </Typography>
      </Paper>

      <Box className="dashboard-grid">
        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Guest Directory
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.guests.map((guest) => (
              <Box key={guest.id} className="record-card">
                <Box>
                  <Typography className="row-title">{guest.name}</Typography>
                  <Typography className="row-copy">
                    {guest.email} • {guest.phone}
                  </Typography>
                  <Typography className="row-copy">
                    {guest.nationality} • {guest.notes}
                  </Typography>
                </Box>
                <Chip label={guest.vip} color={guestColor(guest.vip)} />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Add Guest
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} />
            <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} />
            <TextField
              label="Nationality"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
            />
            <TextField
              label="Guest Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              multiline
              minRows={3}
            />
            <Button type="submit" variant="contained">
              Save Guest
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
