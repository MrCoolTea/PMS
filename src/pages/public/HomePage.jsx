import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useResort } from '../../context/ResortContext.jsx';
import '../../App.css';

export function HomePage() {
  const { data } = useResort();
  const featuredRooms = data.rooms.slice(0, 3);
  const social = data.socialMedia.slice(0, 3);

  return (
    <Stack spacing={3}>
      <Paper className="public-hero" elevation={0}>
        <Typography className="eyebrow">{data.resort.location}</Typography>
        <Typography variant="h1" className="public-title">
          Escape to {data.resort.name}
        </Typography>
        <Typography className="public-copy">
          Beachfront villas, curated experiences, and direct online booking from one
          resort website.
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

      <Box className="stats-grid stats-grid-compact">
        <Paper className="stat-card" elevation={0}>
          <Typography className="stat-title">Room Types</Typography>
          <Typography variant="h4" className="stat-value">
            {new Set(data.rooms.map((room) => room.type)).size}
          </Typography>
          <Typography className="stat-note">Villas, suites, lofts, and cabins</Typography>
        </Paper>
        <Paper className="stat-card" elevation={0}>
          <Typography className="stat-title">Scheduled Experiences</Typography>
          <Typography variant="h4" className="stat-value">
            {data.programs.filter((program) => program.status === 'Scheduled').length}
          </Typography>
          <Typography className="stat-note">Daily guest activities available</Typography>
        </Paper>
      </Box>

      <Box className="dashboard-grid">
        <Paper className="content-panel" elevation={0}>
          <Typography variant="h4" className="panel-title">
            Featured Rooms
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {featuredRooms.map((room) => (
              <Box key={room.id} className="record-card">
                <Box>
                  <Typography className="row-title">{room.name}</Typography>
                  <Typography className="row-copy">
                    {room.type} • {room.capacity} guests • {room.amenities}
                  </Typography>
                </Box>
                <Stack alignItems="flex-end" spacing={1}>
                  <Typography className="row-strong">${room.rate}/night</Typography>
                  <Chip label={room.status} variant="outlined" />
                </Stack>
              </Box>
            ))}
          </Stack>
        </Paper>

        <Paper className="content-panel" elevation={0}>
          <Typography variant="h4" className="panel-title">
            Follow the Resort
          </Typography>
          <Typography className="panel-copy">
            Social channels configured in your admin frontend can also surface here.
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {social.map((account) => (
              <Box key={account.id} className="task-card">
                <Box>
                  <Typography className="row-title">{account.platform}</Typography>
                  <Typography className="row-copy">{account.handle}</Typography>
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
