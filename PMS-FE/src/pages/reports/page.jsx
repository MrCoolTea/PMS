import { Box, Paper, Stack, Typography } from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import { ui } from '../../styles/ui.js';

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
      <Paper sx={ui.heroPanel} elevation={0}>
        <Typography sx={ui.eyebrow}>Reports</Typography>
        <Typography variant="h3" sx={ui.heroTitle}>
          Revenue, occupancy, and channel performance
        </Typography>
        <Typography sx={ui.heroCopy}>
          Review the core numbers a resort team needs before backend analytics and
          exports are added.
        </Typography>
      </Paper>

      <Box sx={ui.statsGrid(4)}>
        {reportCards.map((card) => (
          <Paper key={card.title} sx={ui.statCard} elevation={0}>
            <Typography sx={ui.statTitle}>{card.title}</Typography>
            <Typography variant="h4" sx={ui.statValue}>
              {card.value}
            </Typography>
            <Typography sx={ui.statNote}>{card.note}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper sx={ui.contentPanel} elevation={0}>
        <Typography variant="h5" sx={ui.panelTitle}>
          Resort Summary
        </Typography>
        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          <Box sx={ui.recordCard}>
            <Typography sx={ui.rowTitle}>Social Reach Setup</Typography>
            <Typography sx={ui.rowCopy}>
              {data.socialMedia.length} social channels registered for the resort
              marketing team.
            </Typography>
          </Box>
          <Box sx={ui.recordCard}>
            <Typography sx={ui.rowTitle}>Channel Connectivity</Typography>
            <Typography sx={ui.rowCopy}>
              {data.integrations.filter((item) => item.status === 'Connected').length}{' '}
              booking integrations connected and ready for backend sync.
            </Typography>
          </Box>
          <Box sx={ui.recordCard}>
            <Typography sx={ui.rowTitle}>Document Coverage</Typography>
            <Typography sx={ui.rowCopy}>
              {data.files.length} stored frontend records across rates, vendors, and
              guest operations.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
