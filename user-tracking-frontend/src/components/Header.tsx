import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/home')}>
        <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-semibold text-gray-800">User Insight Tracker</h1>
      </div>
    </header>
  );
};

export default Header;
