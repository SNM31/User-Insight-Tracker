// src/components/LogoutButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent, EventType } from '../utils/tracker';
import { useAuthContext } from '../context/AuthContext';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const { userToken, logout } = useAuthContext();

  const handleLogout = async () => {
    const loginTime = localStorage.getItem('loginTime');
    const logoutTime = Date.now();

    if (loginTime) {
      const durationInSeconds = Math.floor((logoutTime - parseInt(loginTime)) / 1000);
      trackEvent(EventType.SESSION_DURATION, { duration: durationInSeconds });
    }

    trackEvent(EventType.LOGOUT, { timestamp: new Date(logoutTime).toISOString() });

    if (userToken) {
      try {
        await fetch('http://localhost:8080/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        });
      } catch {
        // logout even if the server call fails
      }
    }

    logout();
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
