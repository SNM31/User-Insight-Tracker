import React from 'react';
import LogoutButton from '../components/Logout';
const Header = () => {
  return (
    <>
    <LogoutButton/>
 <header className="bg-white shadow p-4 flex items-center justify-between">
  <div className="flex items-center gap-3">
    <img src="/Logo.png" alt="Logo" className="h-12 w-auto object-contain" />
    <h1 className="text-xl font-semibold text-gray-800">InsightLooms</h1>
  </div>
</header>
 </>

  );
};

export default Header;
