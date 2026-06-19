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
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Programs</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Scheduled resort programs and guest activities
        </Typography>
        <Typography sx={ui.heroCopy}>
          Plan tours, yoga, kids activities, entertainment, and other guest-facing
          programs with dates and capacity.
        </Typography>
      </Paper>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Program Schedule
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.programs.map((program) => (
              <Box key={program.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{program.title}</Typography>
                  <Typography sx={ui.rowCopy}>
                    {program.schedule} • {program.venue}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {program.host} • {program.bookings}/{program.capacity} booked
                  </Typography>
                </Box>
                <Chip label={program.status} color={programColor(program.status)} />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
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
