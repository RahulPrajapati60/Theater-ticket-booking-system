import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function Success() {
  const { movieId } = useParams();
  const { state } = useLocation(); 
  const navigate = useNavigate();

  console.log("=== SUCCESS PAGE DEBUG: Received state ===", state);

  // Agar state nahi mila to fallback message
  if (!state || !state.seats?.length) {
    console.warn("No state received in Success page");
    return (
      <div className="pt-32 pb-20 bg-gray-900 min-h-screen flex items-center justify-center text-center">
        <div className="text-2xl text-gray-400 max-w-md">
          No booking details found.<br />
          <button
            onClick={() => navigate(`/booking/${movieId}`)}
            className="mt-6 bg-rose-600 hover:bg-rose-700 px-8 py-3 rounded-xl text-white font-semibold"
          >
            Go back to Booking
          </button>
        </div>
      </div>
    );
  }

  const { 
    booking, 
    showtime, 
    seats, 
    totalAmount, 
    movieTitle = "Selected Movie" 
  } = state;

  // Ticket ID generate (fallback)
  const ticketId = booking?._id?.slice(-8) || 'TKT-' + Date.now().toString().slice(-6);

  return (
    <div className="pt-32 pb-20 bg-gray-900 min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-400 mb-4">Booking Confirmed! 🎟️</h1>
          <p className="text-xl text-gray-300">Thank you for booking with Guru Movies</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-green-600/40 shadow-2xl max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">{movieTitle}</h2>
            <p className="text-gray-400 mt-2">
              {showtime?.startTime} • {new Date(showtime?.date).toLocaleDateString('en-IN')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-gray-400">Ticket ID</p>
              <p className="text-2xl font-bold">{ticketId}</p>
            </div>
            <div>
              <p className="text-gray-400">Seats</p>
              <p className="text-2xl font-bold">{seats.join(', ')}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold">₹{totalAmount}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-green-400 font-bold">CONFIRMED</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={() => window.print()}
              className="bg-green-600 hover:bg-green-700 px-10 py-4 rounded-xl font-bold text-lg"
            >
              Print / Save Tickets
            </button>

            <button
              onClick={() => navigate('/')}
              className="bg-gray-700 hover:bg-gray-600 px-10 py-4 rounded-xl font-bold text-lg"
            >
              Back to Home
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-gray-500">
          Booking ID: {booking?._id || '—'} • Show this page or save as PDF
        </p>
      </div>
    </div>
  );
}

export default Success;