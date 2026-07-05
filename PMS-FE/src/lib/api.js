import { API_BASE_URL } from './auth.js';

async function parseJsonSafely(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function extractErrorMessage(payload, fallbackMessage) {
  if (!payload) {
    return fallbackMessage;
  }

  if (Array.isArray(payload.message)) {
    return payload.message.join(', ');
  }

  if (typeof payload.message === 'string') {
    return payload.message;
  }

  return fallbackMessage;
}

export async function apiRequest(path, accessToken, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options,
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(payload, `Request failed with status ${response.status}`)
    );
  }

  return payload;
}
