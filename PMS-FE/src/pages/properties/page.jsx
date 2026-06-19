import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import { ui } from '../../styles/ui.js';

function roomColor(status) {
  if (status === 'Occupied') return 'error';
  if (status === 'Reserved') return 'warning';
  if (status === 'Maintenance') return 'default';
  return 'success';
}

export function RoomsPage() {
  const { data, addRoom } = useResort();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: '',
    capacity: '',
    rate: '',
    floor: '',
    amenities: '',
    image: '',
    imageName: '',
  });

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        image: typeof reader.result === 'string' ? reader.result : '',
        imageName: file.name,
      }));
    };

    reader.readAsDataURL(file);
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
      image: '',
      imageName: '',
    });
    setOpen(false);
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Rooms</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Room inventory and nightly rates
        </Typography>
        <Typography sx={ui.heroCopy}>
          Manage room types, capacities, pricing, locations, and current availability.
        </Typography>
      </Paper>

      <Paper sx={ui.contentPanel} elevation={0}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" sx={ui.panelTitle}>
              Room List
            </Typography>
            <Typography sx={{ ...ui.panelCopy, mt: 0.5 }}>
              Showing rooms in a 5-column inventory grid.
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Room
          </Button>
        </Stack>

        <Box sx={{ ...ui.roomsGrid, mt: 2.5 }}>
          {data.rooms.map((room) => (
            <Box key={room.id} sx={{ ...ui.recordCard, ...ui.roomCard }}>
              <Box sx={ui.roomCardMain}>
                {room.image ? (
                  <Box
                    component="img"
                    src={room.image}
                    alt={room.name}
                    sx={ui.roomCardImage}
                  />
                ) : null}
                <Typography sx={ui.rowTitle}>{room.name}</Typography>
                <Typography sx={ui.rowCopy}>
                  {room.type} • {room.floor}
                </Typography>
                <Typography sx={ui.rowCopy}>{room.capacity} guests</Typography>
                <Typography sx={ui.rowCopy}>${room.rate}/night</Typography>
                <Typography sx={ui.rowCopy}>{room.amenities}</Typography>
              </Box>
              <Chip label={room.status} color={roomColor(room.status)} size="small" />
            </Box>
          ))}
        </Box>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Room</DialogTitle>
        <Stack component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
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
            <Stack spacing={1}>
              <Button component="label" variant="outlined">
                Upload Room Image
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </Button>
              {form.imageName ? (
                <Typography variant="body2" sx={ui.rowCopy}>
                  Selected image: {form.imageName}
                </Typography>
              ) : null}
              {form.image ? (
                <Box
                  component="img"
                  src={form.image}
                  alt="Room preview"
                  sx={ui.roomFormPreview}
                />
              ) : null}
            </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save Room
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>
    </Stack>
  );
}
