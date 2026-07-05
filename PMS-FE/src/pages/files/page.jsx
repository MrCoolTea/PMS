import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  createFileRecord,
  deleteFileRecord,
  listFiles,
  updateFileRecord,
} from '../../lib/files.js';
import { ui } from '../../styles/ui.js';

const emptyForm = {
  name: '',
  area: '',
  category: '',
  updatedAt: '',
};

export function FilesPage() {
  const { accessToken } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let active = true;

    async function loadFiles() {
      try {
        setLoading(true);
        setError('');
        const nextFiles = await listFiles(accessToken);
        if (active) setFiles(nextFiles);
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFiles();
    return () => {
      active = false;
    };
  }, [accessToken]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleEdit(file) {
    setSelectedId(file.id);
    setForm({
      name: file.name ?? '',
      area: file.area ?? '',
      category: file.category ?? '',
      updatedAt: file.updatedAt ?? '',
    });
  }

  function resetForm() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      name: form.name.trim(),
      area: form.area.trim(),
      category: form.category.trim(),
      updatedAt: form.updatedAt,
    };

    try {
      setError('');
      if (selectedId) {
        const updated = await updateFileRecord(accessToken, selectedId, payload);
        setFiles((current) => current.map((file) => (file.id === updated.id ? updated : file)));
      } else {
        const created = await createFileRecord(accessToken, payload);
        setFiles((current) => [created, ...current]);
      }
      resetForm();
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  async function handleDelete(id) {
    try {
      setError('');
      await deleteFileRecord(accessToken, id);
      setFiles((current) => current.filter((file) => file.id !== id));
      if (selectedId === id) resetForm();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Files</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>Resort docs, rate sheets, and vendor references</Typography>
        <Typography sx={ui.heroCopy}>Store records for operations, guest services, finance, and marketing assets.</Typography>
      </Paper>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>File Library</Typography>
          {error ? <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert> : null}
          {loading ? (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
              <CircularProgress size={24} />
              <Typography sx={ui.panelCopy}>Loading files...</Typography>
            </Stack>
          ) : (
            <Stack spacing={1.5} sx={{ mt: 2.5 }}>
              {files.map((file) => (
                <Box key={file.id} sx={ui.recordCard}>
                  <Box>
                    <Typography sx={ui.rowTitle}>{file.name}</Typography>
                    <Typography sx={ui.rowCopy}>{file.area} • Updated {file.updatedAt}</Typography>
                  </Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Chip label={file.category} variant="outlined" />
                    <Button variant="outlined" onClick={() => handleEdit(file)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(file.id)}>Delete</Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>{selectedId ? 'Edit File Record' : 'Add File Record'}</Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField required label="File Name" name="name" value={form.name} onChange={handleChange} />
            <TextField required label="Department / Area" name="area" value={form.area} onChange={handleChange} />
            <TextField required label="Category" name="category" value={form.category} onChange={handleChange} />
            <TextField label="Updated At" type="date" name="updatedAt" value={form.updatedAt} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <Stack direction="row" spacing={1.5}>
              <Button type="submit" variant="contained">{selectedId ? 'Save Changes' : 'Save Record'}</Button>
              {selectedId ? <Button onClick={resetForm}>Cancel</Button> : null}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
