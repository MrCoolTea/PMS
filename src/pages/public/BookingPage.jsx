import { useMemo, useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import '../../App.css';

export function BookingPage() {
  const { data } = useResort();
  const [form, setForm] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
  });

  const availableRooms = useMemo(
    () => data.rooms.filter((room) => room.status === 'Available' || room.status === 'Reserved'),
    [data.rooms]
  );

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <Stack spacing={3}>
      <Paper className="public-hero public-hero-booking" elevation={0}>
        <Typography className="eyebrow">Direct Booking</Typography>
        <Typography variant="h2" className="public-title">
          Search dates and choose your stay
        </Typography>
        <Typography className="public-copy">
          This frontend booking page is ready to connect to your real availability,
          pricing, and payment backend later.
        </Typography>
      </Paper>

      <Paper className="content-panel" elevation={0}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Check In"
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Check Out"
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Guests"
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            fullWidth
          />
          <Button variant="contained" size="large">
            Search
          </Button>
        </Stack>
      </Paper>

      <Paper className="content-panel" elevation={0}>
        <Typography variant="h4" className="panel-title">
          Available Options
        </Typography>
        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          {availableRooms.map((room) => (
            <Box key={room.id} className="record-card">
              <Box>
                <Typography className="row-title">{room.name}</Typography>
                <Typography className="row-copy">
                  {room.type} • Sleeps {room.capacity} • {room.amenities}
                </Typography>
              </Box>
              <Stack alignItems="flex-end" spacing={1}>
                <Typography className="row-strong">${room.rate}/night</Typography>
                <Button variant="outlined">Select Room</Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
