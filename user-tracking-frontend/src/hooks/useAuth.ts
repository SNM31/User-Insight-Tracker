// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { isTokenValid } from '../utils/tokenUtils';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated, setIsAuthenticated };
};
