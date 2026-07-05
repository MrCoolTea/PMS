import { apiRequest } from './api.js';

export function listPayments(accessToken) {
  return apiRequest('/payments', accessToken);
}

export function createPayment(accessToken, payment) {
  return apiRequest('/payments', accessToken, {
    method: 'POST',
    body: JSON.stringify(payment),
  });
}

export function updatePayment(accessToken, id, payment) {
  return apiRequest(`/payments/${id}`, accessToken, {
    method: 'PATCH',
    body: JSON.stringify(payment),
  });
}

export function deletePayment(accessToken, id) {
  return apiRequest(`/payments/${id}`, accessToken, {
    method: 'DELETE',
  });
}
