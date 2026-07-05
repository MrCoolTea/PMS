import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getDashboardSiteData, getPublicSiteData } from '../lib/site.js';
import { initialResortData } from '../data/resortData.js';

const ResortContext = createContext(null);

export function ResortProvider({ children }) {
  const { accessToken, status } = useAuth();
  const [data, setData] = useState(initialResortData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const nextData =
          accessToken && status === 'authenticated'
            ? await getDashboardSiteData(accessToken)
            : await getPublicSiteData();

        if (active) {
          setData((current) => ({
            ...current,
            ...nextData,
          }));
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [accessToken, status]);

  const value = useMemo(
    () => ({
      data,
      loading,
      error,
    }),
    [data, error, loading]
  );

  return <ResortContext.Provider value={value}>{children}</ResortContext.Provider>;
}

export function useResort() {
  const context = useContext(ResortContext);

  if (!context) {
    throw new Error('useResort must be used within a ResortProvider');
  }

  return context;
}
