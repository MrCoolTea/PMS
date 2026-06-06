import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { useResort } from '../../context/ResortContext.jsx';
import '../../App.css';

export function ExperiencesPage() {
  const { data } = useResort();

  return (
    <Stack spacing={3}>
      <Paper className="public-hero public-hero-experiences" elevation={0}>
        <Typography className="eyebrow">Experiences</Typography>
        <Typography variant="h2" className="public-title">
          Curated activities for every stay
        </Typography>
        <Typography className="public-copy">
          Surface scheduled programs from the same resort system visitors book from.
        </Typography>
      </Paper>

      <Paper className="content-panel" elevation={0}>
        <Typography variant="h4" className="panel-title">
          Upcoming Programs
        </Typography>
        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          {data.programs.map((program) => (
            <Box key={program.id} className="record-card">
              <Box>
                <Typography className="row-title">{program.title}</Typography>
                <Typography className="row-copy">
                  {program.schedule} • {program.venue}
                </Typography>
                <Typography className="row-copy">
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
