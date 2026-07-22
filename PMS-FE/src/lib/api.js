import {
  API_BASE_URL,
  getStoredSession,
  logoutUser,
  refreshSession,
} from './auth.js';

let refreshInFlight = null;

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

async function performRequest(path, accessToken, options = {}) {
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

  return { response, payload };
}

async function refreshAccessToken() {
  const session = getStoredSession();

  if (!session?.refreshToken) {
    throw new Error('Authentication required');
  }

  if (!refreshInFlight) {
    refreshInFlight = refreshSession(session.refreshToken).finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
}

export async function apiRequest(path, accessToken, options = {}, shouldRetry = true) {
  const { response, payload } = await performRequest(path, accessToken, options);

  if (response.status === 401 && shouldRetry && accessToken) {
    try {
      const session = await refreshAccessToken();
      return apiRequest(path, session.accessToken, options, false);
    } catch {
      logoutUser();
      throw new Error('Your session has expired. Please log in again.');
    }
  }

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(payload, `Request failed with status ${response.status}`)
    );
  }

  return payload;
}
