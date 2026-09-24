import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "movie_service_db",
    });
    console.log("Movie DB connected");
  } catch (err) {
    console.error("Movie DB connection failed:", err.message);
    process.exit(1);
  }
}

export default connectDB;
