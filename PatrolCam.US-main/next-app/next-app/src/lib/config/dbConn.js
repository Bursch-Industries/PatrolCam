import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_DATABASE_URL;

if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_DATABASE_URL to .env");
}

let isConnected = false; // Track connection status

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    throw new Error("MongoDB connection failed");
  }
};

export default connectDB;
