import mongoose from 'mongoose';

let isConnected = false;
let isInMemoryFallback = false;

export const inMemoryStore = {
  users: [],
  rfqs: [],
  bids: [],
  orders: []
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reversemarket';
  
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500
    });
    isConnected = true;
    isInMemoryFallback = false;
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ [Database] Local MongoDB not detected (${error.message}).`);
    console.log(`🚀 [Database] Activating High-Speed In-Memory Mock Store for zero-config demonstration!`);
    isConnected = false;
    isInMemoryFallback = true;
  }
};

export const isFallbackActive = () => isInMemoryFallback;
