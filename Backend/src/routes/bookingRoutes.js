import express from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Movie from '../models/Movie.js';
import Theater from '../models/Theater.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    console.log("=== [BOOKING POST] Request received from user:", req.user?._id);
    console.log("=== [BOOKING POST] Payload:", JSON.stringify(req.body, null, 2));

    const {
      showTimeId,
      seats,
      totalAmount,
      movie,
      theater,
      showTime,
    } = req.body;

    const userId = req.user._id;

    // Required fields validation
    if (!showTimeId || !seats?.length || !totalAmount || !movie || !theater) {
      console.log("Missing required fields:", { showTimeId, seats, totalAmount, movie, theater });
      return res.status(400).json({
        success: false,
        message: "Missing required fields: showTimeId, seats, totalAmount, movie, theater",
      });
    }

    // Convert strings to ObjectId
    let movieId, theaterId, showTimeObjId;
    try {
      movieId = new mongoose.Types.ObjectId(movie);
      theaterId = new mongoose.Types.ObjectId(theater);
      showTimeObjId = new mongoose.Types.ObjectId(showTimeId);
    } catch (castError) {
      console.error("Invalid ObjectId format:", castError.message);
      return res.status(400).json({
        success: false,
        message: "Invalid ID format (movie/theater/showTimeId must be valid ObjectId)",
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: userId,
      movie: movieId,
      theater: theaterId,
      showTime: showTimeObjId,           
      seats,
      totalAmount,
      paymentStatus: 'pending',
      bookingStatus: 'confirmed',
    });

    console.log("=== [BOOKING CREATED] Success! Booking ID:", booking._id);
    console.log("=== [BOOKING CREATED] Full document:", booking.toObject());

    res.status(201).json({
      success: true,
      message: "Booking created successfully 🎉",
      booking: {
        _id: booking._id,
        user: booking.user,
        movie: booking.movie,
        theater: booking.theater,
        showTime: booking.showTime,
        seats: booking.seats,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
      },
    });
  } catch (err) {
    console.error("=== [BOOKING ERROR] Failed to create booking ===");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Full error stack:", err.stack);

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => `${e.path}: ${e.message}`).join(", ");
      return res.status(400).json({
        success: false,
        message: `Validation failed: ${errors}`,
      });
    }

    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry detected",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during booking creation",
      error: err.message,
    });
  }
});

// My bookings 
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title poster_url')
      .populate('theater', 'name city address')
      .populate('showTime', 'date startTime price')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("My bookings error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;