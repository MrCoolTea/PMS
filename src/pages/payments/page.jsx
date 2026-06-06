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

function paymentColor(status) {
  if (status === 'Paid') return 'success';
  if (status === 'Partial') return 'warning';
  return 'default';
}

export function PaymentsPage() {
  const { data, recordPayment } = useResort();
  const [form, setForm] = useState({
    guest: '',
    reservation: '',
    amount: '',
    method: '',
    source: '',
  });

  const totalCollected = data.payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    recordPayment({
      ...form,
      amount: Number(form.amount) || 0,
    });
    setForm({
      guest: '',
      reservation: '',
      amount: '',
      method: '',
      source: '',
    });
  }

  return (
    <Stack spacing={3}>
      <Paper className="hero-panel" elevation={0}>
        <Typography className="eyebrow">Payments</Typography>
        <Typography variant="h3" className="hero-title">
          Stays, deposits, and front-desk collections
        </Typography>
        <Typography className="hero-copy">
          Record guest payments from direct bookings, OTAs, and walk-ins while
          keeping payment methods visible.
        </Typography>
      </Paper>

      <Box className="stats-grid stats-grid-compact">
        <Paper className="stat-card" elevation={0}>
          <Typography className="stat-title">Total Collected</Typography>
          <Typography variant="h4" className="stat-value">
            ${totalCollected.toLocaleString()}
          </Typography>
        </Paper>
        <Paper className="stat-card" elevation={0}>
          <Typography className="stat-title">Partial Payments</Typography>
          <Typography variant="h4" className="stat-value">
            {data.payments.filter((payment) => payment.status === 'Partial').length}
          </Typography>
        </Paper>
      </Box>

      <Box className="dashboard-grid">
        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Payment Ledger
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.payments.map((payment) => (
              <Box key={payment.id} className="record-card">
                <Box>
                  <Typography className="row-title">
                    {payment.guest} • ${payment.amount}
                  </Typography>
                  <Typography className="row-copy">
                    {payment.reservation} • {payment.source}
                  </Typography>
                  <Typography className="row-copy">
                    {payment.method} • {payment.paidDate}
                  </Typography>
                </Box>
                <Chip label={payment.status} color={paymentColor(payment.status)} />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Record Payment
          </Typography>
          <Stack component="form" spacing={2} sx={{ mt: 2.5 }} onSubmit={handleSubmit}>
            <TextField label="Guest" name="guest" value={form.guest} onChange={handleChange} />
            <TextField
              label="Reservation ID / Reference"
              name="reservation"
              value={form.reservation}
              onChange={handleChange}
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
            />
            <TextField label="Method" name="method" value={form.method} onChange={handleChange} />
            <TextField label="Source" name="source" value={form.source} onChange={handleChange} />
            <Button type="submit" variant="contained">
              Post Payment
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
