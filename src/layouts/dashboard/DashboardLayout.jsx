import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
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
import { getStoredUser, logoutUser } from '../../lib/auth.js';
import { ResortProvider } from '../../context/ResortContext.jsx';
import '../../App.css';

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
  { label: 'Reports', path: '/admin/reports', icon: <AssessmentRoundedIcon fontSize="small" /> },
  { label: 'Settings', path: '/admin/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
];

function DashboardFrame() {
  const navigate = useNavigate();
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  function handleLogout() {
    logoutUser();
    navigate('/admin/login');
  }

  return (
    <Box className="dashboard-shell">
      <Paper component="aside" className="dashboard-sidebar" elevation={0}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar className="brand-avatar">
              <VillaRoundedIcon />
            </Avatar>
            <Box>
              <Typography className="sidebar-brand">Resort Desk</Typography>
              <Typography className="sidebar-subtitle">
                Rooms, bookings, programs, and channels
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={1} className="nav-stack">
            {navigationItems.map((item) => (
              <Box
                key={item.path}
                component={NavLink}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  isActive ? 'nav-item nav-item-active' : 'nav-item'
                }
              >
                {item.icon}
                <Typography>{item.label}</Typography>
              </Box>
            ))}
          </Stack>

          <Box className="sidebar-spacer" />

          <Divider />

          <Stack spacing={1.5}>
            <Typography className="sidebar-section">Signed in as</Typography>
            <Box className="user-card">
              <Typography className="user-name">{user.name}</Typography>
              <Typography className="user-role">Resort Admin</Typography>
              <Typography className="user-email">{user.email}</Typography>
            </Box>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Box component="main" className="dashboard-main">
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
