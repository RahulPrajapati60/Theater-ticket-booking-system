import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get('https://backend-1-d3lc.onrender.com/api/movies');
        if (res.data.success) {
          setMovies(res.data.movies);
        } else {
          setError(res.data.message || 'Failed to load movies');
        }
      } catch (err) {
        setError('Cannot connect to server. Is backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-20 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-2xl text-rose-400">Loading movies from database...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 pb-20 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-bold mb-12 text-center">All Movies</h1>
        
        {movies.length === 0 ? (
          <div className="text-center text-xl text-gray-400">
            No movies found in database yet. Please seed some data.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {movies.map((movie) => (
              <div key={movie._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-xl">
                <img 
                  src={movie.poster_url || 'https://via.placeholder.com/400x600?text=' + movie.title} 
                  alt={movie.title} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
                  <p className="text-gray-300 mb-2"><strong>Language:</strong> {movie.language || '—'}</p>
                  <p className="text-gray-300 mb-2"><strong>Duration:</strong> {movie.duration ? movie.duration + ' min' : '—'}</p>
                  <p className="text-gray-300 mb-6"><strong>Description:</strong> {movie.description || 'No description available'}</p>
                  
                  <button
                    onClick={() => navigate(`/booking/${movie._id}`)}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Movies;