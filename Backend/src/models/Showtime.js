import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: String,
    ref: 'Movie',
    required: true,
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true,
  },
  screenNumber: { type: Number, required: true },
  date:         { type: Date,   required: true },
  startTime:    { type: String, required: true }, 
  endTime:      { type: String },
  price:        { type: Number, required: true, min: 100 },
  availableSeats: { type: Number, required: true, min: 0 },
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

showtimeSchema.index({ movie: 1, date: 1, startTime: 1 });

export default mongoose.model('Showtime', showtimeSchema);