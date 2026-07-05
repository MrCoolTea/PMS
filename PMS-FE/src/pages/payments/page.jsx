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
import { createPayment, deletePayment, listPayments, updatePayment } from '../../lib/payments.js';
import { ui } from '../../styles/ui.js';

const emptyForm = {
  guest: '',
  reservation: '',
  amount: '',
  method: '',
  source: '',
  status: 'Paid',
  paidDate: '',
};

const statusOptions = ['Paid', 'Partial', 'Pending', 'Refunded'];

function paymentColor(status) {
  if (status === 'Paid') return 'success';
  if (status === 'Partial') return 'warning';
  return 'default';
}

export function PaymentsPage() {
  const { accessToken } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(null);

  const totalCollected = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        setLoading(true);
        setError('');
        const nextPayments = await listPayments(accessToken);

        if (active) {
          setPayments(nextPayments);
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPayments();
    return () => {
      active = false;
    };
  }, [accessToken]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleEdit(payment) {
    setSelectedId(payment.id);
    setForm({
      guest: payment.guest ?? '',
      reservation: payment.reservation ?? '',
      amount: String(payment.amount ?? ''),
      method: payment.method ?? '',
      source: payment.source ?? '',
      status: payment.status ?? 'Paid',
      paidDate: payment.paidDate ?? '',
    });
  }

  function resetForm() {
    setSelectedId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      guest: form.guest.trim(),
      reservation: form.reservation.trim(),
      amount: Number(form.amount),
      method: form.method.trim(),
      source: form.source.trim(),
      status: form.status,
      paidDate: form.paidDate,
    };

    try {
      setError('');
      if (selectedId) {
        const updated = await updatePayment(accessToken, selectedId, payload);
        setPayments((current) =>
          current.map((payment) => (payment.id === updated.id ? updated : payment))
        );
      } else {
        const created = await createPayment(accessToken, payload);
        setPayments((current) => [created, ...current]);
      }

      resetForm();
    } catch (submissionError) {
      setError(submissionError.message);
    }
  }

  async function handleDelete(id) {
    try {
      setError('');
      await deletePayment(accessToken, id);
      setPayments((current) => current.filter((payment) => payment.id !== id));
      if (selectedId === id) resetForm();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Payments</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Stays, deposits, and front-desk collections
        </Typography>
        <Typography sx={ui.heroCopy}>
          Record guest payments from direct bookings, OTAs, and walk-ins while keeping payment methods visible.
        </Typography>
      </Paper>

      <Box sx={ui.statsGrid(2)}>
        <Paper sx={ui.statCard} elevation={0}>
          <Typography sx={ui.statTitle}>Total Collected</Typography>
          <Typography variant="h4" sx={ui.statValue}>${totalCollected.toLocaleString()}</Typography>
        </Paper>
        <Paper sx={ui.statCard} elevation={0}>
          <Typography sx={ui.statTitle}>Partial Payments</Typography>
          <Typography variant="h4" sx={ui.statValue}>
            {payments.filter((payment) => payment.status === 'Partial').length}
          </Typography>
        </Paper>
      </Box>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>Payment Ledger</Typography>
          {error ? <Alert severity="error" sx={{ mt: 2.5 }}>{error}</Alert> : null}
          {loading ? (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 3 }}>
              <CircularProgress size={24} />
              <Typography sx={ui.panelCopy}>Loading payments...</Typography>
            </Stack>
          ) : (
            <Stack spacing={1.5} sx={{ mt: 2.5 }}>
              {payments.map((payment) => (
                <Box key={payment.id} sx={ui.recordCard}>
                  <Box>
                    <Typography sx={ui.rowTitle}>{payment.guest} • ${payment.amount}</Typography>
                    <Typography sx={ui.rowCopy}>{payment.reservation} • {payment.source}</Typography>
                    <Typography sx={ui.rowCopy}>{payment.method} • {payment.paidDate}</Typography>
                  </Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Chip label={payment.status} color={paymentColor(payment.status)} />
                    <Button variant="outlined" onClick={() => handleEdit(payment)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(payment.id)}>Delete</Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>{selectedId ? 'Edit Payment' : 'Record Payment'}</Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField required label="Guest" name="guest" value={form.guest} onChange={handleChange} />
            <TextField required label="Reservation ID / Reference" name="reservation" value={form.reservation} onChange={handleChange} />
            <TextField required label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} />
            <TextField required label="Method" name="method" value={form.method} onChange={handleChange} />
            <TextField required label="Source" name="source" value={form.source} onChange={handleChange} />
            <TextField required label="Paid Date" type="date" name="paidDate" value={form.paidDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField select label="Status" name="status" value={form.status} onChange={handleChange}>
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={1.5}>
              <Button type="submit" variant="contained">{selectedId ? 'Save Changes' : 'Post Payment'}</Button>
              {selectedId ? <Button onClick={resetForm}>Cancel</Button> : null}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
