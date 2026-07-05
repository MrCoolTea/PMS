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
import { createProgram, deleteProgram, listPrograms, updateProgram } from '../../lib/programs.js';
import { ui } from '../../styles/ui.js';

const emptyForm = {
  title: '',
  schedule: '',
  venue: '',
  host: '',
  capacity: '',
  bookings: '',
  status: 'Scheduled',
};

const statusOptions = ['Scheduled', 'Draft', 'Completed', 'Cancelled'];

function programColor(status) {
  if (status === 'Scheduled') return 'success';
  if (status === 'Draft') return 'warning';
  return 'default';
}

export function ProgramsPage() {
  const { accessToken } = useAuth();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadPrograms() {
      try {
        setLoading(true);
        setError('');
        const nextPrograms = await listPrograms(accessToken);

        if (active) {
          setPrograms(nextPrograms);
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPrograms();

    return () => {
      active = false;
    };
  }, [accessToken]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleEdit(program) {
    setSelectedId(program.id);
    setForm({
      title: program.title ?? '',
      schedule: program.schedule ?? '',
      venue: program.venue ?? '',
      host: program.host ?? '',
      capacity: String(program.capacity ?? ''),
      bookings: String(program.bookings ?? ''),
      status: program.status ?? 'Scheduled',
    });
  }

  function resetForm() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      schedule: form.schedule.trim(),
      venue: form.venue.trim(),
      host: form.host.trim(),
      capacity: Number(form.capacity),
      bookings: Number(form.bookings || 0),
      status: form.status,
    };

    try {
      if (selectedId) {
        const updated = await updateProgram(accessToken, selectedId, payload);
        setPrograms((current) =>
          current.map((program) => (program.id === updated.id ? updated : program))
        );
      } else {
        const created = await createProgram(accessToken, payload);
        setPrograms((current) => [created, ...current]);
      }

      resetForm();
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      setError('');
      await deleteProgram(accessToken, id);
      setPrograms((current) => current.filter((program) => program.id !== id));
      if (selectedId === id) {
        resetForm();
      }
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Programs</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Scheduled resort programs and guest activities
        </Typography>
        <Typography sx={ui.heroCopy}>
          Plan tours, yoga, kids activities, entertainment, and other guest-facing programs.
        </Typography>
      </Paper>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Program Schedule
          </Typography>
          {error ? <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert> : null}
          {loading ? (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
              <CircularProgress size={24} />
              <Typography sx={ui.panelCopy}>Loading programs...</Typography>
            </Stack>
          ) : (
            <Stack spacing={1.5} sx={{ mt: 2.5 }}>
              {programs.map((program) => (
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
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Chip label={program.status} color={programColor(program.status)} />
                    <Button variant="outlined" onClick={() => handleEdit(program)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(program.id)}>
                      Delete
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            {selectedId ? 'Edit Program' : 'Add Program'}
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField required label="Program Title" name="title" value={form.title} onChange={handleChange} />
            <TextField required label="Schedule" name="schedule" value={form.schedule} onChange={handleChange} />
            <TextField required label="Venue" name="venue" value={form.venue} onChange={handleChange} />
            <TextField required label="Host Team" name="host" value={form.host} onChange={handleChange} />
            <TextField required label="Capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} />
            <TextField label="Bookings" name="bookings" type="number" value={form.bookings} onChange={handleChange} />
            <TextField select label="Status" name="status" value={form.status} onChange={handleChange}>
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={1.5}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {selectedId ? 'Save Changes' : 'Save Program'}
              </Button>
              {selectedId ? <Button onClick={resetForm}>Cancel</Button> : null}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
