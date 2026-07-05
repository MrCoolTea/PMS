import { NavLink } from 'react-router-dom';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import VillaRoundedIcon from '@mui/icons-material/VillaRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { useResort } from '../../context/ResortContext.jsx';
import { ui } from '../../styles/ui.js';

export function PublicNavbar() {
  const theme = useTheme();
  const { data } = useResort();
  const content = data.siteContent ?? {};

  return (
    <Box component="header" sx={ui.siteHeader}>
      <Box sx={ui.siteBrand}>
        <VillaRoundedIcon />
        <Box>
          <Typography sx={ui.siteBrandText}>{content.name ?? data.resort.name}</Typography>
          <Typography sx={ui.siteBrandLocation}>{content.location ?? data.resort.location}</Typography>
        </Box>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={ui.siteNav}>
        <NavLink to="/" end style={({ isActive }) => ui.siteLink(theme, isActive)}>
          <HotelRoundedIcon fontSize="small" />
          Stay
        </NavLink>
        <NavLink to="/experiences" style={({ isActive }) => ui.siteLink(theme, isActive)}>
          <LocalActivityRoundedIcon fontSize="small" />
          Experiences
        </NavLink>
        <NavLink to="/book" style={({ isActive }) => ui.siteLink(theme, isActive)}>
          <CalendarMonthRoundedIcon fontSize="small" />
          Book Now
        </NavLink>
      </Stack>
    </Box>
  );
}
