import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

function Booking() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Showtimes
  useEffect(() => {
    if (!movieId) return;

    const loadShowtimes = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        console.log("Fetching showtimes for movieId:", movieId);

        const res = await axiosInstance.get(`/showtimes/movie/${movieId}`);
        console.log("Showtimes fetch response:", res.data);

        if (res.data?.success) {
          setShowtimes(res.data.showtimes || []);
        } else {
          setErrorMsg(res.data?.message || "Failed to load showtimes");
        }
      } catch (err) {
        console.error("Showtimes fetch error:", err);
        setErrorMsg(
          err.response?.data?.message ||
          "Cannot connect to server. Please check if backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadShowtimes();
  }, [movieId]);

  const selectShowtime = (show) => {
    setSelectedShowtime(show);
    setSelectedSeats([]);
  };

  const sections = [
    { name: 'Lower (Front)', rows: 2, startRow: 'A', price: 380, bg: 'bg-amber-800 hover:bg-amber-700' },
    { name: 'Middle', rows: 3, startRow: 'C', price: 280, bg: 'bg-gray-700 hover:bg-gray-600' },
    { name: 'Upper (Balcony)', rows: 2, startRow: 'F', price: 160, bg: 'bg-indigo-900 hover:bg-indigo-800' },
  ];

  const seatsPerSide = 9;
  const centerGapWidth = 'w-20';

  const toggleSeat = (sectionName, rowLetter, side, seatNum, price) => {
    const seatId = `${sectionName}-${rowLetter}-${side}-${seatNum}`;
    setSelectedSeats(prev =>
      prev.some(s => s.id === seatId)
        ? prev.filter(s => s.id !== seatId)
        : [...prev, { id: seatId, price, display: `${rowLetter}${side}${seatNum}` }]
    );
  };

  const getRowLetter = (section, rowIndex) =>
    String.fromCharCode(section.startRow.charCodeAt(0) + rowIndex);

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleConfirmAndBook = () => {
    if (!selectedShowtime?._id) {
      alert("Please select a showtime first");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    // Data jo payment page per bhejna
    const payload = {
      showTimeId: selectedShowtime._id,
      seats: selectedSeats.map(seat => seat.display),
      totalAmount: total,
      movie: selectedShowtime.movie?._id || selectedShowtime.movie || movieId,
      theater: selectedShowtime.theater?._id || selectedShowtime.theater,
      showTime: selectedShowtime.date 
        ? new Date(selectedShowtime.date).toISOString() 
        : undefined,
      movieTitle: selectedShowtime.movie?.title || "Selected Movie",
      selectedShowtime: selectedShowtime,           
      selectedSeats: selectedSeats.map(s => s.display)  
    };

    console.log("Navigating to payment with payload:", payload);

    // Payment page pe redirect
    navigate(`/payment/${movieId}`, { state: payload });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-2xl text-rose-500 animate-pulse">Loading showtimes...</div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-2xl text-red-500 text-center">{errorMsg}</div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-40 bg-gray-950 min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-center">
          Book Tickets – {movieId}
        </h1>

        {/* SHOWTIME SELECTION */}
        {!selectedShowtime ? (
          <div className="bg-gray-900/70 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-rose-400">
              Choose Date & Show Time
            </h2>

            {showtimes.length === 0 ? (
              <p className="text-center text-xl text-gray-400 mt-12">
                No shows available for this movie yet.
              </p>
            ) : (
              <div className="space-y-10">
                {[...new Set(showtimes.map(s => s.date))].map(date => (
                  <div key={date}>
                    <h3 className="text-xl font-semibold mb-4 text-gray-300">
                      {new Date(date).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {showtimes
                        .filter(s => s.date === date)
                        .map(show => (
                          <button
                            key={show._id}
                            onClick={() => selectShowtime(show)}
                            className={`
                              p-5 rounded-xl border transition-all duration-200
                              flex flex-col items-center justify-center text-center
                              ${show.availableSeats > 0
                                ? 'bg-gray-800 hover:bg-rose-900/40 border-rose-700/50'
                                : 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'}
                            `}
                            disabled={show.availableSeats <= 0}
                          >
                            <div className="text-2xl font-bold mb-2">{show.startTime}</div>
                            <div className="text-lg text-rose-400">₹{show.price}</div>
                            <div className="text-sm mt-2 text-gray-400">
                              {show.availableSeats} seats left
                            </div>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Back & Showtime info */}
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <button
                onClick={() => setSelectedShowtime(null)}
                className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-2"
              >
                ← Change Show Time
              </button>

              <div className="text-center sm:text-right">
                <div className="text-xl font-bold">{selectedShowtime.startTime}</div>
                <div className="text-gray-400">
                  {new Date(selectedShowtime.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>
            </div>

            {/* Screen */}
            <div className="mb-14 text-center">
              <div className="inline-block bg-gradient-to-r from-rose-700 to-rose-500 px-24 py-4 rounded-xl text-2xl font-bold tracking-wider shadow-xl">
                SCREEN
              </div>
              <div className="w-11/12 h-1.5 bg-rose-600 mt-3 rounded-full mx-auto"></div>
            </div>

            {/* Seat sections */}
            {sections.map(section => (
              <div key={section.name} className="mb-16">
                <h3 className="text-2xl font-bold mb-5 text-center">
                  {section.name} • ₹{section.price}
                </h3>

                {Array.from({ length: section.rows }, (_, rowIndex) => {
                  const rowLetter = getRowLetter(section, rowIndex);
                  const curve = (rowIndex + 1) * 12;

                  return (
                    <div
                      key={`${section.name}-${rowLetter}`}
                      className="flex justify-center items-end mb-5 relative"
                    >
                      {/* Left side */}
                      <div className="flex gap-1.5">
                        {Array.from({ length: seatsPerSide }, (_, i) => {
                          const seatNum = i + 1;
                          const seatId = `${section.name}-${rowLetter}-Left-${seatNum}`;
                          const isSelected = selectedSeats.some(s => s.id === seatId);

                          return (
                            <button
                              key={seatId}
                              onClick={() => toggleSeat(section.name, rowLetter, 'Left', seatNum, section.price)}
                              className={`
                                relative w-10 h-10 sm:w-11 sm:h-11 rounded-t-full text-xs font-medium
                                border border-gray-600 shadow-md transition-all duration-200
                                flex flex-col items-center justify-center
                                ${isSelected
                                  ? 'bg-green-600 scale-110 shadow-green-500/60 border-green-400'
                                  : section.bg}
                              `}
                              style={{ transform: `translateX(-${curve}px) rotate(-7deg)` }}
                            >
                              <span className="font-bold">{seatNum}</span>
                              <span className="text-[9px] opacity-80 mt-0.5">₹{section.price}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className={`${centerGapWidth} flex-shrink-0`} />

                      {/* Right side */}
                      <div className="flex gap-1.5">
                        {Array.from({ length: seatsPerSide }, (_, i) => {
                          const seatNum = i + 1 + seatsPerSide;
                          const seatId = `${section.name}-${rowLetter}-Right-${seatNum}`;
                          const isSelected = selectedSeats.some(s => s.id === seatId);

                          return (
                            <button
                              key={seatId}
                              onClick={() => toggleSeat(section.name, rowLetter, 'Right', seatNum, section.price)}
                              className={`
                                relative w-10 h-10 sm:w-11 sm:h-11 rounded-t-full text-xs font-medium
                                border border-gray-600 shadow-md transition-all duration-200
                                flex flex-col items-center justify-center
                                ${isSelected
                                  ? 'bg-green-600 scale-110 shadow-green-500/60 border-green-400'
                                  : section.bg}
                              `}
                              style={{ transform: `translateX(${curve}px) rotate(7deg)` }}
                            >
                              <span className="font-bold">{seatNum}</span>
                              <span className="text-[9px] opacity-80 mt-0.5">₹{section.price}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                        {rowLetter}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Confirm & Book → Ab Payment page pe jayega */}
            {selectedShowtime && (
              <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 border-t border-gray-700">
                <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
                  <div>
                    <div className="text-xl font-bold">
                      {selectedSeats.length} seats • ₹{total}
                    </div>
                    <div className="text-sm text-green-400 mt-1">
                      {selectedSeats.map(s => s.display).join(', ') || 'No seats selected'}
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmAndBook}
                    disabled={selectedSeats.length === 0 || loading}
                    className="bg-rose-600 hover:bg-rose-700 px-10 py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Loading...' : `Proceed to Payment ₹${total}`}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Booking;