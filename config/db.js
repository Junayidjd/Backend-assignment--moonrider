
const mongoose = require('mongoose');  // Importing mongoose to interact with MongoDB
require('dotenv').config();  // Loading environment variables from .env file

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Establishing a connection to the MongoDB database using the URI from the environment variables
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,  // Use the new URL parser for MongoDB connection
      useUnifiedTopology: true,  // Use the unified topology for MongoDB connection
    });

    // Log a success message if not in test environment (to avoid logging during tests)
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected successfully!');  // Log the connection success
    }
  } catch (error) {
    // If the connection fails, log the error and exit the process with a failure code
    console.error('MongoDB connection error:', error);  // Log the error details
    process.exit(1);  // Exit the process with a failure status
  }
};

// Export the connectDB function to use in other parts of the application
module.exports = connectDB;
