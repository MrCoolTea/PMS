import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import { ui } from '../../styles/ui.js';

export function ExperiencesPage() {
  const { data } = useResort();

  return (
    <Stack spacing={3}>
      <Paper sx={ui.publicHero(true)} elevation={0}>
        <Typography sx={ui.eyebrow}>Experiences</Typography>
        <Typography variant="h2" sx={ui.publicTitle}>
          Curated activities for every stay
        </Typography>
        <Typography sx={ui.publicCopy}>
          Surface scheduled programs from the same resort system visitors book from.
        </Typography>
      </Paper>

      <Paper sx={ui.contentPanel} elevation={0}>
        <Typography variant="h4" sx={ui.panelTitle}>
          Upcoming Programs
        </Typography>
        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          {data.programs.map((program) => (
            <Box key={program.id} sx={ui.recordCard}>
              <Box>
                <Typography sx={ui.rowTitle}>{program.title}</Typography>
                <Typography sx={ui.rowCopy}>
                  {program.schedule} • {program.venue}
                </Typography>
                <Typography sx={ui.rowCopy}>
                  Hosted by {program.host} • {program.bookings}/{program.capacity} spots booked
                </Typography>
              </Box>
              <Chip label={program.status} variant="outlined" />
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}
