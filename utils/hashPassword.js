const bcrypt = require('bcrypt');

// Number of salt rounds for bcrypt. 12 is a strong, widely-recommended
// default for 2026-era hardware - high enough to resist brute-force
// attacks, low enough to keep login/registration responsive.
const SALT_ROUNDS = 12;

/**
 * Hashes a plain-text password using bcrypt.
 * bcrypt automatically generates and stores a unique salt inside the
 * resulting hash, so we never need to manage salts separately.
 * @param {string} plainPassword
 * @returns {Promise<string>} the bcrypt hash
 */
const hashPassword = async (plainPassword) => {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compares a plain-text password against a stored bcrypt hash.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>} true if the password matches
 */
const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
