import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMatches } from 'react-router-dom';
import { getPublicSiteData } from '../lib/site.js';

const DEFAULT_TITLE = 'PMS';
const DEFAULT_DESCRIPTION = 'Property management system';
const DEFAULT_FAVICON = '/favicon.png';

export function RouteHead() {
  const matches = useMatches();
  const [faviconUrl, setFaviconUrl] = useState(DEFAULT_FAVICON);
  const activeMatch = [...matches].reverse().find((match) => match.handle?.title || match.handle?.description);
  const title = activeMatch?.handle?.title ? `${activeMatch.handle.title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const description = activeMatch?.handle?.description ?? DEFAULT_DESCRIPTION;

  useEffect(() => {
    let active = true;

    async function loadFavicon() {
      try {
        const siteData = await getPublicSiteData();
        if (active) {
          setFaviconUrl(siteData?.siteContent?.logoUrl || DEFAULT_FAVICON);
        }
      } catch {
        if (active) {
          setFaviconUrl(DEFAULT_FAVICON);
        }
      }
    }

    function handleSiteContentUpdated(event) {
      const nextLogoUrl = event.detail?.logoUrl;
      setFaviconUrl(nextLogoUrl || DEFAULT_FAVICON);
    }

    loadFavicon();
    window.addEventListener('site-content-updated', handleSiteContentUpdated);

    return () => {
      active = false;
      window.removeEventListener('site-content-updated', handleSiteContentUpdated);
    };
  }, []);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href={faviconUrl} />
    </Helmet>
  );
}
