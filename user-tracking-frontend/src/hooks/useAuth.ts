// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { isTokenValid } from '../utils/tokenUtils'; // Create this if not exists

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token);
    
    if (token && isTokenValid(token)) {
        console.log("Token is valid");
      setIsAuthenticated(true);
    } else {
        console.log("Token is not valid");
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated;
};
