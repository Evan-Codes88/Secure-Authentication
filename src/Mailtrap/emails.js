/**
 * @function sendVerificationEmail
 * @description Sends a verification email to the user with a verification token.
 * @param {string} email - The email address of the recipient.
 * @param {string} verificationToken - The verification code to be sent to the user.
 * @returns {Promise<void>} - Resolves once the email is successfully sent.
 */
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];
  
    const response = await mailtrapClient.send({
        from: sender,
        to: recipient,
        subject: "Verify your email",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        category: "Email Verification",
    });
  
    console.log("Email Sent Successfully", response);
};

/**
 * @function sendWelcomeEmail
 * @description Sends a welcome email to the user after registration, including their full name in the email template.
 * @param {string} email - The email address of the recipient.
 * @param {string} fullName - The full name of the recipient to be inserted into the template.
 * @returns {Promise<void>} - Resolves once the email is successfully sent or an error is caught.
 */
export const sendWelcomeEmail = async (email, fullName) => {
    const recipient = [{ email }];
  
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "da5593df-dcd2-4dba-8221-c83981cc2a93",
            template_variables: {
                fullName: fullName,
            },
        });
  
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        return sendErrorResponse(response, 404, "Error sending welcome email");
    }
};
