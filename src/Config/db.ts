import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env");
}

let isConnected = false; // track connection status

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB via Mongoose");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Helper to get the native db object for pings or direct operations
export function getDb() {
  if (!mongoose.connection.db) {
    throw new Error("Database not initialised. Call connectDB first.");
  }
  return mongoose.connection.db;
}
