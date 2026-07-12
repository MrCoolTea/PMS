import { NavLink } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import VillaRoundedIcon from '@mui/icons-material/VillaRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import LocalActivityRoundedIcon from '@mui/icons-material/LocalActivityRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { useResort } from '../../context/ResortContext.jsx';
import { usePublicDesign } from '../../context/PublicDesignContext.jsx';

export function PublicNavbar() {
  const { data } = useResort();
  const { currentDesign } = usePublicDesign();
  const content = data.siteContent ?? {};

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        px: { xs: 2, md: 4 },
        py: 2,
        backdropFilter: 'blur(18px)',
        background: currentDesign.headerBackground,
        borderBottom: currentDesign.headerBorder,
      }}
    >
      <Stack sx={{ width: '100%' }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {content.logoUrl ? (
              <Box
                component="img"
                src={content.logoUrl}
                alt={`${content.name ?? data.resort.name} logo`}
                sx={{
                  width: 48,
                  height: 48,
                  objectFit: 'contain',
                  borderRadius: `${Math.max(currentDesign.radiusCard - 10, 8)}px`,
                  backgroundColor: 'rgba(255,255,255,0.82)',
                  border: currentDesign.panelBorder,
                  p: 0.5,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: `${Math.max(currentDesign.radiusCard - 8, 10)}px`,
                  background: currentDesign.heroSecondary,
                  color: currentDesign.footerText,
                }}
              >
                <VillaRoundedIcon />
              </Box>
            )}
            <Box>
              <Typography sx={{ fontWeight: 700, color: currentDesign.textPrimary }}>
                {content.name ?? data.resort.name}
              </Typography>
              <Typography sx={{ color: currentDesign.textSecondary, fontSize: '0.82rem' }}>
                {content.location ?? data.resort.location}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{
              flex: 1,
              ml: 'auto',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                textDecoration: 'none',
                borderRadius: 999,
                color: isActive ? currentDesign.accentStrong : currentDesign.textPrimary,
                background: isActive ? currentDesign.accentSoft : 'transparent',
                fontWeight: 700,
              })}
            >
              <HotelRoundedIcon fontSize="small" />
              Stay
            </NavLink>
            <NavLink
              to="/experiences"
              style={({ isActive }) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                textDecoration: 'none',
                borderRadius: 999,
                color: isActive ? currentDesign.accentStrong : currentDesign.textPrimary,
                background: isActive ? currentDesign.accentSoft : 'transparent',
                fontWeight: 700,
              })}
            >
              <LocalActivityRoundedIcon fontSize="small" />
              Experiences
            </NavLink>
            <NavLink
              to="/book"
              style={({ isActive }) => ({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                textDecoration: 'none',
                borderRadius: 999,
                color: isActive ? currentDesign.accentStrong : currentDesign.textPrimary,
                background: isActive ? currentDesign.accentSoft : 'transparent',
                fontWeight: 700,
              })}
            >
              <CalendarMonthRoundedIcon fontSize="small" />
              Book Now
            </NavLink>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
