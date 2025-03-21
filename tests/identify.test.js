const request = require("supertest");  // Importing supertest to make HTTP requests to the API during testing
const mongoose = require("mongoose");  // Importing mongoose to interact with MongoDB for test setup
const app = require("../server");  // Importing the Express app to make requests to the server
const Contact = require("../models/Contact");  // Importing the Contact model to interact with the database

// Before all tests run, connect to MongoDB and clean the database
beforeAll(async () => {
  // Connect to MongoDB using the connection string from environment variables
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,  // Use the new MongoDB URL parser
    useUnifiedTopology: true,  // Use the new unified topology
  });

  // Clean up the Contact collection to ensure a fresh state before running tests
  await Contact.deleteMany({});
});

// After all tests are done, clean up the database and close the MongoDB connection
afterAll(async () => {
  // Clean up the Contact collection after the tests
  await Contact.deleteMany({});
  
  // Close the mongoose connection to cleanly disconnect from MongoDB
  await mongoose.connection.close();
});

// Test suite for the POST /identify endpoint
describe("POST /identify", () => {

  // Test case 1: Should create a new primary contact if no matching contacts exist
  it("should create a new primary contact if no matching contacts exist", async () => {
    // Send a POST request with email and phone number to the /identify endpoint
    const response = await request(app)
      .post("/identify")
      .send({ email: "test1@example.com", phoneNumber: "1234567890" });

    // Assertions: Check that the response status is 200 and that the response contains the expected data
    expect(response.status).toBe(200);  // Status should be 200 (OK)
    expect(response.body.primaryContactId).toBeDefined();  // Ensure the primaryContactId is returned
    expect(response.body.emails).toContain("test1@example.com");  // Ensure the email is included
    expect(response.body.phoneNumbers).toContain("1234567890");  // Ensure the phone number is included
    expect(response.body.secondaryContactIds).toEqual([]);  // Ensure no secondary contact IDs are included
  });

  // Test case 2: Should return 400 if neither email nor phoneNumber is provided
  it("should return 400 if neither email nor phoneNumber is provided", async () => {
    // Send a POST request without email or phone number
    const response = await request(app).post("/identify").send({});

    // Assertions: Check that the response status is 400 and the appropriate error message is returned
    expect(response.status).toBe(400);  // Status should be 400 (Bad Request)
    expect(response.body.message).toBe("At least one of email or phoneNumber is required");  // Ensure correct error message
  });

  // Test case 3: Should return 400 if email format is invalid
  it("should return 400 if email format is invalid", async () => {
    // Send a POST request with an invalid email format
    const response = await request(app)
      .post("/identify")
      .send({ email: "invalid-email", phoneNumber: "1234567890" });

    // Assertions: Check that the response status is 400 and the appropriate error message is returned
    expect(response.status).toBe(400);  // Status should be 400 (Bad Request)
    expect(response.body.message).toBe("Invalid email format");  // Ensure correct error message for email
  });

  // Test case 4: Should return 400 if phone number format is invalid
  it("should return 400 if phone number format is invalid", async () => {
    // Send a POST request with an invalid phone number format
    const response = await request(app)
      .post("/identify")
      .send({ email: "test1@example.com", phoneNumber: "invalid-phone" });

    // Assertions: Check that the response status is 400 and the appropriate error message is returned
    expect(response.status).toBe(400);  // Status should be 400 (Bad Request)
    expect(response.body.message).toBe("Invalid phone number format");  // Ensure correct error message for phone number
  });

});
