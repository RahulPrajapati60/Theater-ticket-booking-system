import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="bg-gray-950/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-black bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent"
        >
          Guru Movies
        </Link>

        {/* Links + Auth Area */}
        <div className="flex items-center gap-6 md:gap-10">

          {/* Main Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/movies" className="text-gray-300 hover:text-rose-400 transition font-medium">
              Movies
            </Link>
            <Link to="/theaters" className="text-gray-300 hover:text-rose-400 transition font-medium">
              Theaters
            </Link>

            {/* contect us section */}
            <Link
              to="/contactus"
              className="text-gray-300 hover:text-rose-400 transition font-medium"
            >Contact Us
            </Link>
          </div>

          {/* Auth Section */}
          {user ? (
            <div className="relative group">
              {/* Trigger - Profile name/avatar */}
              <button className="flex items-center gap-3 focus:outline-none">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-rose-500/70 shadow-md">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg md:text-xl">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <span className="hidden sm:block text-gray-200 font-medium">
                  {user.name?.split(' ')[0] || 'Profile'}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="
                absolute right-0 mt-3 w-56 
                bg-gray-900/95 backdrop-blur-lg border border-gray-700/70 rounded-xl 
                shadow-2xl shadow-black/60
                opacity-0 scale-95 pointer-events-none 
                group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                transition-all duration-200 origin-top-right
                overflow-hidden
              ">
                <Link
                  to="/profile"
                  className="block px-5 py-3 text-gray-200 hover:bg-gray-800/80 hover:text-rose-400 transition flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-red-400 hover:bg-gray-800/80 hover:text-red-300 transition flex items-center gap-3 border-t border-gray-700/50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-rose-600 hover:bg-rose-700 px-5 py-2.5 rounded-lg font-medium transition shadow-md"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;