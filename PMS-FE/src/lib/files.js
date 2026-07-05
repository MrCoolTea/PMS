import { apiRequest } from './api.js';

export function listFiles(accessToken) {
  return apiRequest('/files', accessToken);
}

export function createFileRecord(accessToken, file) {
  return apiRequest('/files', accessToken, {
    method: 'POST',
    body: JSON.stringify(file),
  });
}

export function updateFileRecord(accessToken, id, file) {
  return apiRequest(`/files/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(file),
  });
}

export function deleteFileRecord(accessToken, id) {
  return apiRequest(`/files/${id}`, accessToken, {
    method: 'DELETE',
  });
}
