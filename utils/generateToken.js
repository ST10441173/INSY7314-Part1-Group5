const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for an authenticated user.
 * The payload deliberately contains only non-sensitive identifiers
 * (id, role) - never the password hash or other sensitive fields.
 * @param {{id: number|string, role: string}} user
 * @returns {string} signed JWT
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
};

module.exports = generateToken;
