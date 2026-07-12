import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { ResortProvider } from '../../context/ResortContext.jsx';
import { PublicDesignProvider, usePublicDesign } from '../../context/PublicDesignContext.jsx';
import { PublicNavbar } from '../../components/public/PublicNavbar.jsx';
import { PublicFooter } from '../../components/public/PublicFooter.jsx';

function PublicFrame() {
  const { currentDesign } = usePublicDesign();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: currentDesign.shellBackground,
        color: currentDesign.textPrimary,
        fontFamily: currentDesign.fontFamily,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          background: currentDesign.shellOverlay,
          opacity: 0.9,
        },
      }}
    >
      <PublicNavbar />

      <Box
        component="main"
        sx={{
          maxWidth: currentDesign.mainWidth,
          mx: 'auto',
          px: { xs: 2, md: 3.5 },
          py: { xs: 2.5, md: 3.5 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Outlet />
      </Box>

      <PublicFooter />
    </Box>
  );
}

export function PublicLayout() {
  return (
    <ResortProvider>
      <PublicDesignProvider>
        <PublicFrame />
      </PublicDesignProvider>
    </ResortProvider>
  );
}
