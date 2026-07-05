import { apiRequest } from './api.js';

export function listReservations(accessToken) {
  return apiRequest('/reservations', accessToken);
}

export function createReservation(accessToken, reservation) {
  return apiRequest('/reservations', accessToken, {
    method: 'POST',
    body: JSON.stringify(reservation),
  });
}

export function updateReservation(accessToken, id, reservation) {
  return apiRequest(`/reservations/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(reservation),
  });
}

export function deleteReservation(accessToken, id) {
  return apiRequest(`/reservations/${id}`, accessToken, {
    method: 'DELETE',
  });
}
