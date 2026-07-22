import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { ResortProvider, useResort } from '../../context/ResortContext.jsx';
import { PublicDesignProvider, usePublicDesign } from '../../context/PublicDesignContext.jsx';
import { PublicNavbar } from '../../components/public/PublicNavbar.jsx';
import { PublicFooter } from '../../components/public/PublicFooter.jsx';
import { PublicSiteLoader } from '../../components/public/PublicSiteLoader.jsx';

function PublicFrame() {
  const { loading } = useResort();
  const { currentDesign, previewMode } = usePublicDesign();
  const location = useLocation();
  const [loaderDelayComplete, setLoaderDelayComplete] = useState(false);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = location.hash.replace('#', '');
    const scrollToTarget = () => {
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.setTimeout(scrollToTarget, 60);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoaderDelayComplete(true);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if ((!loaderDelayComplete || loading) && !previewMode) {
    return <PublicSiteLoader design={currentDesign} />;
  }

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
