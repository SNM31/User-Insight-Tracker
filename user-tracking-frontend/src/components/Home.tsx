import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
    const { username } = useAuth();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome {username}!</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600">
                    You have successfully logged in!
                </p>
            </div>
        </div>
    );
};

export default Home; 