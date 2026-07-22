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
import {
  createReservation,
  deleteReservation,
  listReservations,
  updateReservation,
} from '../../lib/reservations.js';
import { ui } from '../../styles/ui.js';
import { useResort } from '../../context/ResortContext.jsx';
import { formatCurrency } from '../../utils/currency.js';

const emptyForm = {
  guest: '',
  room: '',
  checkIn: '',
  checkOut: '',
  source: 'Direct Website',
  total: '',
  status: 'Confirmed',
};

const statusOptions = ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled'];

function reservationColor(status) {
  if (status === 'Checked In') return 'success';
  if (status === 'Confirmed') return 'warning';
  if (status === 'Cancelled') return 'error';
  return 'default';
}

function mapReservationToForm(reservation) {
  return {
    guest: reservation.guest ?? '',
    room: reservation.room ?? '',
    checkIn: reservation.checkIn ?? '',
    checkOut: reservation.checkOut ?? '',
    source: reservation.source ?? 'Direct Website',
    total: String(reservation.total ?? ''),
    status: reservation.status ?? 'Confirmed',
  };
}

export function ReservationsPage() {
  const { accessToken } = useAuth();
  const { data } = useResort();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingReservationId, setDeletingReservationId] = useState(null);
  const currency = data.settings?.currency;

  useEffect(() => {
    let active = true;

    async function loadReservations() {
      if (!accessToken) {
        if (active) {
          setReservations([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');
        const nextReservations = await listReservations(accessToken);

        if (active) {
          setReservations(nextReservations);
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

    loadReservations();

    return () => {
      active = false;
    };
  }, [accessToken]);

  function closeDialog() {
    setOpen(false);
    setDialogMode('create');
    setSelectedReservationId(null);
    setForm(emptyForm);
  }

  function openCreateDialog() {
    setError('');
    setDialogMode('create');
    setSelectedReservationId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditDialog(reservation) {
    setError('');
    setDialogMode('edit');
    setSelectedReservationId(reservation.id);
    setForm(mapReservationToForm(reservation));
    setOpen(true);
  }

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      guest: form.guest.trim(),
      room: form.room.trim(),
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      source: form.source.trim(),
      total: Number(form.total),
      status: form.status,
    };

    try {
      if (dialogMode === 'edit' && selectedReservationId) {
        const updatedRecord = await updateReservation(
          accessToken,
          selectedReservationId,
          payload
        );
        setReservations((current) =>
          current.map((reservation) =>
            reservation.id === updatedRecord.id ? updatedRecord : reservation
          )
        );
      } else {
        const createdReservation = await createReservation(accessToken, payload);
        setReservations((current) => [createdReservation, ...current]);
      }

      closeDialog();
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(reservation) {
    const confirmed = window.confirm(
      `Delete reservation for "${reservation.guest}" in "${reservation.room}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setDeletingReservationId(reservation.id);
      await deleteReservation(accessToken, reservation.id);
      setReservations((current) =>
        current.filter((entry) => entry.id !== reservation.id)
      );
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingReservationId(null);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Reservations</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Stays, arrivals, and booking sources
        </Typography>
        <Typography sx={ui.heroCopy}>
          Track direct and OTA reservations, room assignments, check-in dates, and
          booking totals.
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
              Reservation Board
            </Typography>
            <Typography sx={{ ...ui.panelCopy, mt: 0.5 }}>
              Create, edit, and delete reservations from the backend booking list.
            </Typography>
          </Box>
          <Button variant="contained" onClick={openCreateDialog}>
            Add Reservation
          </Button>
        </Stack>

        {error ? <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert> : null}

        {loading ? (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
            <CircularProgress size={24} />
            <Typography sx={ui.panelCopy}>Loading reservations...</Typography>
          </Stack>
        ) : reservations.length ? (
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {reservations.map((reservation) => (
              <Box key={reservation.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>
                    {reservation.guest} • {reservation.room}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {reservation.checkIn} to {reservation.checkOut}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {reservation.source} • {formatCurrency(reservation.total, currency)}
                  </Typography>
                </Box>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                  <Chip
                    label={reservation.status || 'Confirmed'}
                    color={reservationColor(reservation.status)}
                  />
                  <Button variant="outlined" onClick={() => openEditDialog(reservation)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(reservation)}
                    disabled={deletingReservationId === reservation.id}
                  >
                    {deletingReservationId === reservation.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography sx={{ ...ui.panelCopy, mt: 3 }}>
            No reservations yet. Add your first booking to start the board.
          </Typography>
        )}
      </Paper>

      <Dialog open={open} onClose={submitting ? undefined : closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogMode === 'edit' ? 'Edit Reservation' : 'Add Reservation'}
        </DialogTitle>
        <DialogContent>
          <Stack
            id="reservation-form"
            component="form"
            spacing={2}
            sx={{ pt: 1 }}
            onSubmit={handleSubmit}
          >
            <TextField
              required
              label="Guest"
              name="guest"
              value={form.guest}
              onChange={handleChange}
            />
            <TextField
              required
              label="Room"
              name="room"
              value={form.room}
              onChange={handleChange}
            />
            <TextField
              required
              label="Check In"
              name="checkIn"
              type="date"
              value={form.checkIn}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              required
              label="Check Out"
              name="checkOut"
              type="date"
              value={form.checkOut}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Booking Source"
              name="source"
              value={form.source}
              onChange={handleChange}
            />
            <TextField
              required
              label="Total Amount"
              name="total"
              type="number"
              value={form.total}
              onChange={handleChange}
              slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
            />
            <TextField
              select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="reservation-form"
            variant="contained"
            disabled={submitting}
          >
            {submitting
              ? dialogMode === 'edit'
                ? 'Saving...'
                : 'Creating...'
              : dialogMode === 'edit'
                ? 'Save Changes'
                : 'Create Reservation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
