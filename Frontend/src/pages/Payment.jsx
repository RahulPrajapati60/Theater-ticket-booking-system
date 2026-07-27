import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

function Payment() {
  const { movieId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!state?.showTimeId || !state?.totalAmount) {
    return (
      <div className="pt-32 pb-20 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-400">Invalid session. Please book again.</div>
      </div>
    );
  }

  const handlePay = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    if (paymentMethod === 'upi' && !upiId.trim()) {
      setError("Please enter UPI ID");
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Booking backend pe create kar rahe hain
      const bookingPayload = {
        showTimeId: state.showTimeId,
        seats: state.seats,
        totalAmount: state.totalAmount,
        movie: state.movie,
        theater: state.theater,
        showTime: state.showTime,
      };

      console.log("Creating booking from payment page:", bookingPayload);

      const res = await axiosInstance.post('/bookings', bookingPayload);

      if (res.data.success) {
        // Payment success → success page pe bhej do
        navigate(`/success/${movieId}`, {
          state: {
            booking: res.data.booking,
            showtime: state.selectedShowtime,
            seats: state.selectedSeats,
            totalAmount: state.totalAmount,
            movieTitle: state.movieTitle
          }
        });
      } else {
        setError("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment/Booking error:", err);
      setError(
        err.response?.data?.message || 
        "Something went wrong during payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 bg-gray-950 min-h-screen">
      <div className="max-w-md mx-auto px-6 bg-gray-800 rounded-xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-rose-400">Payment</h1>

        <div className="mb-8 text-center">
          <p className="text-xl font-semibold mb-2">
            Amount: <span className="text-green-400">₹{state.totalAmount}</span>
          </p>
          <p className="text-gray-300">
            Movie: {state.movieTitle || 'Selected Movie'}
          </p>
          <p className="text-gray-400 mt-2">
            Seats: {state.seats?.join(', ') || '—'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="method" value="card" onChange={e => setPaymentMethod(e.target.value)} />
            Credit / Debit Card
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="method" value="upi" onChange={e => setPaymentMethod(e.target.value)} />
            UPI
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="method" value="netbanking" onChange={e => setPaymentMethod(e.target.value)} />
            Net Banking
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="method" value="wallet" onChange={e => setPaymentMethod(e.target.value)} />
            Wallet (Paytm/PhonePe/Google Pay)
          </label>
        </div>

        {paymentMethod === 'upi' && (
          <input
            type="text"
            placeholder="Enter UPI ID (example@upi)"
            value={upiId}
            onChange={e => setUpiId(e.target.value)}
            className="w-full bg-gray-700 p-4 rounded-lg mb-6 text-white"
          />
        )}

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <button
          onClick={handlePay}
          disabled={loading || !paymentMethod}
          className={`w-full py-5 px-10 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xl rounded-2xl shadow-lg hover:shadow-[0_8px_20px_rgba(236,72,153,0.5)] hover:-translate-y-1 active:translate-y-1 transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing Payment...' : `Pay Now ₹${state.totalAmount}`}
        </button>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Secure payment powered by Razorpay / PayU simulation
        </p>
      </div>
    </div>
  );
}

export default Payment;