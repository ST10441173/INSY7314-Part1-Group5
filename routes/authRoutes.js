const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authControllers');
const { protect } = require('../middleware/authMiddleware');
const { registerValidationRules, loginValidationRules } = require('../middleware/validateMiddleware');

// Register a new account. Input is validated/sanitised first.
router.post('/register', registerValidationRules, registerUser);

// Log in with email + password, receive a JWT.
// Note: rate limiting on this endpoint is a Part 2 requirement, added
// once express-rate-limit is introduced alongside the rest of the API.
router.post('/login', loginValidationRules, loginUser);

// Example protected route - requires a valid JWT (see authMiddleware.protect).
router.get('/me', protect, getMe);

module.exports = router;
