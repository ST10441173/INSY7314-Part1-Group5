const { users, User } = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.status(409).json({ error: 'User already exists with this email.' });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = new User(users.length + 1, name, email, hashedPassword, role);
        users.push(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);

        // Same generic error for "no user" and "wrong password" to avoid
        // leaking which emails are registered.
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

// GET /api/auth/me - protected, requires a valid JWT (see authMiddleware)
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
