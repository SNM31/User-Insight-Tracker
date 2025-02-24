import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../hooks/useLocation';

interface Location {
    country: string;
    city: string;
}

export const Dashboard: React.FC = () => {
    const { username, logout } = useAuth();
    const { location, loading, error } = useLocation();

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-semibold">
                                Welcome, {username}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Your Location</h2>
                        {loading ? (
                            <p>Loading location...</p>
                        ) : error ? (
                            <p className="text-red-600">Error loading location: {error}</p>
                        ) : (
                            <>
                                <p className="mb-2">Country: {location?.country}</p>
                                <p>City: {location?.city}</p>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};