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
import { createGuest, deleteGuest, listGuests, updateGuest } from '../../lib/guests.js';
import { ui } from '../../styles/ui.js';

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  nationality: '',
  notes: '',
  vip: 'Standard',
};

const vipOptions = ['Standard', 'VIP', 'Returning'];

function guestColor(vip) {
  if (vip === 'VIP') return 'warning';
  if (vip === 'Returning') return 'success';
  return 'default';
}

function mapGuestToForm(guest) {
  return {
    name: guest.name ?? '',
    phone: guest.phone ?? '',
    email: guest.email ?? '',
    nationality: guest.nationality ?? '',
    notes: guest.notes ?? '',
    vip: guest.vip ?? 'Standard',
  };
}

export function GuestsPage() {
  const { accessToken } = useAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingGuestId, setDeletingGuestId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadGuests() {
      if (!accessToken) {
        if (active) {
          setGuests([]);
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError('');
        const nextGuests = await listGuests(accessToken);

        if (active) {
          setGuests(nextGuests);
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

    loadGuests();

    return () => {
      active = false;
    };
  }, [accessToken]);

  function closeDialog() {
    setOpen(false);
    setDialogMode('create');
    setSelectedGuestId(null);
    setForm(emptyForm);
  }

  function openCreateDialog() {
    setError('');
    setDialogMode('create');
    setSelectedGuestId(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditDialog(guest) {
    setError('');
    setDialogMode('edit');
    setSelectedGuestId(guest.id);
    setForm(mapGuestToForm(guest));
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
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      nationality: form.nationality.trim(),
      notes: form.notes.trim(),
      vip: form.vip,
    };

    try {
      if (dialogMode === 'edit' && selectedGuestId) {
        const updatedRecord = await updateGuest(accessToken, selectedGuestId, payload);
        setGuests((current) =>
          current.map((guest) => (guest.id === updatedRecord.id ? updatedRecord : guest))
        );
      } else {
        const createdGuest = await createGuest(accessToken, payload);
        setGuests((current) => [createdGuest, ...current]);
      }

      closeDialog();
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(guest) {
    const confirmed = window.confirm(`Delete guest "${guest.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setDeletingGuestId(guest.id);
      await deleteGuest(accessToken, guest.id);
      setGuests((current) => current.filter((entry) => entry.id !== guest.id));
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingGuestId(null);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Guests</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Guest profiles and stay preferences
        </Typography>
        <Typography sx={ui.heroCopy}>
          Keep a clean guest list with contact details, nationality, loyalty status,
          and special notes for service teams.
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
              Guest Directory
            </Typography>
            <Typography sx={{ ...ui.panelCopy, mt: 0.5 }}>
              Create, edit, and delete guest profiles from the backend CRM list.
            </Typography>
          </Box>
          <Button variant="contained" onClick={openCreateDialog}>
            Add Guest
          </Button>
        </Stack>

        {error ? <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert> : null}

        {loading ? (
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
            <CircularProgress size={24} />
            <Typography sx={ui.panelCopy}>Loading guests...</Typography>
          </Stack>
        ) : guests.length ? (
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {guests.map((guest) => (
              <Box key={guest.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{guest.name}</Typography>
                  <Typography sx={ui.rowCopy}>
                    {guest.email || 'No email'} • {guest.phone || 'No phone'}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {guest.nationality || 'No nationality'} • {guest.notes || 'No notes yet'}
                  </Typography>
                </Box>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                  <Chip label={guest.vip || 'Standard'} color={guestColor(guest.vip)} />
                  <Button variant="outlined" onClick={() => openEditDialog(guest)}>
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(guest)}
                    disabled={deletingGuestId === guest.id}
                  >
                    {deletingGuestId === guest.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography sx={{ ...ui.panelCopy, mt: 3 }}>
            No guest profiles yet. Add your first guest to start the CRM list.
          </Typography>
        )}
      </Paper>

      <Dialog open={open} onClose={submitting ? undefined : closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dialogMode === 'edit' ? 'Edit Guest' : 'Add Guest'}</DialogTitle>
        <DialogContent>
          <Stack
            id="guest-form"
            component="form"
            spacing={2}
            sx={{ pt: 1 }}
            onSubmit={handleSubmit}
          >
            <TextField
              required
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Nationality"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
            />
            <TextField
              select
              label="Loyalty Status"
              name="vip"
              value={form.vip}
              onChange={handleChange}
            >
              {vipOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Guest Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="guest-form"
            variant="contained"
            disabled={submitting}
          >
            {submitting
              ? dialogMode === 'edit'
                ? 'Saving...'
                : 'Creating...'
              : dialogMode === 'edit'
                ? 'Save Changes'
                : 'Create Guest'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
