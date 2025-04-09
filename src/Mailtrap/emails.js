import { mailtrapClient, sender } from "../Mailtrap/MailtrapConfig.js";
import { sendErrorResponse } from "../Utils/utils.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

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