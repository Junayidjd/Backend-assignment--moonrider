
const express = require("express");  // Importing the express module to create a router
const identifyController = require("../controllers/identifyController");  // Importing the controller that handles the logic for the /identify endpoint

const router = express.Router();  // Creating a new Express router instance

// Define the POST /identify route
// This route will handle requests to identify or create a contact based on email and phone number
router.post("/identify", identifyController.identify);  // Use the 'identify' method from the controller to handle the request

// Export the router so it can be used in other parts of the application
module.exports = router;

