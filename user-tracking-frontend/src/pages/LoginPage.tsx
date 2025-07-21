import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { trackEvent, EventType } from '../utils/tracker';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Correctly destructuring the custom hook
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username,
        password,
      });

      const token = response.headers['Authorization'] || response.headers['authorization'];
      if (token) {
        localStorage.setItem('token', token.replace('Bearer ', ''));
        setIsAuthenticated(true);
         trackEvent(EventType.LOGIN_SUCCESS, {
          timestamp: new Date().toISOString().slice(0, 19),
          deviceinfo: navigator.userAgent,
        });

        navigate('/home');
        window.location.reload(); // Reload to ensure the app state is updated
      } else {
        setError("No token received");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="mb-4 text-sm text-gray-600">
        Don’t have an account?
        <button
          onClick={() => navigate('/register')}
          className="ml-2 text-blue-500 hover:underline"
        >
          Sign up
        </button>
      </div>

      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col w-80 gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
