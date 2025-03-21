# Identity Reconciliation Service

This project is a backend service for identity reconciliation. It links different contact details (emails and phone numbers) to the same individual, even if they use different contact information for each purchase.

## Features

- **Identify Endpoint:** Accepts JSON payloads with `email` and `phoneNumber` fields.
- **Database Integration:** Uses MongoDB to store and manage contact information.
- **Error Handling:** Provides meaningful error messages for invalid inputs.
- **Unit Tests:** Includes Jest and Supertest for testing the `/identify` endpoint.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Testing:** Jest, Supertest
- **Environment Management:** dotenv

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Running locally or a connection string)
- [Git](https://git-scm.com/) (Optional, for version control)

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/identity-reconciliation.git
   cd identity-reconciliation/backend
