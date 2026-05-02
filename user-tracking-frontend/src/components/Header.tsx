import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { trackEvent, EventType } from '../utils/tracker';
import { getTokenPayload } from '../utils/tokenUtils';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userToken, logout } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const payload = userToken ? getTokenPayload(userToken) : null;
  const username: string = (payload?.sub as string) || 'User';
  const initials = username.slice(0, 2).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const duration = Math.floor((Date.now() - parseInt(loginTime)) / 1000);
      trackEvent(EventType.SESSION_DURATION, { duration });
    }
    trackEvent(EventType.LOGOUT, { timestamp: new Date().toISOString() });

    if (userToken) {
      try {
        await fetch('http://localhost:8080/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        });
      } catch {
        // logout even if server call fails
      }
    }
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="InsightLooms" className="h-9 w-auto object-contain" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">InsightLooms</span>
        </button>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Home', path: '/home' },
            { label: 'News', path: '/category/news' },
            { label: 'Sports', path: '/category/sports' },
            { label: 'Movies', path: '/category/movies' },
            { label: 'Food', path: '/category/food' },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive(path)
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* User avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {username}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-4 py-2.5 border-b border-gray-50">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
