# Ethical Auth: Building Trust Through Secure Web Authentication

## Introduction

Security is becoming a crucial necessity in the ever changing digital world of today, not an optional feature. The frequency of data breaches and account takeovers is rising, particularly in applications that manage private user data.

According to IBM's _Cost of a Data Breach Report 2023_, the average cost of a data breach in 2023 was _$4.45 million_, a _15% increase over three years_.

In response to this growing concern, I created a safe authentication system that is modular and simple to incorporate into other web application projects, allowing developers to use email verification, JWT, and TOTP-based 2FA to achieve robust authentication.

This blog post walks through the _ethical and technical issues_ tackled in this project, provides _implementation details and justifications_, and _reflects on lessons learned during development_. It also explores _current and emerging industry trends in web security_, such as the rising adoption of multi-factor authentication (MFA) and the shift toward zero-trust architecture. Additionally, it includes _full setup instructions_ and _real-world case studies_, offering developers an opportunity to implement a scalable, modern, and secure authentication system in their own projects.

## Table of Contents

- [Industry Trends and Opportunities](#industry-trends-and-opportunities) - [Passwordless Authentication Is Going Mainstream](#passwordless-authentication-is-going-mainstream)
- [The Rise of Zero Trust Security Models](#the-rise-of-zero-trust-security-models)
- [Ethical and Technical Considerations](#ethical-and-technical-considerations)
- [The Core Ethical Issue: Mishandling User Authentication](#the-core-ethical-issue-mishandling-user-authentication)
- [Trust and Responsibility in the Developer Role](#trust-and-responsibility-in-the-developer-role) - [Consequences of Ethical Negligence](#consequences-of-ethical-negligence)
- [How This Project Addresses These Ethical Concerns](#how-this-project-addresses-these-ethical-concerns)
- [The Problem: Insecure User Authentication and Its Solution](#the-problem-insecure-user-authentication-and-its-solution)
- [Why Is This A Problem](#why-is-this-a-problem)
- [The Solution: Multi-layered Authentication and Secure Session Design](#the-solution-multi-layered-authentication-and-secure-session-design)
- [JWT Authentication](#jwt-authentication)
- [Two Factor Authentication (2FA) with TOTP](#two-factor-authentication-2fa-with-totp)
- [Email Verification](#email-verification)
- [Secure Cookie Handling](#secure-cookie-handling)
- [Logout and Token Revocation](#logout-and-token-revocation)
- [Compliance With Industry Recommendations](#compliance-with-industry-recommendations)
- [Practical Outcomes and Risk Mitigation](#practical-outcomes-and-risk-mitigation)

- [Objective](#objective)
- [Step By Step Plan](#step-by-step-plan)
  - [Step 1: Identify The Problem & Research Frameworks](#step-1-identify-the-problem--research-frameworks---time-estimation-4-6-hours)
  - [Step 2: Project Planning and Timeline](#step-2-project-planning-and-timeline---time-estimation-5-7-hours)
  - [Step 3: Feature Development and Implementation](#step-3-feature-development-and-implementation---time-estimation-12-15-hours)
- [Reflection On Implementation](#reflection-on-implementation)
- [Skills Justification and Technology Choices](#skills-justification-and-technology-choices)
  - [Why These Skills and Technologies Were Chosen](#why-these-skills-and-technologies-were-chosen)
- [Skills Gained During This Project](#skills-gained-during-this-project)
- [Getting Started](#getting-started)

## Industry Trends and Opportunities

Strong and intuitive authentication techniques are more important than ever as the tech sector develops. Authentication is becoming a crucial component of the user experience and application design due to the rise in cybersecurity concerns and changing user expectations. The future of authentication is being shaped by two significant and extremely pertinent trends:

# Passwordless Authentication Is Going Mainstream

One of the biggest changes in authentication today is the move away from traditional passwords in favor of more secure and user-friendly methods. Passwordless authentication options, such as biometric recognition (fingerprints or facial scans), magic links sent through email, security keys like YubiKey, and device-based authentication using protocols like FIDO2, are becoming increasingly popular.

This shift is driven by the fact that passwords have long been a weak point in security. They're often reused, easy to guess, and vulnerable to phishing attacks. On top of that, many users find passwords frustrating to manage, leading to a poor user experience.

According to Gartner, “By 2025, more than 50% of the workforce and more than 20% of customer authentication transactions will be passwordless,” marking a dramatic shift in how we secure user accounts (Gartner, 2022).

Industry leaders like Microsoft, Google, and Apple are already rolling out passwordless login solutions across their platforms, using passkeys and biometric hardware as default options.

Also according to Verizon’s Data Breach Investigations Report, 68% of data breaches involved human error, highlighting the vulnerabilities associated with traditional password systems JumpCloud (2025).

> Opportunity: For developers, this presents an exciting opportunity to implement WebAuthn, OAuth with magic links, or biometric support using third-party authentication services. This not only improves security but also reduces friction during login, boosting user retention.

In my project, I’ve set up a standard login system using usernames and passwords, but I’ve made sure it follows modern security best practices. Passwords are hashed, sessions are managed using JWTs, and I’ve made 2FA mandatory to add an extra layer of security. I’ve also added email verification during sign-up to help confirm user identities.

Even though the system currently uses passwords, I’ve built it in a way that makes it easy to upgrade later—whether that’s adding support for biometric logins with WebAuthn, using magic links sent via email, or letting users log in with hardware keys like YubiKey.

This setup keeps things secure right now, but also makes sure I’m ready for the future as passwordless login methods become more common. It’s a great opportunity for developers to stay ahead of the curve and offer users a smoother, safer login experience.

# The Rise of Zero Trust Security Models

The old "castle and moat" approach to security, where anything inside the system was trusted; no longer works. Organisations are now shifting to the Zero Trust model, which is based on the idea of "never trust, always verify."

In a Zero Trust environment, every access request is thoroughly authenticated and authorised, regardless of its origin. This paradigm shift necessitates robust security measures, including:

- **Strong Authentication Mechanisms:** Implementing secure methods to verify user identities.

- **Multi-Factor Authentication (MFA):** Requiring multiple forms of verification to grant access.

- **Token Expiration Policies:** Ensuring that access tokens have limited lifespans to reduce risk.

- **Granular Role-Based Access Controls (RBAC):** Assigning permissions based on user roles to minimize unnecessary access.

A recent Forrester Research report highlights that organizations implementing Zero Trust strategies experience enhanced threat detection, improved incident response, and better protection against insider threats . Furthermore, Forrester's Security Survey 2023 indicates that 73% of global security decision-makers have integrated application and workload security into their Zero Trust strategies . (Forrester, 2023)

> Opportunity: Developers must now design apps with this in mind, using short-lived tokens, refresh token mechanisms, role-based access controls (RBAC), and activity logging to enforce Zero Trust principles.

In my authentication system, I've incorporated JSON Web Tokens (JWTs) with defined expiration times, secure cookie practices, and bcrypt hashing for password security. These measures align with Zero Trust fundamentals, ensuring that each access request is validated and that user credentials are protected. The system's architecture is designed to be adaptable, allowing for future enhancements such as integrating biometric authentication or hardware security keys, further reinforcing the Zero Trust approach.

## Ethical and Technical Considerations

As developers we are not only problem solvers, but we are also responsible for people's personal data and digital identities. Creating an authentication system isn't just for restricting access points, it means protecting users from harm, uphoalding legal resposibilities, and creating and maintaining trust with our users that their personal data is safe. One of the most critical ethical issues in software development today is the secure handling of user authentication.

# The Core Ethical Issue: Mishandling User Authentication

This ethical issue surrounds failure to protect user data by using inedequate methods of authentication or storing users personal infomation incorrectly. Failure to do so can lead to identity theft, blackmail, financial loss, or reputational damage for both users and companies.

This is a violation of ethical responsibility and legal obligations, particularly under regulations such as the _General Data Protection Regulation (GDPR)_ and the _Australian Privacy Principles (APPs)_.

**Example Ethical Violations:**

- Storing plaintext passwords or insecure password hashes.

- Failing to implement multi-factor authentication in applications dealing with sensitive or financial data.

- Using vulnerable authentication flows without proper threat modeling or penetration testing.

These choices can be caused by many factors including laziness or rushing to ship quickly and can result in ethical violations that harm users.

> According to the GDPR (Art. 5), personal data must be “processed in a manner that ensures appropriate security,” including protection against unauthorized access and accidental loss. Failing to meet this standard is not just illegal, it’s unethical. European Commission, General Data Protection Regulation (GDPR).

# Trust and Responsibility in the Developer Role

Users very rarely read the fine print and have an inherent trust in developers to "do the right thing" surrounding their personal data. This means we have a _moral responsibility_ to ensure we understand and anticipate how malicious actors might exploit our system.

For instance, if an app handles medical information, not implementing 2FA can be considered unethical. Even if it’s technically “compliant.” Similarly, neglecting secure session handling (e.g., missing HttpOnly or SameSite cookie flags) is equivalent to leaving the door open to attackers.

> The ACM Code of Ethics emphasizes that computing professionals must “design and implement systems that are robustly and usably secure.” It also states that developers should “take care to avoid harm.” ACM Code of Ethics and Professional Conduct

# Consequences of Ethical Negligence

Neglecting secure authentication practices has real-world consequences:

- Uber (2022): An attacker used social engineering and poor MFA design to compromise internal systems, revealing source code and administrative dashboards.

- Colonial Pipeline (2021): Weak credentials and no MFA led to a major ransomware attack that disrupted fuel supply for millions of Americans.

These are not just security failures but ethical failures that compromised the public’s safety, finances, and digital well-being.

# How This Project Addresses These Ethical Concerns

This project directly responds to these concerns by implementing:

- Time-based One-Time Password (TOTP) 2FA, to ensure only the rightful user can log in, even if their password is compromised.

- JWT Authentication with Expiration and secure cookie handling to reduce the risk of session hijacking.

- Email Verification to confirm user identity and prevent fraudulent registrations.

These mechanisms demonstrate a commitment to ethical development practices and reflect a deep understanding of technical safeguards.

## The Problem: Insecure User Authentication and Its Solution

In many web applications, user authentication is often the most frequently exploited weakness within modern web applications. Despite it being resposible for maintaing user security and is a gateway to sensitive user data, many systems still rely on outdated security practices. For example some developers default tominimal security implementations such as password only logins, without considering the broader security implications or user behaviour.

# Why Is This A Problem

Passwords are a critical vulnerability due to many factors:

- _Weak or common passwords:_ Many users will choose easily guessable passwords, like Password123 or 123456.
- _Reused Passwords:_ If a password is reused across many different platforms. A breach on one, leaves all other services at risk.
- _Phishing and Social Engineering:_ Attackers will exxploit human error by tricking users into entering their details into malicious sites.
- _Lack Of Password Complexity Enforcement:_ Without requirements for length, symbols, or unpredictability, passwords are easier to crack.

> According to Verizon’s 2023 Data Breach Investigations Report, 74% of breaches involved the human element, including stolen credentials, phishing, and user errors making poor authentication practices a root cause of many large scale data leaks (Verizon, 2023).

Beyond passwords, incorrect session handling can also impose more risks:

- _Insecure Cookie Settings:_ Missing HttpOnly, Secure, or SameSite=Strict leaves sessions open to hijacking through javascript based XSS attacks or CSRF.
- _Long Lived Token:_ Tokens without expiration mechanisms allow attackers prolonged access.
- _Lack Of Audit Logging:_ Without this logging, developers are unable to track unauthorised attempts or session misuse.

> As OWASP states in its Authentication Cheat Sheet:
> “Authentication is broken more often than it is built correctly. It’s one of the most commonly targeted and misunderstood areas of web application security.”

This points to not just a technical issues, but a deeper failure of due diligence from developers. Failing to secure authentication properly can:

- Violate data privacy laws (e.g., GDPR, Australian Privacy Act)
- Harm users through identity theft or fraud
- Irreparably damage a company’s reputation and finances

# The Solution: Multi-layered Authentication and Secure Session Design

To mitigate the above risks, my project implements a layered, secure authentication system that goes far beyond password only validation.

# JWT Authentication

- Uses stateless, signed tokens for scalable and efficient session management.
- Includes short expiration times to reduce the time window in which a stolen token can be used.
- Tokens are validated on every request for a protected route, enforcing strict acces control.

# Two Factor Authentication (2FA) with TOPT

- Integrates Time Based One Time Passwords, generated by trusted apps like Google Authenticator, Apple Passwords, or Authy.
- Even if a password is compromised, access cannot be granted without the second factor.

# Email Verification

- On signup, the user must verify their email via a time sensitive verification code.
- This prevents spam registrations, email spoofing, and the creation of throwaway accounts.
- Ensures that only real, active users can log in and reduces the risk of bot abuse.

# Secure Cookie Handling

- Tokens are stored with HttpOnly, Secure, and SameSite=Strict flags which:
  - Block javascript access (mitigating XSS attacks)
  - Prevent unauthorised cross site requests (mitigating CSRF)
  - Ensuring cookies are only sent over HTTPS

# Logout and Token Revocation

- Implements logout mechanisms that invalidate user sessions by revoking JWT from client side storage.
- Prevents the use of stolen or expired tokens.

# Compliance With Industry Recommendations

- Aligns with OWWASP Top 10 and Australian Cyber Security Center (ACSC) best preactices
- > The ACSC (2024) states: “Multi-factor authentication makes it significantly harder for adversaries to gain access to systems, even if they obtain a user’s password.”

# Practical Outcomes and Risk Mitigation

Through these measures, my project defends agaisnt:

- _Credential Stuffing:_ Rate limited login + TOPT 2FA.
- _Session Hijacking:_ Secure, short-lived JWT's in HTTP-only cookies.
- _Phishing:_ Verification of users email and MFA enforcement.
- _Account Takeeovers:_ Multiple verification steps.
- _CSRF Attacks:_ SameSite=Strict and CSRF-safe cookies.
- _Token Replay:_ Expiring JWT's with logout token revocation.

These layered defenses close common security gaps while preserving a user-friendly login experience—balancing security with usability.

## Project Plan: Authentication System Implementation

# Objective

My goal for this project was to design a multi layered authentication system for developers to use in their web applications that mitigates common threats such as credential stuffing, phishing, and session hijacking and ultimately protecting sensitive user data and ensuring legal compliance.

# Step By Step Plan

# Step 1: Identify The Problem & Research Frameworks - Time Estimation 4-6 Hours

_Identify and Define the Problem_
My project began with me identifying a common vulnerability in modern web applications: insecure user authentication. With a growing number of data breaches caused by stolen credentials and weak login systems, I chose to solve this issue by designing a secure, multi layered authentication system that developers could take and implement in their own projects.

_Framework and Tool Research_
Before I dove in to start building my project, I completed comparative research into various frameworks and libraries that could help enfore modern security practices.

- _Express.js (Node.js Framework):_ I went with Express for its speed, minimalism, and flexibility. I considered alternatives like Django and Laravel, but Express was chosen for its lightweight nature, vast community, and my existing familiarity with JavaScript (a language I’ve been actively developing in).

- _Comparing Authentication Approaches:_

  - _Session Based Authentication:_ express-session was considered as it offers stateful security but it does require server side storage making it less scalable.
  - _JWT (JSON Web Tokens):_ Stateless, scalable, and suitable for RESTful APIs. Widely adopted and recommended by OWASP.
  - I selected JWT due to its easy integration into modern web applications, and its ability to securely transport users personal data between frontend and backend without storing session state on the server.

- _2FA Libraries:_

  - Explored tools like Speakeasy and otplib for TOTP-based 2FA.
  - Speakeasy was selected due to its clear documentation and compatibility with Google Authenticator.

- _Rate Limiting Solution:_

  - Evaluated express-rate-limit and rate-limiter-flexible.
  - Opted for express-rate-limit because it provides sufficient security for login throttling and integrates well with Express without additional dependencies like Redis.
  - This middleware was easy to integrate with Express and allowed me to define limits (e.g., 5 attempts per 15 minutes) with minimal configuration.

- _Email Verification:_
  - Instead of traditional SMTP or third-party marketing tools, I used Mailtrap, a secure email testing tool designed for development environments.
  - Mailtrap simulates real email delivery, allowing me to test verification flows without sending emails to real inboxes, which is perfect for a project focused on backend logic and security.
  - Compared to SendGrid or Mailgun, Mailtrap was faster to configure and didn't require setting up DNS records or domains, which would have added complexity and cost.

# Step 2: Project Planning and Timeline - Time Estimation 5-7 Hours

After selecting the tools and frameworks in Step 1, I developed a structured plan to guide the entire development process. This included outlining each major development milestone, assigning estimated timeframes, and defining clear deliverables for each stage.

_Goal Setting and Prioritisation:_
I broke down the overall project objective - to build a secure, multi layered user authentication system, into smaller, achievable goals based on functionality and security:

- _Core Authentication:_ Sign-up, login, logout using JWT.
- _Email Verification:_ Send and verify time-sensitive email tokens via Mailtrap.
- _Two-Factor Authentication (2FA):_ Enforce TOTP for individual users after signup.
- _Secure Cookie & Session Handling:_ Implement HttpOnly, Secure, SameSite settings.
- _Rate Limiting and Brute Force Protection:_ Throttle login attempts.
- _Logout and Token Revocation:_ Ensure stolen tokens cannot be reused.
- _Error Handling, Validation, and Logging:_ Improve debugging and security auditing.
- _Testing & Documentation:_ Unit testing critical flows, writing clear setup documentation.

_Agile Inspired Workflow:_
Although this was a solo project, I followed a lightweight agile approach by:

- Working in small, testable increments (e.g., complete login before building 2FA).
- Creating mini sprints per feature with GitHub commits for each task.
- Continuously testing endpoints using Postman after each implementation.
- Committing regularly with clear commit messages describing functionality added or bugs fixed.

_Balancing Realism with Ambition:_
I was mindful not to bite off more than I could chew or try to implement features I couldn’t fully secure (e.g., biometric authentication, complex user permissions). The planning focused on implementing real-world, industry-recommended authentication layers while allowing time for proper testing and documentation.

# Step 3: Feature Development and Implementation - Time Estimation 12-15 Hours

This step involved developing the core functionality of my secure authentication system. It required a thoughtful, layered approach to ensure not just usability but compliance with security best practices from OWASP and the Australian Cyber Security Centre.

1. _User Registration and JWT Based Login:_
   - Implemented using Express,js with bcrypt for password hashing and jsonwebtoken for token generation.
   - _On Signup:_
     - User password is hashed and saved to mongoDB.
     - And email verification token is generated and sent via Mailtrap for secure testing.
   - _On Login:_
     - User credentials are verified.
     - A signed JWT is generated and sent in a secure, HTTPOnly cookie with SameSite=Strict.

_Security Consideration: Short-lived JWTs (15 mins) were used to minimise token reuse risk, with refresh tokens planned for future work._

2. _Email Verification Via Mailtrap:_
   - Implemented a system to:
     - Generate a time sensitive token on signup (expires after 10 mins).
     - Store user as unverified until they input said verification code sent to them via Mailtrap.
   - Verified users are granted access to login.

_Justification: Mailtrap allows safe testing of real email logic without spamming actual inboxes — ideal for dev environments (Mailtrap, 2024)._

3. _Two-Factor Authentication (2FA) Using TOTP_
   - Integrated speakeasy to generate Time-based One-Time Passwords (TOTP).
   - Users will be directed after logging in for the first time to enable 2FA.

_Justification: TOTP dramatically reduces the risk of password-only breaches, aligning with ACSC and OWASP recommendations._

4. _Rate Limited Login Attempts:_
   - Used express-rate-limit to block brute force attacks by:
     - Limiting login attempts to 5 per 10 minutes per IP address.
     - Returning a warning and temporary lockout message on abuse.

_Justification: This stops automated credential stuffing and supports responsible login practices._

5. _Secure Session Cookies:_
   - JWTs were sent to clients as HttpOnly and Secure cookies:
     - HttpOnly prevents JavaScript access (defeats XSS token theft).
     - Secure ensures transmission only over HTTPS.
     - SameSite=Strict blocks cross origin login attempts (defeats CSRF).

_Justification: Matches recommendations from OWASP's Authentication Cheat Sheet (2023)._

6. _Logout Token Revocation:_
   - Built a logout route that clears the authentication cookie.
   - Server ensures any residual tokens are invalidated client-side.

_Future Plan: Implement a token blacklist or refresh token rotation for high-risk use cases (e.g., financial services)._

7. _Error Handling, Validation, and Logging In:_
   - Implemented descriptive server-side error messages.
   - Created a centralized error middleware to catch unhandled issues and log them neatly.

_Future Plan: Use express-validator to validate all inputs (email format, password strength) instead of checking manually._

8. _Manual Testing Via Postman:_
   - Each endpoint was tested:
     - Valid and invalid inputs
     - Token expiry scenarios
     - 2FA workflow
     - Email verification workflow
   - JWTs and cookies were inspected manually via DevTools and Postman headers.

# Reflection On Implementation

I followed a "build small, test often" strategy. This made it easier to isolate bugs and focus on the security of each component before adding complexity. The structure of the code remained modular and scalable, allowing new features like password reset, refresh tokens, or user roles to be added later.

# Skills Justification and Technology Choices

To successfully complete this project, I drew upon a wide range of skills that were essential in developing a secure, modern user authentication system. These included:

- _Backend Development with Node.js and Express:_ Understanding of routing, middleware, and RESTful API design.
- _Authentication and Authorisation:_ Implementation of JWT-based auth, user session management, and plans to implement role-based access in the future.
- _Security Best Practices:_ Knowledge of hashing (bcrypt), cookie security, environment variables, and brute force attack prevention.
- _Email Handling and 2FA:_ Experience with SMTP services (Mailtrap) and implementing TOTP based 2FA with Speakeasy.
- _Database Operations:_ CRUD functionality and schema management with MongoDB and Mongoose.

Each of these skills was critical to addressing the primary problem: building a secure and scalable login system that protects user data and supports 2FA.

# Why These Skills and Technologies Were Chosen

The choices made for this project were deliberate and based on a combination of prior knowledge, industry best practices, and resource availability:

- _Node.js and Express:_ Chosen for its lightweight, asynchronous nature and large ecosystem. It allowed for rapid backend development and easy integration with other tools like MongoDB. I also chose it based on prior knowledge and experience.
- _MongoDB and Mongoose:_ Used for their flexibility and JSON like structure, making it easy to model users and authentication tokens. The Mongoose ORM simplifies validation and schema handling as well.

- _JSON Web Tokens:_ Offers stateless authentication, which is ideal for RESTful APIs. It allows user sessions to be validated without querying the database on every request.

- _Bcrypt:_ A widely adopted hashing algorithm designed for passwords, offering protection against cyber attacks.

- _Speakeasy:_ Chosen for its simplicity in implementing TOTP 2FA, following the same standard used by Google Authenticator and similar apps.

- _Mailtrap:_ Selected as a safe, development-friendly SMTP testing tool, preventing accidental emails being sent to real users while still verifying integration.

## Skills Gained During This Project

This project was a significant opportunity for personal and professional development, helping me to grow as a developer and deepen my understanding of backend security, authentication workflows, and full-stack project planning. The key skills I developed include:

- _Advanced Authentication Techniques:_
  I gained a strong understanding of how modern applications handle user authentication, particularly 2FA. This includes generating and validating time based tokens (TOTP), understanding the logic behind verification windows, and securing sensitive user information.

- _Security Best Practices With Node.js:_
  Before this project, I had only a surface level understanding of web security. I learned to implement secure password hashing using bcrypt, manage cookies safely with proper flags (e.g., httpOnly, secure, sameSite), and the importance of verifying email addresses before granting access to accounts.

- _Working With Third Party Tools:_
  I became familiar with integrating tools such as Mailtrap for email testing and Speakeasy for 2FA. I also learned how to read API documentation and troubleshoot third party libraries effectively, which is a key skill when working in real world environments.

- _Backend Debugging and Logging:_
  Through debugging authentication flows, I became more comfortable identifying and solving issues with asynchronous code using async/await, understanding stack traces, and improving server side logging for better error visibility.

- _Code Modularity and Reusability:_
  I improved my ability to write modular code by separating functions like generateTokenAndSetCookie, sendErrorResponse, and sendSuccessResponse. This not only made the code cleaner but also easier to reuse and test in other parts of the project.

- _Planning and Time Management:_
  Planning each step of the project before beginning helped me stay focused and meet deadlines. I learned how important it is to define scope early and not get overwhelmed by feature creep.

# What Could Be Done Differently In The Future

Reflecting on my development process, there are several things I would approach differently if I or someone else were to tackle a similar project in the future:

- _Input Validation with express-validator:_
  While the system works, I did not fully implement express-validator for sanitizing and validating user inputs. Using this tool would prevent invalid or malicious data from reaching the database or causing unexpected behavior. I now understand how critical validation is for both security and stability.

- _Upgrade Email Integration for Production:_
  While Mailtrap was ideal for development and testing, it is not intended for production use. If this were a live project, I would integrate SendGrid or Mailgun with proper domain verification to handle transactional emails securely and reliably.

- _Build a Frontend for Better UX:_
  Currently, the backend API handles the logic for 2FA and email verification, but the lack of a frontend makes it harder to test from a user’s perspective. In the future, I would build a React frontend or integrate with an existing client to offer better visibility into verification flows and user feedback.

- _Add More Unit and Integration Testing:_
  While I tested core functionalities manually, automated testing with tools like Jest would have improved code reliability and helped detect errors early. This is an area I’m looking to improve in future backend projects.

---

# Getting Started

This section will walk you through setting up the project on your local machine so you can develop, test, or contribute.

---

### Prerequisites

Before you begin, ensure you have the following tools installed on your computer:

| Tool                               | Description                                                 | Install Link                                                              |
| ---------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| **Node.js (v18+)**                 | JavaScript runtime that runs the backend code               | [nodejs.org](https://nodejs.org/en)                                       |
| **npm**                            | Node package manager (automatically installed with Node.js) | [npmjs.com](https://www.npmjs.com/)                                       |
| **Git**                            | Used to clone this repository                               | [git-scm.com](https://git-scm.com/)                                       |
| **MongoDB Atlas** (Optional)       | If you want your own MongoDB cluster                        | [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)                  |
| **Postman or Insomnia** (Optional) | Tools to test API endpoints                                 | [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) |

---

### Step 1: Clone the Repository

Use Git to download the code from GitHub:

```bash
git clone https://github.com/Evan-Codes88/Secure-Authentication.git
cd Secure-Authentication
```

## Step 2: Install Project Dependencies

Once you're inside the project folder, run the following command to install all required packages listed in the `package.json`:

```bash
npm install
```

This command installs essential libraries such as:

- Express – Web framework for Node.js
- Mongoose – MongoDB ODM (Object Document Mapper)
- JWT – For secure token-based authentication
- Dotenv – To load environment variables
- Speakeasy – For Two-Factor Authentication (TOTP)
- Mailtrap – For email testing in development
- Nodemon (dev dependency) – Automatically restarts your server on file changes

## Step 3: Create a `.env` File

Environment variables allow you to securely store sensitive configuration details separately from your codebase.

In the **root** of your project, create a new file named `.env`.

Add the following environment variables to it:

```env
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority&appName=your-app-name
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
MAILTRAP_TOKEN=your_mailtrap_token
```

## Step 4: Run the Project

### ▶️ Development Mode (with live reload)

To start the project in development mode using **Nodemon**, run the following command:

```bash
npm run dev
```

## 📚 Package Version Info

To maintain consistent behavior, here are some of the important packages and their expected versions:

| Package                                                    | Version (example) | Description               |
| ---------------------------------------------------------- | ----------------- | ------------------------- |
| [express](https://www.npmjs.com/package/express)           | ^4.18.2           | Web server framework      |
| [mongoose](https://www.npmjs.com/package/mongoose)         | ^7.0.3            | MongoDB interaction       |
| [dotenv](https://www.npmjs.com/package/dotenv)             | ^16.0.3           | Loads `.env` variables    |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | ^9.0.0            | JWT-based authentication  |
| [speakeasy](https://www.npmjs.com/package/speakeasy)       | ^2.0.0            | Two-Factor Authentication |
| [mailtrap](https://www.npmjs.com/package/mailtrap)         | ^3.4.0            | Email testing platform    |
| [nodemon](https://www.npmjs.com/package/nodemon)           | ^3.0.1 (dev)      | Auto server restart       |

---

### Check Installed Versions

To check the installed version of any package locally, use the following command:

```bash
npm ls <package-name>
```

For Example:

```bash
npm ls exxpress
```

# External Services & Documentation

Here are the services used in this project and their official documentation:

- 📬 [Mailtrap Documentation](https://mailtrap.io/docs) – For email testing
- 🔐 [Speakeasy Documentation](https://github.com/speakeasyjs/speakeasy) – For TOTP-based 2FA
- 🪪 [JWT Introduction](https://jwt.io/introduction/) – Learn how JWT works

# Tips for a Clean Project

- Always run `npm install` after cloning or pulling new updates
- Don’t commit your `.env` file
- Keep dependencies updated using:

```bash
npm outdated
```

# You're Ready!

Now that your app is running, you can begin testing endpoints or building additional features like signup/login routes, 2FA, or email verification.

If you run into issues, double-check:

- MongoDB URI is correct
- `.env` file is present
- Mailtrap token is valid

## References

> Association for Computing Machinery (ACM). (2018). ACM Code of Ethics and Professional Conduct. https://www.acm.org/code-of-ethics

> Australian Cyber Security Centre. (2024). Implement multi-factor authentication. Australian Government.
> https://www.cyber.gov.au/acsc/view-all-content/guidance-materials/implement-multi-factor-authentication

> BBC News. (2021, May 8). Colonial Pipeline: US fuel pipeline cyber-attack shuts system. BBC. https://www.bbc.com/news/world-us-canada-57027074

> European Commission. (n.d.). Article 5 - Principles relating to processing of personal data. General Data Protection Regulation (GDPR). https://gdpr-info.eu/art-5-gdpr/

> Gartner. (2022, October 25). Gartner identifies the top strategic technology trends for 2023. https://www.gartner.com/en/newsroom/press-releases/2022-10-25-gartner-identifies-top-strategic-technology-trends-for-2023

> JumpCloud. (2025, February). Passwordless authentication adoption trends in 2025. https://jumpcloud.com/blog/passwordless-authentication-adoption-trends

> OWASP Foundation. (2023). Authentication cheat sheet. OWASP.
> https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

> Turton, W. (2022, September 16). Uber investigates breach of its computer systems. Bloomberg. https://www.bloomberg.com/news/articles/2022-09-16/uber-investigates-breach-of-its-computer-systems

> Verizon. (2023). 2023 Data Breach Investigations Report. Verizon Enterprise.
> https://www.verizon.com/business/resources/reports/dbir/
