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
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Payments</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Stays, deposits, and front-desk collections
        </Typography>
        <Typography sx={ui.heroCopy}>
          Record guest payments from direct bookings, OTAs, and walk-ins while
          keeping payment methods visible.
        </Typography>
      </Paper>

      <Box sx={ui.statsGrid(2)}>
        <Paper sx={ui.statCard} elevation={0}>
          <Typography sx={ui.statTitle}>Total Collected</Typography>
          <Typography variant="h4" sx={ui.statValue}>
            ${totalCollected.toLocaleString()}
          </Typography>
        </Paper>
        <Paper sx={ui.statCard} elevation={0}>
          <Typography sx={ui.statTitle}>Partial Payments</Typography>
          <Typography variant="h4" sx={ui.statValue}>
            {data.payments.filter((payment) => payment.status === 'Partial').length}
          </Typography>
        </Paper>
      </Box>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Payment Ledger
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.payments.map((payment) => (
              <Box key={payment.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>
                    {payment.guest} • ${payment.amount}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {payment.reservation} • {payment.source}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {payment.method} • {payment.paidDate}
                  </Typography>
                </Box>
                <Chip label={payment.status} color={paymentColor(payment.status)} />
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
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
