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
      <Paper className="hero-panel" elevation={0}>
        <Typography className="eyebrow">Files</Typography>
        <Typography variant="h3" className="hero-title">
          Resort docs, rate sheets, and vendor references
        </Typography>
        <Typography className="hero-copy">
          Store frontend records for operations, guest services, finance, and
          marketing assets.
        </Typography>
      </Paper>

      <Box className="dashboard-grid">
        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            File Library
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.files.map((file) => (
              <Box key={file.id} className="record-card">
                <Box>
                  <Typography className="row-title">{file.name}</Typography>
                  <Typography className="row-copy">
                    {file.area} • Updated {file.updatedAt}
                  </Typography>
                </Box>
                <Chip label={file.category} variant="outlined" />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
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
