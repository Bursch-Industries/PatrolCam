// setting up connection to mongoDB
import mongoose from "mongoose";

let isConnected = false; // Track the connection status

export const connectMongoDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_DATABASE_URL)
        isConnected = true; // Set connection status to true after successful connection
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        throw new Error("Error connecting to MongoDB");
    }
};
