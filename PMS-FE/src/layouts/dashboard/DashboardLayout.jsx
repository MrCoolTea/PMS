import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Divider,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import VillaRoundedIcon from '@mui/icons-material/VillaRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import BedroomParentRoundedIcon from '@mui/icons-material/BedroomParentRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import { useAuth } from '../../context/AuthContext.jsx';
import { ResortProvider } from '../../context/ResortContext.jsx';
import { ui } from '../../styles/ui.js';

const navigationItems = [
  { label: 'Overview', path: '/admin', icon: <SpaceDashboardRoundedIcon fontSize="small" /> },
  { label: 'Rooms', path: '/admin/rooms', icon: <BedroomParentRoundedIcon fontSize="small" /> },
  { label: 'Guests', path: '/admin/guests', icon: <GroupsRoundedIcon fontSize="small" /> },
  { label: 'Reservations', path: '/admin/reservations', icon: <EventAvailableRoundedIcon fontSize="small" /> },
  { label: 'Programs', path: '/admin/programs', icon: <EventRoundedIcon fontSize="small" /> },
  { label: 'Payments', path: '/admin/payments', icon: <PaymentsRoundedIcon fontSize="small" /> },
  { label: 'Marketing', path: '/admin/marketing', icon: <CampaignRoundedIcon fontSize="small" /> },
  { label: 'Integrations', path: '/admin/integrations', icon: <HubRoundedIcon fontSize="small" /> },
  { label: 'Files', path: '/admin/files', icon: <FolderRoundedIcon fontSize="small" /> },
  { label: 'Website', path: '/admin/website', icon: <LanguageRoundedIcon fontSize="small" /> },
  { label: 'Reports', path: '/admin/reports', icon: <AssessmentRoundedIcon fontSize="small" /> },
  { label: 'Settings', path: '/admin/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
];

function DashboardFrame() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { status, user, logout } = useAuth();

  if (status === 'loading') {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Checking session...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <Box sx={ui.dashboardShell}>
      <Paper component="aside" sx={ui.dashboardSidebar} elevation={0}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={ui.brandAvatar}>
              <VillaRoundedIcon />
            </Avatar>
            <Box>
              <Typography sx={ui.sidebarBrand}>Resort Desk</Typography>
              <Typography sx={ui.sidebarSubtitle}>
                Rooms, bookings, programs, and channels
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1} sx={ui.navStack}>
            {navigationItems.map((item) => (
              <Box
                key={item.path}
                component={NavLink}
                to={item.path}
                end={item.path === '/admin'}
                style={({ isActive }) => ui.navItem(theme, isActive)}
              >
                {item.icon}
                <Typography>{item.label}</Typography>
              </Box>
            ))}
          </Stack>

          <Box sx={ui.sidebarSpacer} />

          <Divider />

          <Stack spacing={1.5}>
            <Typography sx={ui.sidebarSection}>Signed in as</Typography>
            <Box sx={ui.userCard}>
              <Typography sx={ui.userName}>
                {user.name || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()}
              </Typography>
              <Typography sx={ui.userRole}>{user.role}</Typography>
              <Typography sx={ui.userEmail}>{user.email}</Typography>
            </Box>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box component="main" sx={ui.dashboardMain}>
        <Outlet />
      </Box>
    </Box>
  );
}

export function DashboardLayout() {
  return (
    <ResortProvider>
      <DashboardFrame />
    </ResortProvider>
  );
}
