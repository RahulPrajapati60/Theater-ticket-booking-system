import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import ContactUs from './pages/ContactUs';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Theaters from './pages/Theaters';
import Releases from './pages/Releases';
import LiveShows from './pages/LiveShows';
import LiveBooking from './pages/LiveBooking';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';


function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Header / Navbar */}
      <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
              Guru Movies Theater
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {['Home', 'Movies', 'Theaters', 'Releases', 'Live Shows', 'ContactUs'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                className="relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ease-out
                   bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-700/60
                   shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_-2px_6px_rgba(0,0,0,0.6)]
                   hover:shadow-[0_8px_20px_rgba(0,0,0,0.6),inset_0_-1px_4px_rgba(255,255,255,0.08)]
                   hover:-translate-y-1 active:translate-y-0"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-rose-500 shadow-lg">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-200">
                  {user.name?.split(' ')[0] || 'Profile'}
                </span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition px-4 py-2">
                  Login
                </Link>
                <Link to="/register">
                  <button className="bg-rose-600 hover:bg-rose-700 px-5 py-2 rounded-full font-semibold transition-colors">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content  Routes */}
      <Routes>
      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes – login */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
        <Route path="/theaters" element={<ProtectedRoute><Theaters /></ProtectedRoute>} />
        <Route path="/releases" element={<ProtectedRoute><Releases /></ProtectedRoute>} />
        <Route path="/live-shows" element={<ProtectedRoute><LiveShows /></ProtectedRoute>} />
        <Route path="/contactus" element={<ProtectedRoute><ContactUs /></ProtectedRoute>} />



        <Route path="/booking/:movieId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/success/:movieId" element={<ProtectedRoute><Success /></ProtectedRoute>} />

        <Route path="/live-booking/:eventId" element={<ProtectedRoute><LiveBooking /></ProtectedRoute>} />
        <Route path="/payment/:movieId" element={<ProtectedRoute><Payment /></ProtectedRoute>} />

        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;