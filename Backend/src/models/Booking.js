import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie', 
    required: true,
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater', 
    required: true,
  },

  // models/Booking.js
showTime: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Showtime',
  required: true,
},
  seats: {
    type: [String], // e.g. ["A1", "A2", "B3"]
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed',
  },
  transactionId: {
    type: String,
    default: null,
  },
}, { timestamps: true });

// Optional: index for faster queries
bookingSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Booking', bookingSchema);