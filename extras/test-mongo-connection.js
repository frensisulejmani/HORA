require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing MongoDB URI:', MONGODB_URI ? MONGODB_URI.replace(/:(.*)@/, ':***@') : 'MONGODB_URI not set');

(async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB, host:', conn.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection test failed:', err.message || err);
    process.exit(1);
  }
})();
