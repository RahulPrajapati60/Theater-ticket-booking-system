import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie.js";

dotenv.config();

const movies = [
  {
    title: "Border 2",
    poster_url: "https://m.media-amazon.com/images/M/MV5BNzk3NDg3NjEtNTg4ZS00NGRkLWJlYjktYTMwNDJiYjUwNDQzXkEyXkFqcGc@._V1_.jpg",
    genre: "War, Action",
    duration: 165,
    language: "Hindi",
    description: "Sunny Deol is back with Border 2!"
  },
  {
    title: "The Raja Saab",
    poster_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4jrJgOrreEGdML9hly1sZYkunU_nnvOlSXA&s",
    genre: "Horror Comedy",
    duration: 160,
    language: "Telugu/Hindi",
    description: "Prabhas ka horror comedy debut"
  },
  {
    title: "Jana Nayagan",
    poster_url: "https://upload.wikimedia.org/wikipedia/en/c/c8/Jana_Nayagan.jpg",
    genre: "Political Action",
    duration: 170,
    language: "Kannada",
    description: "Vijay's powerful political drama"
  },
  {
    title: "Oppenheimer",
    poster_url: "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    genre: "Biography, Drama",
    duration: 180,
    language: "English",
    description: "Christopher Nolan's masterpiece"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "theaterDB" });
    console.log("Connected to MongoDB");

    await Movie.deleteMany({});
    await Movie.insertMany(movies);

    console.log("✅ 4 movies added successfully!");
    console.log("Ab frontend refresh karo – movies dikhengi!");
    
    process.exit();
  } catch (err) {
    console.log("❌ Error:", err.message);
  }
}

seed();