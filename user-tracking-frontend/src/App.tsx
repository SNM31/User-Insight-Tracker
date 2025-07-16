import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const isAuthenticated = useAuth();
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />

        </Routes>
      </Router>
    </div>
  );
}
export default App;
