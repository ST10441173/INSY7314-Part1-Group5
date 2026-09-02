const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authControllers');
const { protect } = require('../middleware/authMiddleware');
const { registerValidationRules, loginValidationRules } = require('../middleware/validateMiddleware');

router.post('/register', registerValidationRules, registerUser);
router.post('/login', loginValidationRules, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
