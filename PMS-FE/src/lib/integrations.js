import { apiRequest } from './api.js';

export function listIntegrations(accessToken) {
  return apiRequest('/integrations', accessToken);
}

export function createIntegration(accessToken, integration) {
  return apiRequest('/integrations', accessToken, {
    method: 'POST',
    body: JSON.stringify(integration),
  });
}

export function updateIntegration(accessToken, id, integration) {
  return apiRequest(`/integrations/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(integration),
  });
}

export function deleteIntegration(accessToken, id) {
  return apiRequest(`/integrations/${id}`, accessToken, {
    method: 'DELETE',
  });
}
