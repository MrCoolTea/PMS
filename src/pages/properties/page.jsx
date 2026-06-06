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

function roomColor(status) {
  if (status === 'Occupied') return 'error';
  if (status === 'Reserved') return 'warning';
  if (status === 'Maintenance') return 'default';
  return 'success';
}

export function RoomsPage() {
  const { data, addRoom } = useResort();
  const [form, setForm] = useState({
    name: '',
    type: '',
    capacity: '',
    rate: '',
    floor: '',
    amenities: '',
  });

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addRoom({
      ...form,
      capacity: Number(form.capacity) || 0,
      rate: Number(form.rate) || 0,
    });
    setForm({
      name: '',
      type: '',
      capacity: '',
      rate: '',
      floor: '',
      amenities: '',
    });
  }

  return (
    <Stack spacing={3}>
      <Paper className="hero-panel" elevation={0}>
        <Typography className="eyebrow">Rooms</Typography>
        <Typography variant="h3" className="hero-title">
          Room inventory and nightly rates
        </Typography>
        <Typography className="hero-copy">
          Manage room types, capacities, pricing, locations, and current availability.
        </Typography>
      </Paper>

      <Box className="dashboard-grid">
        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Room List
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.rooms.map((room) => (
              <Box key={room.id} className="record-card">
                <Box>
                  <Typography className="row-title">{room.name}</Typography>
                  <Typography className="row-copy">
                    {room.type} • {room.floor} • {room.capacity} guests
                  </Typography>
                  <Typography className="row-copy">
                    ${room.rate}/night • {room.amenities}
                  </Typography>
                </Box>
                <Chip label={room.status} color={roomColor(room.status)} />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Add Room
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField label="Room Name" name="name" value={form.name} onChange={handleChange} />
            <TextField label="Type" name="type" value={form.type} onChange={handleChange} />
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
            />
            <TextField
              label="Nightly Rate"
              name="rate"
              type="number"
              value={form.rate}
              onChange={handleChange}
            />
            <TextField label="Area / Wing" name="floor" value={form.floor} onChange={handleChange} />
            <TextField
              label="Amenities"
              name="amenities"
              value={form.amenities}
              onChange={handleChange}
              multiline
              minRows={2}
            />
            <Button type="submit" variant="contained">
              Save Room
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
