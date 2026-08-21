// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const connectDB = async () => {
  // MongoDB connection options for better reliability and performance
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Increase timeouts a bit to allow transient DNS/network hiccups during startup
    serverSelectionTimeoutMS: 20000, // Wait up to 20s to find a suitable server
    connectTimeoutMS: 30000, // Allow up to 30s for initial TCP connect
    maxPoolSize: 10, // Maintain up to 10 socket connections
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    family: 4, // Use IPv4, skip trying IPv6
  };

  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = process.env.MONGO_FALLBACK || 'mongodb://127.0.0.1:27017/fitnessdb';

  if (!primaryUri) {
    console.warn('MONGO_URI not defined. Falling back to local MongoDB (development):', fallbackUri);
  }

  // Keep trying until we connect. This function resolves only once mongoose is connected.
  while (true) {
    const tryUris = [];
    if (primaryUri) tryUris.push({ uri: primaryUri, name: 'primary' });
    tryUris.push({ uri: fallbackUri, name: 'fallback' });

    let connected = false;

    for (const candidate of tryUris) {
      try {
        const conn = await mongoose.connect(candidate.uri, mongooseOptions);
        console.log(`MongoDB Connected (${candidate.name}): ${conn.connection.host}`);

        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
          console.log('MongoDB reconnected successfully');
        });

        mongoose.connection.on('error', (err) => {
          console.error(`MongoDB connection error: ${err.message}`);
        });

        connected = true;
        break;
      } catch (error) {
        console.error(`MongoDB Connection Error (${candidate.name}): ${error.message}`);
        if (error.message && (error.message.includes('ENOTFOUND') || error.message.includes('querySrv'))) {
          console.error('DNS lookup failed for the provided MongoDB SRV host. Common causes: incorrect MONGO_URI, network/DNS issues, or Atlas IP whitelist.');
        }
        // try next candidate
      }
    }

    if (connected) return; // success

    console.warn('All MongoDB connection attempts failed. Retrying in 5 seconds...');
    await sleep(5000);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  } catch (err) {
    console.error(`Error closing MongoDB connection: ${err.message}`);
    process.exit(1);
  }
});

export default connectDB;