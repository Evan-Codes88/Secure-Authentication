/**
 * Utility function to send error responses consistently
 * 
 * @param {object} response - Express response object
 * @param {number} status - HTTP status code (e.g., 400, 401, 500)
 * @param {string} message - Error message to return to the client
 */
export const sendErrorResponse = (response, status, message) =>
    response.status(status).json({ message });


/**
 * Utility function to send success responses consistently
 * 
 * @param {object} response - Express response object
 * @param {number} status - HTTP status code (e.g., 200, 201)
 * @param {string} message - Success message to return to the client
 * @param {object} [data={}] - Optional additional data to include in the response (default is an empty object)
 */
export const sendSuccessResponse = (response, status, message, data = {}) =>
    response.status(status).json({ message, ...data });
