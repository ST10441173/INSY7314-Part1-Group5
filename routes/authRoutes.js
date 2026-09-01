const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/authController');

// Humza: Add your validation middleware directly into this route later

router.post('/register', registerUser);

// Muhammad: Add your login route below


// Muhammad: Add your protected route below 


module.exports = router;