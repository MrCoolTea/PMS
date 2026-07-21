import { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import canopyRetreatMode from '../components/public/design-modes/CanopyRetreatMode.jsx';
import editorialEscapeMode from '../components/public/design-modes/EditorialEscapeMode.jsx';
import midnightLuxeMode from '../components/public/design-modes/MidnightLuxeMode.jsx';
import oceanPanoramaMode from '../components/public/design-modes/OceanPanoramaMode.jsx';
import sunsetPostcardMode from '../components/public/design-modes/SunsetPostcardMode.jsx';
import tropicalLagoonMode from '../components/public/design-modes/TropicalLagoonMode.jsx';
import zenCourtyardMode from '../components/public/design-modes/ZenCourtyardMode.jsx';
import { useResort } from './ResortContext.jsx';

const baseBehavior = {
  mainWidth: 1240,
  heroLayout: 'split',
  heroTextAlign: 'left',
  heroImageMode: 'panel',
  heroImageHeight: 250,
  heroMinHeight: 420,
  sectionLayout: 'split',
  statsLayout: 'grid',
  railCardWidth: { xs: '86%', md: '40%' },
  bookingRailWidth: { xs: '88%', md: '36%' },
};

function defineMode(mode) {
  return { ...baseBehavior, ...mode };
}

const rawPublicDesignModes = [
  tropicalLagoonMode,
  sunsetPostcardMode,
  editorialEscapeMode,
  midnightLuxeMode,
  zenCourtyardMode,
  oceanPanoramaMode,
  canopyRetreatMode,
];

export const publicDesignModes = rawPublicDesignModes.map(defineMode);

const fallbackMode = publicDesignModes[0];
const PublicDesignContext = createContext(null);

export function getPublicDesignModeById(modeId) {
  return publicDesignModes.find((item) => item.id === modeId) ?? fallbackMode;
}

export function PublicDesignProvider({ children }) {
  const { data } = useResort();
  const [searchParams] = useSearchParams();
  const previewMode = searchParams.get('previewDesign');
  const storedMode = data.settings?.publicTheme;
  const mode = getPublicDesignModeById(previewMode ?? storedMode).id;

  const value = useMemo(() => {
    const currentDesign = getPublicDesignModeById(mode);

    return {
      mode,
      modes: publicDesignModes,
      currentDesign,
      previewMode,
    };
  }, [mode, previewMode]);

  return <PublicDesignContext.Provider value={value}>{children}</PublicDesignContext.Provider>;
}

export function usePublicDesign() {
  const context = useContext(PublicDesignContext);

  if (!context) {
    throw new Error('usePublicDesign must be used within a PublicDesignProvider');
  }

  return context;
}
