import {
  Box,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import BedroomParentRoundedIcon from '@mui/icons-material/BedroomParentRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import { useResort } from '../../context/ResortContext.jsx';
import '../../App.css';

export function DashboardPage() {
  const { data } = useResort();

  const totalRooms = data.rooms.length;
  const occupiedRooms = data.rooms.filter((room) => room.status === 'Occupied').length;
  const availableRooms = data.rooms.filter((room) => room.status === 'Available').length;
  const totalRevenue = data.payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );
  const activePrograms = data.programs.filter((program) => program.status === 'Scheduled').length;
  const occupancyRate = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const statCards = [
    {
      title: 'Occupied Rooms',
      value: `${occupiedRooms}/${totalRooms}`,
      note: `${occupancyRate}% occupancy`,
      icon: <BedroomParentRoundedIcon fontSize="small" />,
    },
    {
      title: 'Available Tonight',
      value: availableRooms,
      note: 'Ready for new bookings',
      icon: <EventAvailableRoundedIcon fontSize="small" />,
    },
    {
      title: 'Payments Logged',
      value: `$${totalRevenue.toLocaleString()}`,
      note: `${data.payments.length} transactions`,
      icon: <PaymentsRoundedIcon fontSize="small" />,
    },
    {
      title: 'Scheduled Programs',
      value: activePrograms,
      note: 'Guest activities on deck',
      icon: <EventRoundedIcon fontSize="small" />,
    },
    {
      title: 'Guest Profiles',
      value: data.guests.length,
      note: 'CRM-ready guest list',
      icon: <GroupsRoundedIcon fontSize="small" />,
    },
    {
      title: 'Connected Channels',
      value: data.integrations.filter((item) => item.status === 'Connected').length,
      note: 'OTA and metasearch sync',
      icon: <HubRoundedIcon fontSize="small" />,
    },
  ];

  return (
    <Stack spacing={3}>
      <Paper className="hero-panel" elevation={0}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography className="eyebrow">Overview</Typography>
            <Typography variant="h3" className="hero-title">
              Resort operations at a glance
            </Typography>
            <Typography className="hero-copy">
              Manage rooms, reservations, guest activities, payment tracking,
              social channels, and OTA integrations from one frontend control
              center.
            </Typography>
          </Box>

          <Box className="progress-card">
            <Typography className="progress-label">Room occupancy</Typography>
            <Typography variant="h4">{occupancyRate}%</Typography>
            <LinearProgress
              variant="determinate"
              value={occupancyRate}
              className="collection-progress"
            />
            <Typography className="progress-subtext">
              {occupiedRooms} occupied, {availableRooms} available
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Box className="stats-grid stats-grid-wide">
        {statCards.map((card) => (
          <Paper key={card.title} className="stat-card" elevation={0}>
            <Box className="stat-icon">{card.icon}</Box>
            <Typography className="stat-title">{card.title}</Typography>
            <Typography variant="h4" className="stat-value">
              {card.value}
            </Typography>
            <Typography className="stat-note">{card.note}</Typography>
          </Paper>
        ))}
      </Box>

      <Box className="dashboard-grid dashboard-grid-overview">
        <Paper className="content-panel" elevation={0}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h5" className="panel-title">
                Reservations and Rooms
              </Typography>
              <Typography className="panel-copy">
                Current stay flow across the resort
              </Typography>
            </Box>
            <Chip label={`${data.reservations.length} reservations`} color="primary" variant="outlined" />
          </Stack>

          <Stack divider={<Divider flexItem />} spacing={0}>
            {data.reservations.map((reservation) => (
              <Box key={reservation.id} className="property-row">
                <Box>
                  <Typography className="row-title">{reservation.guest}</Typography>
                  <Typography className="row-copy">
                    {reservation.room} • {reservation.checkIn} to {reservation.checkOut}
                  </Typography>
                </Box>
                <Box className="row-meta">
                  <Typography className="row-strong">${reservation.total}</Typography>
                  <Typography className="row-copy">
                    {reservation.source} • {reservation.status}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="content-panel" elevation={0}>
          <Typography variant="h5" className="panel-title">
            Resort Queue
          </Typography>
          <Typography className="panel-copy">
            Programs, channels, and marketing items
          </Typography>

          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.programs.slice(0, 2).map((program) => (
              <Box key={program.id} className="task-card">
                <Box>
                  <Typography className="row-title">{program.title}</Typography>
                  <Typography className="row-copy">
                    {program.schedule} • {program.venue}
                  </Typography>
                </Box>
                <Chip label={program.status} variant="outlined" />
              </Box>
            ))}

            {data.integrations.slice(0, 3).map((integration) => (
              <Box key={integration.id} className="task-card">
                <Box>
                  <Typography className="row-title">{integration.platform}</Typography>
                  <Typography className="row-copy">{integration.notes}</Typography>
                </Box>
                <Chip label={integration.status} variant="outlined" />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
