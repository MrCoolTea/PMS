const AUTH_STORAGE_KEY = 'pms-auth-session';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

function canUseStorage() {
  return typeof window !== 'undefined';
}

function readStoredSession() {
  if (!canUseStorage()) {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function writeStoredSession(session) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function clearStoredSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

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

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
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

function normalizeSession(payload) {
  if (!payload?.user || !payload?.accessToken || !payload?.refreshToken) {
    throw new Error('Invalid authentication response from server');
  }

  return {
    user: {
      ...payload.user,
      name: [payload.user.firstName, payload.user.lastName].filter(Boolean).join(' '),
    },
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  };
}

export function getStoredSession() {
  return readStoredSession();
}

export function getStoredUser() {
  return readStoredSession()?.user ?? null;
}

export function isAuthenticated() {
  const session = readStoredSession();
  return Boolean(session?.accessToken && session?.refreshToken && session?.user);
}

export async function loginUser({ email, password }) {
  const payload = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const session = normalizeSession(payload);
  writeStoredSession(session);
  return session;
}

export async function registerUser({ email, password, firstName, lastName, role }) {
  const payload = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, firstName, lastName, role }),
  });

  const session = normalizeSession(payload);
  writeStoredSession(session);
  return session;
}

export async function getCurrentUser(accessToken) {
  return request('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function refreshSession(refreshToken) {
  const payload = await request('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  const session = normalizeSession(payload);
  writeStoredSession(session);
  return session;
}

export async function restoreSession() {
  const session = readStoredSession();

  if (!session?.refreshToken) {
    return null;
  }

  try {
    if (session.accessToken) {
      const user = await getCurrentUser(session.accessToken);
      const restoredSession = {
        ...session,
        user: {
          ...user,
          name: [user.firstName, user.lastName].filter(Boolean).join(' '),
        },
      };
      writeStoredSession(restoredSession);
      return restoredSession;
    }
  } catch {
    // Fall through to token refresh.
  }

  try {
    return await refreshSession(session.refreshToken);
  } catch {
    clearStoredSession();
    return null;
  }
}

export function logoutUser() {
  clearStoredSession();
}

export { API_BASE_URL };
