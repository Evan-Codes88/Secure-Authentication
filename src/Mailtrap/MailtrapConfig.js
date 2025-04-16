/**
 * @file Sets up the Mailtrap client for sending emails using the Mailtrap API.
 * Loads configuration from environment variables.
 */

import { MailtrapClient } from 'mailtrap';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * @constant TOKEN
 * @type {string}
 * @description Mailtrap API token loaded from environment variables
 */
const TOKEN = process.env.MAILTRAP_TOKEN;

/**
 * @constant mailtrapClient
 * @type {MailtrapClient}
 * @description Initialized Mailtrap client instance for sending emails
 */
export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

/**
 * @constant sender
 * @type {{ email: string, name: string }}
 * @description Default sender information used in outgoing emails
 */
export const sender = {
  email: "hello@demomailtrap.co",
  name: "Evan Meehan",
};
