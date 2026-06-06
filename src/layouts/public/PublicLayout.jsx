import { NavLink, Outlet } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import VillaRoundedIcon from '@mui/icons-material/VillaRounded';
import { ResortProvider } from '../../context/ResortContext.jsx';
import '../../App.css';

function PublicFrame() {
  return (
    <Box className="site-shell">
      <Box component="header" className="site-header">
        <Box className="site-brand">
          <VillaRoundedIcon />
          <Typography className="site-brand-text">Azure Cove Resort</Typography>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} className="site-nav">
          <NavLink to="/" end className="site-link">
            Stay
          </NavLink>
          <NavLink to="/experiences" className="site-link">
            Experiences
          </NavLink>
          <NavLink to="/book" className="site-link">
            Book Now
          </NavLink>
          <Button component={NavLink} to="/admin/login" variant="outlined" size="small">
            Admin Login
          </Button>
        </Stack>
      </Box>

      <Box component="main" className="site-main">
        <Outlet />
      </Box>
    </Box>
  );
}

export function PublicLayout() {
  return (
    <ResortProvider>
      <PublicFrame />
    </ResortProvider>
  );
}
