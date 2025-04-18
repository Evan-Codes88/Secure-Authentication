# Application Architecture Diagram

![Application Architecture Diagram](./images/AAD.png)

## High-Level AAD Explanation

This Application Architecture Diagram (AAD) outlines a backend focused system built with Node.js and Express. It demonstrates how the backend API interacts with a MongoDB database and integrates with external services like Mailtrap for email delivery and Speakeasy for two-factor authentication. The architecture ensures secure user management, including email verification and 2FA, while supporting token based authentication using JWT.

---

### Backend API (Node.js with Express)

#### Responsibilities:

- Core logic engine of the app.
- Routes for registration, login, logout, 2FA setup/verify, email verification, etc.
- Central control point for interacting with all other services and databases.
- Implements middleware layers for:
  - Validating JWTs
  - Handling authentication
  - Managing request/response cycles

#### Authentication & JWT Management

- **JWT Creation**: When the user successfully logs in and passes 2FA, the server generates a signed JWT.
- **Token Usage**: This JWT is required in headers for protected endpoints.
- **Token Verification**: Middleware checks the validity of incoming tokens.

#### Interactions:

- Communicates with **MongoDB** to fetch/write user data.
- Sends user email info to **Mailtrap**.
- Coordinates 2FA token generation/validation with **Speakeasy**.

---

### MongoDB (Database)

#### Responsibilities:

- Stores persistent user data: email, hashed password, 2FA secret, verification tokens, etc.

#### Interactions:

- Queried by the backend API during registration, login, and verification.

---

### Mailtrap (Email API for Development)

#### Responsibilities:

- Email sandbox for development/testing.
- Sends:
  - Verification emails
  - Welcome emails

#### Step By Step Flow:

1. User Triggers Email Event:
   A user will perform the action of signing up which is captured by the frontend and sent as a request to the Backend API.

2. Backend Prepares Email:
   The backend uses a helper function (e.g. `sendVerificationEmail`) to compose the email content. This includes:

   - Recipient email address
   - Subject line
   - Verification link/token
   - HTML/plaintext body

3. Send Via Mailtrap:
   The composed email data is sent to Mailtrap via a POST request. Mailtrap acts as a development SMTP server, intercepting emails so they do not reach real users.

4. Mailtrap Response:
   Mailtrap simulates the sending of the email and returns a response to the backend indicating success or failure.

5. Welcome Email:
   If the verification is successful, the system will trigger a welcome email through a similar path.

![Email Verification Flow](./images/Email%20Flow.png)

#### Benefits Of Using Mailtrap:

- Safe testing of transactional emails
- Avoids spamming real users
- Useful for debugging and reviewing email formatting
- Easy to integrate into CI/CD pipelines or dev workflows

---
