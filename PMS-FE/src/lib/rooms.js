import { apiRequest } from './api.js';

export function listRooms(accessToken) {
  return apiRequest('/rooms', accessToken);
}

export function createRoom(accessToken, room) {
  return apiRequest('/rooms', accessToken, {
    method: 'POST',
    body: JSON.stringify(room),
  });
}

export function updateRoom(accessToken, id, room) {
  return apiRequest(`/rooms/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(room),
  });
}

export function deleteRoom(accessToken, id) {
  return apiRequest(`/rooms/${id}`, accessToken, {
    method: 'DELETE',
  });
}
