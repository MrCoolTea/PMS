import { apiRequest } from './api.js';

export function listGuests(accessToken) {
  return apiRequest('/guests', accessToken);
}

export function createGuest(accessToken, guest) {
  return apiRequest('/guests', accessToken, {
    method: 'POST',
    body: JSON.stringify(guest),
  });
}

export function updateGuest(accessToken, id, guest) {
  return apiRequest(`/guests/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(guest),
  });
}

export function deleteGuest(accessToken, id) {
  return apiRequest(`/guests/${id}`, accessToken, {
    method: 'DELETE',
  });
}
