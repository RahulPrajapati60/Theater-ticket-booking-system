import express from 'express';
import Movie from '../models/Movie.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json({ success: true, movies });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;