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

function reservationColor(status) {
  if (status === 'Checked In') return 'success';
  if (status === 'Confirmed') return 'warning';
  return 'default';
}

export function ReservationsPage() {
  const { data, addReservation } = useResort();
  const [form, setForm] = useState({
    guest: '',
    room: '',
    checkIn: '',
    checkOut: '',
    source: '',
    total: '',
  });

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addReservation({
      ...form,
      total: Number(form.total) || 0,
    });
    setForm({
      guest: '',
      room: '',
      checkIn: '',
      checkOut: '',
      source: '',
      total: '',
    });
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Reservations</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Stays, arrivals, and booking sources
        </Typography>
        <Typography sx={ui.heroCopy}>
          Track direct and OTA reservations, room assignments, check-in dates, and
          booking totals.
        </Typography>
      </Paper>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Reservation Board
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.reservations.map((reservation) => (
              <Box key={reservation.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>
                    {reservation.guest} • {reservation.room}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {reservation.checkIn} to {reservation.checkOut}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {reservation.source} • ${reservation.total}
                  </Typography>
                </Box>
                <Chip label={reservation.status} color={reservationColor(reservation.status)} />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Create Reservation
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField label="Guest" name="guest" value={form.guest} onChange={handleChange} />
            <TextField label="Room" name="room" value={form.room} onChange={handleChange} />
            <TextField
              label="Check In"
              name="checkIn"
              type="date"
              value={form.checkIn}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Check Out"
              name="checkOut"
              type="date"
              value={form.checkOut}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField label="Booking Source" name="source" value={form.source} onChange={handleChange} />
            <TextField
              label="Total Amount"
              name="total"
              type="number"
              value={form.total}
              onChange={handleChange}
            />
            <Button type="submit" variant="contained">
              Save Reservation
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
