const { users, User } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

/**
 * POST /api/auth/register
 * Creates a new user account. Input is already validated and sanitised
 * by registerValidationRules before this controller runs.
 */
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Query the mock "database" (in-memory array) to see if the
        // submitted email is already registered.
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.status(409).json({ error: 'User already exists with this email.' }); // 409 Conflict
        }

        // Never store plain-text passwords. bcrypt generates a unique
        // salt per password and folds it into the resulting hash.
        const hashedPassword = await hashPassword(password);

        // Instantiate a new user object. Simulates an auto-incrementing ID
        // by adding 1 to the array's current length.
        const newUser = new User(
            users.length + 1,
            name,
            email,
            hashedPassword,
            role
        );
        users.push(newUser);

        // Success response. The password hash is intentionally omitted
        // from the returned user object.
        res.status(201).json({ // 201 Created
            message: 'User registered successfully',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });

    } catch (error) {
        // Hand off to the centralised error handler instead of leaking
        // details here. Keeps every error response consistent.
        next(error);
    }
};

/**
 * POST /api/auth/login
 * Verifies credentials and issues a JWT on success.
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = users.find(u => u.email === email);

        // Deliberately use the same generic error message and status
        // code whether the email doesn't exist or the password is
        // wrong. This prevents attackers from using the login endpoint
        // to enumerate which emails are registered.
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const passwordMatches = await comparePassword(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });

    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/auth/me
 * Protected route - only reachable with a valid JWT (see authMiddleware).
 * Demonstrates that req.user was correctly populated by the middleware.
 */
const getMe = (req, res) => {
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
};

module.exports = { registerUser, loginUser, getMe };
