import { createContext, useContext, useEffect, useMemo, useState } from 'react';
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
  mainWidth: 1740,
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
const publicThemeStorageKey = 'pms-public-theme';

function readCachedPublicTheme() {
  try {
    return window.localStorage.getItem(publicThemeStorageKey);
  } catch (error) {
    return null;
  }
}

function persistCachedPublicTheme(modeId) {
  if (!modeId) {
    return;
  }

  try {
    window.localStorage.setItem(publicThemeStorageKey, modeId);
  } catch (error) {
    // Ignore storage errors in private/incognito contexts.
  }
}

export function getPublicDesignModeById(modeId) {
  return publicDesignModes.find((item) => item.id === modeId) ?? fallbackMode;
}

export function PublicDesignProvider({ children }) {
  const { data, loading } = useResort();
  const [searchParams] = useSearchParams();
  const [cachedMode, setCachedMode] = useState(() => readCachedPublicTheme());
  const previewMode = searchParams.get('previewDesign');
  const fetchedMode = data.settings?.publicTheme;
  const resolvedMode = previewMode ?? (loading ? cachedMode ?? fetchedMode : fetchedMode ?? cachedMode);
  const mode = getPublicDesignModeById(resolvedMode).id;

  useEffect(() => {
    if (previewMode || !fetchedMode) {
      return;
    }

    setCachedMode(fetchedMode);
    persistCachedPublicTheme(fetchedMode);
  }, [fetchedMode, previewMode]);

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
