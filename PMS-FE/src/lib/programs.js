import { apiRequest } from './api.js';

export function listPrograms(accessToken) {
  return apiRequest('/programs', accessToken);
}

export function createProgram(accessToken, program) {
  return apiRequest('/programs', accessToken, {
    method: 'POST',
    body: JSON.stringify(program),
  });
}

export function updateProgram(accessToken, id, program) {
  return apiRequest(`/programs/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(program),
  });
}

export function deleteProgram(accessToken, id) {
  return apiRequest(`/programs/${id}`, accessToken, {
    method: 'DELETE',
  });
}
