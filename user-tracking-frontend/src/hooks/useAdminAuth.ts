// src/hooks/useAdminAuth.tsx
import { useState, useEffect } from 'react';
import { isTokenValid } from '../utils/tokenUtils';

export const useAdminAuth = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token && isTokenValid(token)) {
      setIsAdminAuthenticated(true);
      // Set login time if not already set
      if (!localStorage.getItem('loginTime')) {
        localStorage.setItem('loginTime', Date.now().toString());
      }
    } else {
      setIsAdminAuthenticated(false);
    }
  }, []);

  return { isAdminAuthenticated, setIsAdminAuthenticated };
};