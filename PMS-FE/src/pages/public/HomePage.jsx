import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useResort } from '../../context/ResortContext.jsx';
import { ui } from '../../styles/ui.js';

export function HomePage() {
  const { data } = useResort();
  const featuredRooms = data.rooms.slice(0, 3);
  const social = data.socialMedia.slice(0, 3);
  const content = data.siteContent ?? {};

  return (
    <Stack spacing={3}>
      <Paper sx={ui.publicHero()} elevation={0}>
        <Typography sx={ui.eyebrow}>{content.homeEyebrow ?? data.resort.location}</Typography>
        <Typography variant="h1" sx={ui.publicTitle}>
          {content.homeHeadline ?? `Escape to ${data.resort.name}`}
        </Typography>
        <Typography sx={ui.publicCopy}>
          {content.homeCopy ?? data.resort.tagline}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
          <Button component={Link} to="/book" variant="contained" size="large">
            Check Availability
          </Button>
          <Button component={Link} to="/experiences" variant="outlined" size="large">
            Explore Experiences
          </Button>
        </Stack>
      </Paper>

      <Box sx={ui.statsGrid(2)}>
        <Paper sx={ui.statCard} elevation={0}>
          <Typography sx={ui.statTitle}>Room Types</Typography>
          <Typography variant="h4" sx={ui.statValue}>
            {new Set(data.rooms.map((room) => room.type)).size}
          </Typography>
          <Typography sx={ui.statNote}>Villas, suites, lofts, and cabins</Typography>
        </Paper>
        <Paper sx={ui.statCard} elevation={0}>
          <Typography sx={ui.statTitle}>Scheduled Experiences</Typography>
          <Typography variant="h4" sx={ui.statValue}>
            {data.programs.filter((program) => program.status === 'Scheduled').length}
          </Typography>
          <Typography sx={ui.statNote}>Daily guest activities available</Typography>
        </Paper>
      </Box>

      <Box sx={ui.dashboardGrid()}>
        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h4" sx={ui.panelTitle}>
            Featured Rooms
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {featuredRooms.map((room) => (
              <Box key={room.id} sx={ui.recordCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{room.name}</Typography>
                  <Typography sx={ui.rowCopy}>
                    {room.type} • {room.capacity} guests • {room.amenities}
                  </Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={1}>
                  <Typography sx={ui.rowStrong}>${room.rate}/night</Typography>
                  <Chip label={room.status} variant="outlined" />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper sx={ui.contentPanel} elevation={0}>
          <Typography variant="h4" sx={ui.panelTitle}>
            Follow the Resort
          </Typography>
          <Typography sx={ui.panelCopy}>
            Social channels configured in your admin frontend can also surface here.
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {social.map((account) => (
              <Box key={account.id} sx={ui.taskCard}>
                <Box>
                  <Typography sx={ui.rowTitle}>{account.platform}</Typography>
                  <Typography sx={ui.rowCopy}>{account.handle}</Typography>
                </Box>
                <Chip label="Live" color="success" variant="outlined" />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
