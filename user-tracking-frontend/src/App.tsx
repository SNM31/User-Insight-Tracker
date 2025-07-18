import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import { useAuth } from './hooks/useAuth';
import SubCategoryList from './components/SubCategoryList';
import ListingPage from './components/ListingPage';
import {EventType,trackEvent} from './utils/tracker';

const App = () => {
  const isAuthenticated = useAuth();
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
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          
             {/* Category flow */}
          <Route path="/category/:category" element={<SubCategoryList />} />
          <Route path="/category/:category/:sub" element={<ListingPage />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
