const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const Contact = require("../models/Contact");

beforeAll(async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Clean up database before running tests
  await Contact.deleteMany({});
});

afterAll(async () => {
  // Clean up database after running tests
  await Contact.deleteMany({});
  await mongoose.connection.close();
});

describe("POST /identify", () => {
  it("should create a new primary contact if no matching contacts exist", async () => {
    const response = await request(app)
      .post("/identify")
      .send({ email: "test1@example.com", phoneNumber: "1234567890" });

    expect(response.status).toBe(200);
    expect(response.body.primaryContactId).toBeDefined();
    expect(response.body.emails).toContain("test1@example.com");
    expect(response.body.phoneNumbers).toContain("1234567890");
    expect(response.body.secondaryContactIds).toEqual([]);
  });

  it("should return 400 if neither email nor phoneNumber is provided", async () => {
    const response = await request(app).post("/identify").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "At least one of email or phoneNumber is required"
    );
  });

  it("should return 400 if email format is invalid", async () => {
    const response = await request(app)
      .post("/identify")
      .send({ email: "invalid-email", phoneNumber: "1234567890" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email format");
  });

  it("should return 400 if phone number format is invalid", async () => {
    const response = await request(app)
      .post("/identify")
      .send({ email: "test1@example.com", phoneNumber: "invalid-phone" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid phone number format");
  });
});