# Authentication System Containerisation Planning

This document explains the full application architecture of a secure user management system, including user authentication, 2FA, email verification, and session handling.

# Application Architecture Diagram

![Application Architecture Diagram](./images/AAD.png)

## High-Level AAD Explanation

## This Application Architecture Diagram (AAD) outlines a backend focused system built with Node.js and Express. It demonstrates how the backend API interacts with a MongoDB database and integrates with external services like [Mailtrap](https://mailtrap.io) for email delivery and [Speakeasy](https://github.com/speakeasyjs/speakeasy) for two-factor authentication. The architecture ensures secure user management, including email verification and 2FA, while supporting token based authentication using [JWT](https://jwt.io).

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

1. _User Triggers Email Event:_
   A user will perform the action of signing up which is captured by the frontend and sent as a request to the Backend API.

2. _Backend Prepares Email:_
   The backend uses a helper function (e.g. `sendVerificationEmail`) to compose the email content. This includes:

   - Recipient email address
   - Subject line
   - Verification link/token
   - HTML/plaintext body

3. _Send Via Mailtrap:_
   The composed email data is sent to Mailtrap via a POST request. Mailtrap acts as a development SMTP server, intercepting emails so they do not reach real users.

4. _Mailtrap Response:_
   Mailtrap simulates the sending of the email and returns a response to the backend indicating success or failure.

5. _Welcome Email:_
   If the verification is successful, the system will trigger a welcome email through a similar path.

---

![Email Verification Flow](./images/Email%20Flow.png)

#### Benefits Of Using Mailtrap:

- Safe testing of transactional emails
- Avoids spamming real users
- Useful for debugging and reviewing email formatting
- Easy to integrate into CI/CD pipelines or dev workflows

---

### Speakeasy (2FA Library)

#### Responsibilities:

- Generates TOTP 2FA secrets.
- Verifies TOTP tokens during login.

#### Step By Step Flow:

1. _User Signs Up and Enables 2FA:_
   The user will be automatically guided to the 2FA after signing up. The backend uses Speakeasy to generate a time based one time password (TOTP) secret.

2. _Secret Sent To User:_
   The TOTP secret is converted into a QR code (e.g., using qrcode npm package) and sent to the user via frontend. The user scans it with an authenticator app like Google Authenticator or Authy.

3. _User Logs In With 2FA Code:_
   After submitting correct credentials, the frontend prompts the user for their 2FA code. This code is submitted back to the backend for validation.

4. _Backend Verifies Code:_
   Speakeasy checks the code against the saved secret using `totp.verify()`

5. _Success Or Failure:_
   - If valid, the backend allows the login to proceed and generates a JWT.
   - If invalid, an error response is returned and access is denied.

---

![2FA Flow](./images/2FA%20Setup%20Flow.png)

#### Why It's Important:

- Greatly reduces the risk of credential-based breaches.
- Even if passwords are compromised, the attacker can’t log in without the 2FA code.
- Easy to implement and widely supported.

---

### Authentication & JWT Management Flow Explanation

#### Responsibilities

To ensure users are securely authenticated and can maintain a session across multiple requests.

#### Step By Step Flow:

1. _User Logs In:_
   The user submits credentials (email/password) through the frontend

2. _Backend Validates Credentials:_
   The Express backend checks credentials against stored values in MongoDB (passwords hashed via `bcrypt`)

3. _2FA Check:_
   The system will envoke the 2FA Flow. If successful, it continues to the next step

4. _JWT Generation:_
   Once verified, the backend generates a JWT (JSON Web Token) using a secret key. The JWT contains:

   - User ID
   - Issued timestamp
   - Expiry (e.g., 1h or 7d)

5. _Token Sent To Client:_
   The JWT is sent back to the frontend and stored in localStorage or as an HTTP-only cookie

6. _Authentication Requests:_
   On every future API request, the JWT is sent in the Authorisation header. The backend validates the token using middleware (e.g., `express-jwt` or custom logic).

7. _Token Expiry:_
   If the token is expired or invalid, the user is asked to log in again.

---

![Authentication Workflow](./images/Authentication%20Flow.png)

#### Why JWT:

- Stateless authentication (no session stored on server)
- Easy to scale across services
- Secure when properly signed and stored

---

# Error Handling and Edge Cases

## Responsibilities

Manage potential errors in authentication, such as invalid credentials, failed 2FA, or database issues.

## Step-by-Step Flow

### 1. **Failed Authentication**

- **Condition:** If the user provides incorrect credentials (wrong email or password).
- **Response:** The backend responds with an error message and status code `400 Bad Request`:
  - Message: `"Invalid credentials"`

### 2. **Failed 2FA**

- **Condition:** If the user enters an invalid 2FA code during login or verification.
- **Response:** The system returns a `400 Bad Request` error:
  - Message: `"Invalid 2FA code"`

### 3. **Failed Email Verification**

- **Condition:** If the user attempts to verify an email with an invalid or expired verification token.
- **Response:** The system returns a `400 Bad Request` error:
  - Message: `"Invalid or expired verification code"`

### 4. **Database Issues**

- **Condition:** If the MongoDB database is unreachable or an error occurs while interacting with the database.
- **Response:** The backend responds with an error status indicating the issue, such as `500 Internal Server Error`.
  - Message: `"Failed to send verification email: <error_message>"` or `"Database connection failed"`

