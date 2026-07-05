import { apiRequest } from './api.js';

export function getPublicSiteData() {
  return apiRequest('/site/public', null);
}

export function getDashboardSiteData(accessToken) {
  return apiRequest('/site/dashboard', accessToken);
}

export function getSiteSettings(accessToken) {
  return apiRequest('/site/settings', accessToken);
}

export function updateSiteSettings(accessToken, settings) {
  return apiRequest('/site/settings', accessToken, {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

export function getSiteContent(accessToken) {
  return apiRequest('/site/content', accessToken);
}

export function updateSiteContent(accessToken, content) {
  return apiRequest('/site/content', accessToken, {
    method: 'PUT',
    body: JSON.stringify(content),
  });
}
