import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { isTokenValid } from '../utils/tokenUtils';

interface AuthContextValue {
  userToken: string | null;
  adminToken: string | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  login: (token: string, sessionId: string) => void;
  logout: () => void;
  adminLogin: (token: string) => void;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const readToken = (key: string): string | null => {
  const t = localStorage.getItem(key);
  return t && isTokenValid(t) ? t : null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(() => readToken('token'));
  const [adminToken, setAdminToken] = useState<string | null>(() => readToken('adminToken'));

  const login = useCallback((token: string, sessionId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('sessionId', sessionId);
    if (!localStorage.getItem('loginTime')) {
      localStorage.setItem('loginTime', Date.now().toString());
    }
    setUserToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('loginTime');
    setUserToken(null);
  }, []);

  const adminLogin = useCallback((token: string) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('loginTime', Date.now().toString());
    setAdminToken(token);
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('loginTime');
    setAdminToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      userToken,
      adminToken,
      isAuthenticated: Boolean(userToken),
      isAdminAuthenticated: Boolean(adminToken),
      login,
      logout,
      adminLogin,
      adminLogout,
    }),
    [userToken, adminToken, login, logout, adminLogin, adminLogout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
