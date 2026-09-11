import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || "mongodb+srv://fanqie:fanqie123@cluster0.f8acy45.mongodb.net/Regal";

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });

    console.log(`[MongoDB] Connected successfully: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error:`, error.message);
    throw error;
  }
};
