const bcrypt = require('bcrypt');

// 12 salt rounds: strong enough to resist brute-forcing, fast enough to stay responsive.
const SALT_ROUNDS = 12;

const hashPassword = async (plainPassword) => {
    return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

const comparePassword = async (plainPassword, hashedPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
