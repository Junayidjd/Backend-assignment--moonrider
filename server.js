// const express = require("express");
// const bodyParser = require("body-parser");
// const connectDB = require("./config/db");
// const routes = require("./routes");
// require("dotenv").config();

// const app = express();
// app.use(bodyParser.json());

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use("/", routes);

// // Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });











const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/', routes);

// Start server only if not in test environment
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Handle server close gracefully
  process.on('SIGINT', () => {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
}

module.exports = app; // Export app for testing