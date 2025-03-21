
// const express = require('express');
// const bodyParser = require('body-parser');
// const connectDB = require('./config/db');
// const routes = require('./routes');
// require('dotenv').config();

// const app = express();
// app.use(bodyParser.json());

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use('/', routes);

// // Start server only if not in test environment
// const PORT = process.env.PORT || 3000;
// if (process.env.NODE_ENV !== 'test') {
//   const server = app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });

//   // Handle server close gracefully
//   process.on('SIGINT', () => {
//     server.close(() => {
//       console.log('Server closed');
//       process.exit(0);
//     });
//   });
// }

// module.exports = app; // Export app for testing












const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS for frontend-backend communication
const connectDB = require('./config/db');
const routes = require('./routes');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(
  cors({
    origin: 'http://localhost:5176', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

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