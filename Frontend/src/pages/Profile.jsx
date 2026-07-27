// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit profile states
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    password: '',
    confirmPassword: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get('/bookings/my-bookings');
        if (res.data.success) {
          setBookings(res.data.bookings || []);
        } else {
          setError("Failed to load bookings");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateMessage('');

    try {
      const payload = {};
      if (formData.name.trim()) payload.name = formData.name.trim();
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          setUpdateMessage("Passwords do not match");
          setUpdateLoading(false);
          return;
        }
        payload.password = formData.password;
      }

      if (Object.keys(payload).length === 0) {
        setUpdateMessage("No changes to save");
        setUpdateLoading(false);
        return;
      }

      const res = await axiosInstance.put('/auth/profile', payload);

      if (res.data.success) {
        setUpdateMessage("Profile updated successfully!");
        // Update context user (name change ke liye)
        setEditMode(false);
        setFormData({ name: res.data.user?.name || formData.name, password: '', confirmPassword: '' });
      }
    } catch (err) {
      setUpdateMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="pt-28 pb-20 bg-gray-950 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto bg-rose-600 rounded-full flex items-center justify-center text-4xl font-bold">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1 className="text-4xl font-bold mt-4">{user.name || 'User'}</h1>
          <p className="text-gray-400 mt-2">{user.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN')}
          </p>
        </div>

        {/* Edit Profile Section */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profile Details</h2>
            <button
              onClick={() => setEditMode(!editMode)}
              className="text-rose-400 hover:text-rose-300 font-medium"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">New Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Confirm Password </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 p-4 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Confirm new password"
                />
              </div>

              {updateMessage && (
                <p className={`text-center ${updateMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                  {updateMessage}
                </p>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 py-3 rounded-lg font-bold disabled:opacity-50 transition"
                >
                  {updateLoading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span>{user.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span>{user.email}</span>
              </div>
            </div>
          )}
        </div>

        {/* My Bookings */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading your bookings...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-400">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No bookings yet. <br />
              <button
                onClick={() => navigate('/movies')}
                className="mt-4 bg-rose-600 hover:bg-rose-700 px-6 py-2 rounded-lg text-white font-medium"
              >
                Book Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-gray-900 p-6 rounded-xl border border-gray-700 flex flex-col sm:flex-row justify-between items-start gap-6"
                >
                  <div>
                    <h3 className="text-xl font-bold">
                      {booking.movie?.title || 'Movie Title'}
                    </h3>
                    <p className="text-gray-400 mt-1">
                      {booking.theater?.name || 'Theater'} • {booking.theater?.city || ''}
                    </p>
                    <p className="text-gray-300 mt-2">
                      Showtime: {booking.showTime ? new Date(booking.showTime.date).toLocaleString('en-IN') : 'N/A'}
                    </p>
                    <p className="text-green-400 mt-2 font-medium">
                      Seats: {booking.seats.join(', ')}
                    </p>
                  </div>

                  <div className="text-right sm:text-left">
                    <p className="text-2xl font-bold text-rose-400">₹{booking.totalAmount}</p>
                    <p className={`mt-2 text-sm font-medium ${booking.paymentStatus === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                      Status: {booking.paymentStatus?.toUpperCase() || 'PENDING'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Booked on: {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-xl font-bold text-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;