import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // State for the new email field
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Helper function to validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Client-side validation for the email
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return; // Stop the submission if email is invalid
    }

    try {
      // Include the email in the data sent to the backend
      await axios.post('http://localhost:8080/api/auth/register', {
        username,
        email,
        password,
      });
      // Optional reset
      setUsername('');
      setEmail('');
      setPassword('');
      navigate('/login');
    } catch (err) {
      // You can add more specific error handling here based on the API response
      setError('Registration failed. The username or email may already be taken.');
    }
  };

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="mb-4 text-sm text-gray-600">
        Already have an account?
        <button
         onClick={() => navigate('/login')}
         className="ml-2 text-blue-500 hover:underline">
         Sign in
        </button>
      </div>
      <h2 className="text-2xl mb-4">Register</h2>
      <form onSubmit={handleRegister} className="flex flex-col w-80 gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        {/* New input field for email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
          Register
        </button>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;