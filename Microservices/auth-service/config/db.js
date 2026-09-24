import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "auth_service_db",
    });
    console.log("Auth DB connected");
  } catch (err) {
    console.error("Auth DB connection failed:", err.message);
    process.exit(1);
  }
}

export default connectDB;
