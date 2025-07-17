import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
 <header className="bg-white shadow p-4 flex items-center justify-between">
  <div className="flex items-center gap-3">
    <img src="/Logo.png" alt="Logo" className="h-12 w-auto object-contain" />
    <h1 className="text-xl font-semibold text-gray-800">User Loom</h1>
  </div>
</header>


  );
};

export default Header;
