import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String },
  duration: { type: Number },
  poster_url: { type: String },
  description: { type: String },
  genre: { type: String }
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);