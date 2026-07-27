import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  city:    { type: String },
  address: { type: String },
  totalSeats: { type: Number, default: 300 },
}, { timestamps: true });

export default mongoose.model('Theater', theaterSchema);