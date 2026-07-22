import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import { useResort } from '../../context/ResortContext.jsx';
import { createRoom, deleteRoom, listRooms, updateRoom } from '../../lib/rooms.js';
import { ui } from '../../styles/ui.js';
import { formatCurrency } from '../../utils/currency.js';

const emptyForm = {
  name: '',
  type: 'Standard',
  capacity: '',
  rate: '',
  floor: 'Main',
  amenities: 'Included',
  image: '',
  imageName: '',
  status: 'Available',
};

const statusOptions = ['Available', 'Reserved', 'Occupied', 'Maintenance'];
const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const maxImageSizeInBytes = 5 * 1024 * 1024;

function roomColor(status) {
  if (status === 'Occupied') return 'error';
  if (status === 'Reserved') return 'warning';
  if (status === 'Maintenance') return 'default';
  return 'success';
}

function mapRoomToForm(room) {
  return {
    name: room.name ?? '',
    type: room.type ?? '',
    capacity: String(room.capacity ?? ''),
    rate: String(room.rate ?? ''),
    floor: room.floor ?? '',
    amenities: room.amenities ?? '',
    image: room.image ?? '',
    imageName: '',
    status: room.status ?? 'Available',
  };
}

export function RoomsPage() {
  const { accessToken } = useAuth();
  const { data } = useResort();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [roomPendingDelete, setRoomPendingDelete] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const currency = data.settings?.currency;

  useEffect(() => {
    let active = true;

    async function loadRooms() {
      if (!accessToken) {
        if (active) {
          setRooms([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');
        const nextRooms = await listRooms(accessToken);

        if (active) {
          setRooms(nextRooms);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRooms();

    return () => {
      active = false;
    };
  }, [accessToken]);

  function closeDialog() {
    setOpen(false);
    setDialogMode('create');
    setSelectedRoomId(null);
    setForm(emptyForm);
  }

  function openCreateDialog() {
    setError('');
    setDialogMode('create');
    setSelectedRoomId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditDialog(room) {
    setError('');
    setDialogMode('edit');
    setSelectedRoomId(room.id);
    setForm(mapRoomToForm(room));
    setOpen(true);
  }

  function openDeleteDialog(room) {
    setError('');
    setRoomPendingDelete(room);
    setDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    if (deletingRoomId) {
      return;
    }

    setDeleteDialogOpen(false);
    setRoomPendingDelete(null);
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!acceptedImageTypes.includes(file.type)) {
      setError('Room image must be a JPG, PNG, WEBP, or GIF file.');
      event.target.value = '';
      return;
    }

    if (file.size > maxImageSizeInBytes) {
      setError('Room image must be 5 MB or smaller.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setError('');
      setForm((current) => ({
        ...current,
        image: typeof reader.result === 'string' ? reader.result : '',
        imageName: file.name,
      }));
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      name: form.name.trim(),
      type: form.type.trim(),
      capacity: Number(form.capacity),
      rate: Number(form.rate),
      floor: form.floor.trim(),
      amenities: form.amenities.trim(),
      image: form.image.trim(),
      status: form.status,
    };

    try {
      if (dialogMode === 'edit' && selectedRoomId) {
        const updatedRoom = await updateRoom(accessToken, selectedRoomId, payload);
        setRooms((current) =>
          current.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))
        );
      } else {
        const createdRoom = await createRoom(accessToken, payload);
        setRooms((current) => [createdRoom, ...current]);
      }

      closeDialog();
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!roomPendingDelete) {
      return;
    }

    try {
      setError('');
      setDeletingRoomId(roomPendingDelete.id);
      await deleteRoom(accessToken, roomPendingDelete.id);
      setRooms((current) => current.filter((entry) => entry.id !== roomPendingDelete.id));
      setDeleteDialogOpen(false);
      setRoomPendingDelete(null);
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingRoomId(null);
    }
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
              Create, edit, and delete rooms from the backend inventory.
            </Typography>
          </Box>
          <Button variant="contained" onClick={openCreateDialog}>
            Add Room
          </Button>
        </Stack>

        {error ? <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert> : null}

        {loading ? (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
            <CircularProgress size={24} />
            <Typography sx={ui.panelCopy}>Loading rooms...</Typography>
          </Stack>
        ) : rooms.length ? (
          <Box sx={{ ...ui.roomsGrid, mt: 2.5 }}>
            {rooms.map((room) => (
              <Box key={room.id} sx={{ ...ui.recordCard, ...ui.roomCard }}>
                <Box sx={ui.roomCardMain}>
                  <Box sx={ui.roomCardMedia}>
                    {room.image ? (
                      <Box
                        component="img"
                        src={room.image}
                        alt={room.name}
                        sx={ui.roomCardImage}
                      />
                    ) : (
                      <Typography sx={ui.rowCopy}>No image</Typography>
                    )}
                  </Box>
                  <Typography sx={ui.rowTitle}>{room.name}</Typography>
                  <Typography sx={ui.rowCopy}>{room.capacity} guests</Typography>
                  <Typography sx={ui.rowCopy}>
                    {formatCurrency(room.rate, currency)}/night
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
                  <Chip label={room.status} color={roomColor(room.status)} size="small" />
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => openEditDialog(room)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => openDeleteDialog(room)}
                      disabled={deletingRoomId === room.id}
                    >
                      {deletingRoomId === room.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography sx={{ ...ui.panelCopy, mt: 2.5 }}>
            No rooms found yet. Add your first room to create the inventory.
          </Typography>
        )}
      </Paper>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dialogMode === 'edit' ? 'Edit Room' : 'Add Room'}</DialogTitle>
        <Stack component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Room Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                inputProps={{ min: 1 }}
                required
              />
              <TextField
                label="Nightly Rate"
                name="rate"
                type="number"
                value={form.rate}
                onChange={handleChange}
                inputProps={{ min: 0, step: '0.01' }}
                required
              />
              <TextField
                select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
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
            <Button onClick={closeDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting
                ? dialogMode === 'edit'
                  ? 'Saving...'
                  : 'Creating...'
                : dialogMode === 'edit'
                  ? 'Save Changes'
                  : 'Save Room'}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete Room</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Delete room "{roomPendingDelete?.name}" from the inventory?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={closeDeleteDialog} disabled={Boolean(deletingRoomId)}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={Boolean(deletingRoomId)}
          >
            {deletingRoomId ? 'Deleting...' : 'Delete Room'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
