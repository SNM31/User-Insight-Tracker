// src/pages/AdminLogin.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login/admin', {
        username,
        password,
      });

      const token = response.data.token;
      if (token) {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('loginTime', Date.now().toString());
        navigate('/dashboard');
      } else {
        setError("Admin token not received from server.");
      }
    } catch (err) {
      setError("Admin login failed. Please check your credentials.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">Sign in to your account</h1>
            <p className="text-gray-500 mt-2">
                {/* --- ADDED THIS LINE --- */}
                Or <button onClick={() => navigate('/admin/register')} className="font-medium text-indigo-600 hover:text-indigo-500">create a new admin account</button>
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            {/* ... form inputs and button ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Right Panel: Branding/Image */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 p-12 text-white">
         <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">USER-INSIGHT-TRACKER</h2>
            <p className="text-lg text-indigo-200">Gain valuable insights from user behavior.</p>
         </div>
      </div>
    </div>
  );
};

export default AdminLogin;