import mongoose from "mongoose";
import './models/Theater.js';
import dotenv from "dotenv";
import express from "express";
import { DB_NAME } from "./Constants.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import showtimeRoutes from "./routes/showtimeRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import bookingRoutes from './routes/bookingRoutes.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  origin: 'https://frontend-orpin-five-70.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Theater Booking Backend Running!' });
});



//MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL, { dbName: DB_NAME })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });



// Routes 
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/showtimes', showtimeRoutes);
app.use('/api/bookings', bookingRoutes);


// 404 handler (optional)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



export default app;


// Unhandled rejection/error catcher (crash avoid karne ke liye)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});