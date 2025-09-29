// src/pages/AdminRegister.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:8080/api/auth/register/admin', {
                username,
                password,
            });
            navigate('/admin/login'); // Redirect to login page after successful registration
        } catch (err) {
            setError('Registration failed. Please try another username.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Panel: Register Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800">Create an admin account</h1>
                        <p className="text-gray-500 mt-2">
                            Already have an account? <button onClick={() => navigate('/admin/login')} className="font-medium text-indigo-600 hover:text-indigo-500">Sign in here</button>
                        </p>
                    </div>
                    <form onSubmit={handleRegister} className="space-y-5">
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
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Right Panel: Branding/Image */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-800 to-indigo-700 p-12 text-white">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-4">USER-INSIGHT-TRACKER</h2>
                    <p className="text-lg text-indigo-200">Powerful analytics for your application.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminRegister;