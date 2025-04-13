# Ethical Auth: Building Trust Through Secure Web Authentication

## Introduction

Security is becoming a crucial necessity in the ever changing digital world of today, not an optional feature. The frequency of data breaches and account takeovers is rising, particularly in applications that manage private user data.

According to IBM's _Cost of a Data Breach Report 2023_, the average cost of a data breach in 2023 was _$4.45 million_, a _15% increase over three years_.

In response to this growing concern, I created a safe authentication system that is modular and simple to incorporate into other web application projects, allowing developers to use email verification, JWT, and TOTP-based Two-Factor Authentication (2FA) to achieve robust authentication.

This blog post walks through the _ethical and technical issues_ tackled in this project, provides _implementation details and justifications_, and _reflects on lessons learned during development_. It also explores _current and emerging industry trends in web security_, such as the rising adoption of multi-factor authentication (MFA) and the shift toward zero-trust architecture. Additionally, it includes _full setup instructions_ and _real-world case studies_, offering developers an opportunity to implement a scalable, modern, and secure authentication system in their own projects.

## Table of Contents

- [Industry Trends and Opportunities](#industry-trends-and-opportunities)
- [Ethical and Technical Considerations](#ethical-and-technical-considerations)
- [Insecure User Authentication and Its Solution](#insecure-user-authentication-and-its-solution)
- [Project Overview](#project-overview)
- [Implementation Details](#implementation-details)
  - [JWT Authentication](#jwt-authentication)
  - [Two-Factor Authentication (2FA) with TOTP](#two-factor-authentication-2fa-with-totp)
  - [Email Verification](#email-verification)
- [Setup Instructions](#setup-instructions)
- [Case Studies](#case-studies)
- [Lessons Learned](#lessons-learned)
- [Conclusion](#conclusion)
- [References](#references)

## Industry Trends and Opportunities

Strong and intuitive authentication techniques are more important than ever as the tech sector develops. Authentication is becoming a crucial component of the user experience and application design due to the rise in cybersecurity concerns and changing user expectations. The future of authentication is being shaped by two significant and extremely pertinent trends:

# Passwordless Authentication Is Going Mainstream

One of the biggest changes in authentication today is the move away from traditional passwords in favor of more secure and user-friendly methods. Passwordless authentication options, such as biometric recognition (fingerprints or facial scans), magic links sent through email, security keys like YubiKey, and device-based authentication using protocols like FIDO2, are becoming increasingly popular.

This shift is driven by the fact that passwords have long been a weak point in security. They're often reused, easy to guess, and vulnerable to phishing attacks. On top of that, many users find passwords frustrating to manage, leading to a poor user experience.

According to Gartner, “By 2025, more than 50% of the workforce and more than 20% of customer authentication transactions will be passwordless,” marking a dramatic shift in how we secure user accounts (Gartner, 2022).

Industry leaders like Microsoft, Google, and Apple are already rolling out passwordless login solutions across their platforms, using passkeys and biometric hardware as default options.

Also according to Verizon’s Data Breach Investigations Report, 68% of data breaches involved human error, highlighting the vulnerabilities associated with traditional password systems JumpCloud (2025).

> Opportunity: For developers, this presents an exciting opportunity to implement WebAuthn, OAuth with magic links, or biometric support using third-party authentication services. This not only improves security but also reduces friction during login, boosting user retention.

In my project, I’ve set up a standard login system using usernames and passwords, but I’ve made sure it follows modern security best practices. Passwords are hashed, sessions are managed using JWTs, and I’ve made two-factor authentication (2FA) mandatory to add an extra layer of security. I’ve also added email verification during sign-up to help confirm user identities.

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

> According to the GDPR (Art. 5), personal data must be “processed in a manner that ensures appropriate security,” including protection against unauthorized access and accidental loss. Failing to meet this standard is not just illegal—it’s unethical. European Commission, General Data Protection Regulation (GDPR).

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

## References

> Association for Computing Machinery (ACM). (2018). ACM Code of Ethics and Professional Conduct. https://www.acm.org/code-of-ethics

> BBC News. (2021, May 8). Colonial Pipeline: US fuel pipeline cyber-attack shuts system. BBC. https://www.bbc.com/news/world-us-canada-57027074

> European Commission. (n.d.). Article 5 - Principles relating to processing of personal data. General Data Protection Regulation (GDPR). https://gdpr-info.eu/art-5-gdpr/

> Gartner. (2022, October 25). Gartner identifies the top strategic technology trends for 2023. https://www.gartner.com/en/newsroom/press-releases/2022-10-25-gartner-identifies-top-strategic-technology-trends-for-2023

> JumpCloud. (2025, February). Passwordless authentication adoption trends in 2025. https://jumpcloud.com/blog/passwordless-authentication-adoption-trends

> Turton, W. (2022, September 16). Uber investigates breach of its computer systems. Bloomberg. https://www.bloomberg.com/news/articles/2022-09-16/uber-investigates-breach-of-its-computer-systems
