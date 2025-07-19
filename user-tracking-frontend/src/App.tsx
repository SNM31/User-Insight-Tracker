// App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { EventType, trackEvent } from './utils/tracker';
import AppRoutes from './AppRoutes';

const App = () => {
  useEffect(() => {
    const sessionStart = Date.now();
    return () => {
      const sessionDuration = Date.now() - sessionStart;
      trackEvent(EventType.SESSION_DURATION, { durationMs: sessionDuration });
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
};

export default App;
