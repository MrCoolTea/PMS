const AUTH_STORAGE_KEY = 'pms-auth-user';

export function getStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function loginUser(email) {
  if (typeof window === 'undefined') {
    return null;
  }

  const user = {
    name: 'Admin User',
    email,
    role: 'Resort Admin',
  };

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAuthenticated() {
  return Boolean(getStoredUser());
}
