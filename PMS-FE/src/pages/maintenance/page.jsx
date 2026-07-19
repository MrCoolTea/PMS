import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import { createProgram, deleteProgram, listPrograms, updateProgram } from '../../lib/programs.js';
import { ui } from '../../styles/ui.js';

const emptyForm = {
  title: '',
  venue: '',
  host: '',
  capacity: '',
  bookings: '',
  imageUrl: '',
  isActive: true,
};

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });
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

  function handleActiveChange(event) {
    setForm((current) => ({ ...current, isActive: event.target.checked }));
  }

  function handleImageChange(event) {
    const [file] = event.target.files ?? [];
    event.target.value = '';

    if (!file) {
      return;
    }

    readFileAsDataUrl(file)
      .then((value) => {
        setForm((current) => ({ ...current, imageUrl: value }));
      })
      .catch(() => {
        setError('Unable to read program image file.');
      });
  }

  function handleEdit(program) {
    setSelectedId(program.id);
    setForm({
      title: program.title ?? '',
      venue: program.venue ?? '',
      host: program.host ?? '',
      capacity: String(program.capacity ?? ''),
      bookings: String(program.bookings ?? ''),
      imageUrl: program.imageUrl ?? '',
      isActive: program.isActive ?? true,
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
      venue: form.venue.trim(),
      host: form.host.trim(),
      capacity: Number(form.capacity),
      bookings: Number(form.bookings || 0),
      imageUrl: form.imageUrl,
      isActive: form.isActive,
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
                      {program.venue}
                    </Typography>
                    <Typography sx={ui.rowCopy}>
                      {program.host} • {program.bookings}/{program.capacity} booked
                    </Typography>
                  </Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Chip label={program.isActive ? 'Active' : 'Inactive'} color={program.isActive ? 'success' : 'default'} />
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
            <TextField required label="Venue" name="venue" value={form.venue} onChange={handleChange} />
            <TextField required label="Host Team" name="host" value={form.host} onChange={handleChange} />
            <TextField required label="Capacity" name="capacity" type="number" value={form.capacity} onChange={handleChange} />
            <TextField label="Bookings" name="bookings" type="number" value={form.bookings} onChange={handleChange} />
            <TextField
              label="Program Image URL"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              helperText="Paste an image URL or upload an image below."
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
              <Button component="label" variant="outlined">
                Upload Program Image
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </Button>
              <Button variant="text" color="inherit" onClick={() => setForm((current) => ({ ...current, imageUrl: '' }))}>
                Clear Image
              </Button>
            </Stack>
            {form.imageUrl ? (
              <Box
                component="img"
                src={form.imageUrl}
                alt="Program preview"
                sx={{
                  width: '100%',
                  maxWidth: 320,
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '1px solid rgba(20, 55, 44, 0.12)',
                  backgroundColor: '#fff',
                }}
              />
            ) : null}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Switch checked={form.isActive} onChange={handleActiveChange} />
              <Typography>{form.isActive ? 'Active on public Experiences page' : 'Inactive on public Experiences page'}</Typography>
            </Stack>
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
