import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/riidl_attendance';

  // Monitor Mongoose connection events
  mongoose.connection.on('error', (err) => {
    console.error(`Database error occurred: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.error('Database not connected: MongoDB connection lost! Attempting to reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.error('Database connection restored.');
  });

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
      });
    } catch (error) {
      console.error(`Database not connected: Initial connection failed - ${error.message}`);
      // Retry connection after 5 seconds instead of crashing the server
      setTimeout(connectWithRetry, 5000);
    }
  };

  await connectWithRetry();
};

export default connectDB;
