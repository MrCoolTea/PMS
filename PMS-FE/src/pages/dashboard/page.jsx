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
import { ui } from '../../styles/ui.js';
import { formatCurrency } from '../../utils/currency.js';

export function DashboardPage() {
  const { data } = useResort();
  const currency = data.settings?.currency;

  const totalRooms = data.rooms.length;
  const occupiedRooms = data.rooms.filter((room) => room.status === 'Occupied').length;
  const availableRooms = data.rooms.filter((room) => room.status === 'Available').length;
  const totalRevenue = data.payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );
  const activePrograms = data.programs.filter((program) => program.isActive !== false).length;
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
      value: formatCurrency(totalRevenue, currency),
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
      <Paper sx={ui.heroPanel} elevation={0}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography sx={ui.eyebrow}>Overview</Typography>
            <Typography variant="h3" sx={ui.heroTitle}>
              Resort operations at a glance
            </Typography>
            <Typography sx={ui.heroCopy}>
              Manage rooms, reservations, guest activities, payment tracking,
              social channels, and OTA integrations from one frontend control
              center.
            </Typography>
          </Box>

          <Box sx={ui.progressCard}>
            <Typography sx={ui.progressLabel}>Room occupancy</Typography>
            <Typography variant="h4">{occupancyRate}%</Typography>
            <LinearProgress
              variant="determinate"
              value={occupancyRate}
              sx={ui.collectionProgress}
            />
            <Typography sx={ui.progressSubtext}>
              {occupiedRooms} occupied, {availableRooms} available
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Box sx={ui.statsGrid(6)}>
        {statCards.map((card) => (
          <Paper key={card.title} sx={ui.statCard} elevation={0}>
            <Box sx={ui.statIcon}>{card.icon}</Box>
            <Typography sx={ui.statTitle}>{card.title}</Typography>
            <Typography variant="h4" sx={ui.statValue}>
              {card.value}
            </Typography>
            <Typography sx={ui.statNote}>{card.note}</Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={ui.dashboardGrid(true)}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={ui.panelTitle}>
                Reservations and Rooms
              </Typography>
              <Typography sx={ui.panelCopy}>
                Current stay flow across the resort
              </Typography>
            </Box>
            <Chip label={`${data.reservations.length} reservations`} color="primary" variant="outlined" />
          </Stack>

          <Stack divider={<Divider flexItem />} spacing={0}>
            {data.reservations.map((reservation) => (
              <Box key={reservation.id} sx={ui.propertyRow}>
                <Box>
                  <Typography sx={ui.rowTitle}>{reservation.guest}</Typography>
                  <Typography sx={ui.rowCopy}>
                    {reservation.room} • {reservation.checkIn} to {reservation.checkOut}
                  </Typography>
                </Box>
                <Box sx={ui.rowMeta}>
                  <Typography sx={ui.rowStrong}>
                    {formatCurrency(reservation.total, currency)}
                  </Typography>
                  <Typography sx={ui.rowCopy}>
                    {reservation.source} • {reservation.status}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h5" sx={ui.panelTitle}>
            Resort Queue
          </Typography>
          <Typography sx={ui.panelCopy}>
            Programs, channels, and marketing items
          </Typography>

          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {data.programs.slice(0, 2).map((program) => (
              <Box key={program.id} sx={ui.taskCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{program.title}</Typography>
                  <Typography sx={ui.rowCopy}>
                    {program.schedule} • {program.venue}
                  </Typography>
                </Box>
                <Chip label={program.isActive !== false ? 'Active' : 'Inactive'} variant="outlined" />
              </Box>
            ))}

            {data.integrations.slice(0, 3).map((integration) => (
              <Box key={integration.id} sx={ui.taskCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{integration.platform}</Typography>
                  <Typography sx={ui.rowCopy}>{integration.notes}</Typography>
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
