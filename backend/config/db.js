import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Fail quickly if MongoDB is unreachable
      socketTimeoutMS: 45000,         // Timeout for inactivity
      family: 4,                      // Use IPv4 (recommended for cloud environments)
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Optional event listeners for debugging
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected");
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error(
      "Connection URI:",
      process.env.MONGO_URI ? "✅ URI is set" : "❌ URI is NOT set"
    );
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
