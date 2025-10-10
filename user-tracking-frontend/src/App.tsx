import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { EventType, trackEvent } from './utils/tracker';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './AppRoutes';

const App = () => {
  const googleClientId=process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  useEffect(() => {
    const handleUnload = () => {
      const loginTime = localStorage.getItem('loginTime');
      if (loginTime) {
        const logoutTime = Date.now();
        const durationInSeconds = Math.floor((logoutTime - parseInt(loginTime)) / 1000);
        trackEvent(EventType.SESSION_DURATION, { durationInSeconds });
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return (
    <div className="App">
      <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AppRoutes />
      </Router>
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;
