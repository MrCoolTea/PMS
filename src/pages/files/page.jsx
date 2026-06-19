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

export function FilesPage() {
  const { data, addFile } = useResort();
  const [form, setForm] = useState({
    name: '',
    area: '',
    category: '',
  });

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    addFile(form);
    setForm({
      name: '',
      area: '',
      category: '',
    });
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Files</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Resort docs, rate sheets, and vendor references
        </Typography>
        <Typography sx={ui.heroCopy}>
          Store frontend records for operations, guest services, finance, and
          marketing assets.
        </Typography>
      </Paper>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            File Library
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.files.map((file) => (
              <Box key={file.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{file.name}</Typography>
                  <Typography sx={ui.rowCopy}>
                    {file.area} • Updated {file.updatedAt}
                  </Typography>
                </Box>
                <Chip label={file.category} variant="outlined" />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Add File Record
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField label="File Name" name="name" value={form.name} onChange={handleChange} />
            <TextField label="Department / Area" name="area" value={form.area} onChange={handleChange} />
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
            <Button type="submit" variant="contained">
              Save Record
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