### 5. **Missing Fields**

- **Condition:** If required fields are missing in the request (e.g., during signup or login).
- **Response:** The backend responds with an error message and status code `400 Bad Request`:
  - Message: `"All fields are required"`

### 6. **Password Strength Validation**

- **Condition:** If the user’s password does not meet strength requirements (at least 6 characters, contains at least one letter and one number).
- **Response:** The system returns a `400 Bad Request` error:
  - Message: `"Password must be at least 6 characters and contain at least one letter and one number."`

### 7. **Email Already Exists**

- **Condition:** If the email is already registered in the system.
- **Response:** The system returns a `400 Bad Request` error:
  - Message: `"Email is already in use"`

### 8. **User Not Verified**

- **Condition:** If a user attempts to log in without verifying their email.
- **Response:** The system returns a `403 Forbidden` error:
  - Message: `"Please verify your email before logging in"`

### 9. **2FA Required**

- **Condition:** If the user tries to log in but 2FA is not enabled.
- **Response:** The system returns a `403 Forbidden` error:
  - Message: `"2FA setup is required before you can log in"`

### 10. **Logging Errors**

- **Condition:** Any error occurring in the authentication flow, including validation failures and 2FA issues, should be logged for debugging.
- **Response:** While errors are currently logged to the console for debugging, it's recommended to use a logging library (e.g., [Winston](https://github.com/winstonjs/winston) or [Morgan](https://github.com/expressjs/morgan)) for more comprehensive error tracking. This approach ensures that all errors are properly logged and can be effectively monitored for troubleshooting purposes.

## Example Error Responses

### Login Error:

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 2FA Code Error:

```json
{
  "success": false,
  "message": "Invalid 2FA code"
}
```

### Database Connection Error:

```json
{
  "success": false,
  "message": "Failed to send verification email: Database connection failed"
}
```

### Missing Field Error:

```json
{
  "success": false,
  "message": "All fields are required"
}
```

---

## Security Considerations

### Password Policies:

Ensure that passwords meet complexity requirements, such as:

- Minimum length of 8 characters
- Must contain at least one uppercase letter, one number, and one special character.

### Secure Storage:

- Passwords should be hashed using bcrypt before storage in MongoDB.
- 2FA secrets should be stored securely and not exposed in clear text.

### Rate Limiting:

- Implement rate limiting to prevent brute force attacks on login, registration, and email verification endpoints (e.g., using `express-rate-limit`).

---

## Session Expiry and Refresh Tokens

### Responsibilities:

Ensure secure session management, allowing users to remain logged in without needing to constantly re-authenticate.

### Flow:

1. **User Logs In**: After the user successfully logs in and completes 2FA, a short-lived JWT (JSON Web Token) is created to manage the user's session.

2. **Refresh Token**: Alongside the JWT, a refresh token is generated and sent to the frontend. The refresh token is securely stored (e.g., in an HTTP-only cookie) to prevent access via client-side JavaScript.

3. **Token Expiry**: When the JWT expires, the frontend can send the refresh token to the backend to request a new JWT. This allows users to remain logged in without needing to authenticate again, improving the user experience while maintaining security.

### Key Security Considerations:

- Ensure the refresh token is stored securely in an HTTP-only cookie to prevent exposure via client-side scripts.
- Implement proper token expiration and validation mechanisms on the backend to minimize potential vulnerabilities.

---

## Future Improvements: Logging and Monitoring

### Responsibilities:

Enhancing the logging and monitoring process will help ensure more efficient debugging and improve security audits as the project scales.

### Proposed Improvements:

1. **Log Successful Logins/Logouts**:

   - Future development should include recording detailed information on every successful and failed login attempt, such as IP address, date/time, and device information.
   - This will improve the ability to track user activity and diagnose issues related to authentication.

2. **Monitor Suspicious Activity**:
   - Implement a robust monitoring service that can detect abnormal login behavior, like multiple failed login attempts or attempts from suspicious IP addresses.
   - Proactive monitoring can help quickly identify unauthorized access attempts and improve overall system security.

---

## Future Improvements: Database Schema & Third-Party Integrations

### Responsibilities:

- **Database Schema**: Ensure secure and efficient management of user data.
- **Third-Party Integrations**: Plan for any future integrations with external services such as payment systems or social login options.

### Proposed Improvements:

#### Database Schema:

1. **Users Collection**:

   - The `Users` collection will store essential user data, including email, hashed password, and 2FA secrets.
   - This will allow efficient and secure access to user-specific information during authentication and authorization.

2. **Sessions Collection (Optional)**:
   - An optional `Sessions` collection could be used to store session-specific data such as refresh tokens, session expiration time, etc.
   - This will improve the scalability and manageability of user sessions, particularly for applications with long-lasting user interactions.

#### Third-Party Integrations:

1. **Payment System Integration**:

   - Future integration of a payment system (e.g., Stripe or PayPal) could enable secure transactions for your e-commerce functionalities.
   - It will be essential to plan for secure handling of payment data and smooth interaction with the payment API.

2. **Social Login**:
   - Consider adding social login options (e.g., Google, Facebook) to streamline the registration and login process for users.
   - This would enhance user convenience, as many users prefer using existing credentials for login.
