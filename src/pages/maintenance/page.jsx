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

function programColor(status) {
  if (status === 'Scheduled') return 'success';
  if (status === 'Draft') return 'warning';
  return 'default';
}

export function ProgramsPage() {
  const { data, addProgram } = useResort();
  const [form, setForm] = useState({
    title: '',
    schedule: '',
    venue: '',
    host: '',
    capacity: '',
  });

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addProgram({
      ...form,
      capacity: Number(form.capacity) || 0,
    });
    setForm({
      title: '',
      schedule: '',
      venue: '',
      host: '',
      capacity: '',
    });
  }

  return (
    <Stack spacing={3}>
      <Paper className="hero-panel" elevation={0}>
        <Typography className="eyebrow">Programs</Typography>
        <Typography variant="h3" className="hero-title">
          Scheduled resort programs and guest activities
        </Typography>
        <Typography className="hero-copy">
          Plan tours, yoga, kids activities, entertainment, and other guest-facing
          programs with dates and capacity.
        </Typography>
      </Paper>

      <Box className="dashboard-grid">
        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Program Schedule
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.programs.map((program) => (
              <Box key={program.id} className="record-card">
                <Box>
                  <Typography className="row-title">{program.title}</Typography>
                  <Typography className="row-copy">
                    {program.schedule} • {program.venue}
                  </Typography>
                  <Typography className="row-copy">
                    {program.host} • {program.bookings}/{program.capacity} booked
                  </Typography>
                </Box>
                <Chip label={program.status} color={programColor(program.status)} />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Add Program
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField label="Program Title" name="title" value={form.title} onChange={handleChange} />
            <TextField
              label="Schedule"
              name="schedule"
              value={form.schedule}
              onChange={handleChange}
              placeholder="2026-06-10 17:30"
            />
            <TextField label="Venue" name="venue" value={form.venue} onChange={handleChange} />
            <TextField label="Host Team" name="host" value={form.host} onChange={handleChange} />
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
            />
            <Button type="submit" variant="contained">
              Save Program
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
