import { Box, Paper, Stack, Typography } from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import '../../App.css';

export function ReportsPage() {
  const { data } = useResort();

  const totalRooms = data.rooms.length;
  const occupiedRooms = data.rooms.filter((room) => room.status === 'Occupied').length;
  const occupancyRate = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const totalRevenue = data.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const otaReservations = data.reservations.filter(
    (reservation) => reservation.source !== 'Direct Website'
  ).length;

  const reportCards = [
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      note: `${occupiedRooms}/${totalRooms} rooms occupied`,
    },
    {
      title: 'Recorded Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      note: 'Front desk and online payments',
    },
    {
      title: 'Scheduled Programs',
      value: data.programs.length,
      note: 'Experiences in the activity calendar',
    },
    {
      title: 'OTA Reservations',
      value: otaReservations,
      note: 'Bookings from connected channels',
    },
  ];

  return (
    <Stack spacing={3}>
      <Paper className="hero-panel" elevation={0}>
        <Typography className="eyebrow">Reports</Typography>
        <Typography variant="h3" className="hero-title">
          Revenue, occupancy, and channel performance
        </Typography>
        <Typography className="hero-copy">
          Review the core numbers a resort team needs before backend analytics and
          exports are added.
        </Typography>
      </Paper>

      <Box className="stats-grid">
        {reportCards.map((card) => (
          <Paper key={card.title} className="stat-card" elevation={0}>
            <Typography className="stat-title">{card.title}</Typography>
            <Typography variant="h4" className="stat-value">
              {card.value}
            </Typography>
            <Typography className="stat-note">{card.note}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper className="content-panel" elevation={0}>
        <Typography variant="h5" className="panel-title">
          Resort Summary
        </Typography>
        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          <Box className="record-card">
            <Typography className="row-title">Social Reach Setup</Typography>
            <Typography className="row-copy">
              {data.socialMedia.length} social channels registered for the resort
              marketing team.
            </Typography>
          </Box>
          <Box className="record-card">
            <Typography className="row-title">Channel Connectivity</Typography>
            <Typography className="row-copy">
              {data.integrations.filter((item) => item.status === 'Connected').length}{' '}
              booking integrations connected and ready for backend sync.
            </Typography>
          </Box>
          <Box className="record-card">
            <Typography className="row-title">Document Coverage</Typography>
            <Typography className="row-copy">
              {data.files.length} stored frontend records across rates, vendors, and
              guest operations.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
