import { createContext, useContext, useEffect, useState } from 'react';
import {
  getStoredSession,
  loginUser,
  logoutUser,
  registerUser,
  restoreSession,
} from '../lib/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;

    async function bootstrapAuth() {
      const restoredSession = await restoreSession();

      if (!active) {
        return;
      }

      setSession(restoredSession);
      setStatus(restoredSession ? 'authenticated' : 'unauthenticated');
    }

    bootstrapAuth();

    return () => {
      active = false;
    };
  }, []);

  async function handleLogin(credentials) {
    const nextSession = await loginUser(credentials);
    setSession(nextSession);
    setStatus('authenticated');
    return nextSession;
  }

  async function handleRegister(payload) {
    const nextSession = await registerUser(payload);
    setSession(nextSession);
    setStatus('authenticated');
    return nextSession;
  }

  function handleLogout() {
    logoutUser();
    setSession(null);
    setStatus('unauthenticated');
  }

  return (
    <AuthContext.Provider
      value={{
        status,
        isAuthenticated: status === 'authenticated',
        user: session?.user ?? null,
        accessToken: session?.accessToken ?? null,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
