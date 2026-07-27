import express from 'express';
const router = express.Router();
import Showtime from '../models/Showtime.js';

router.get('/movie/:movieId', async (req, res) => {
  try {
    console.log("Requested movieId:", req.params.movieId);

    const showtimes = await Showtime.find({ movie: req.params.movieId })
  .sort({ date: 1, startTime: 1 });
  

    console.log("Found showtimes count:", showtimes.length); 

    if (showtimes.length === 0) {
      return res.json({ success: true, showtimes: [], message: "No showtimes found for this movie" });
    }

    res.json({ success: true, showtimes });
  } catch (err) {
    console.error("Showtime route error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;