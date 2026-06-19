import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { ResortProvider } from '../../context/ResortContext.jsx';
import { PublicNavbar } from '../../components/public/PublicNavbar.jsx';
import { PublicFooter } from '../../components/public/PublicFooter.jsx';
import { ui } from '../../styles/ui.js';

function PublicFrame() {
  return (
    <Box sx={ui.publicShell}>
      <PublicNavbar />

      <Box component="main" sx={ui.siteMain}>
        <Outlet />
      </Box>

      <PublicFooter />
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
