const { body, validationResult } = require('express-validator');

const ALLOWED_ROLES = ['Client', 'Freelancer', 'Admin'];

/**
 * Runs after the express-validator rule chains below and turns any
 * failures into a single, consistent 400 response. Keeping this in one
 * place ensures every validation error looks the same to the client and
 * never echoes back raw internal error objects.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed.',
            details: errors.array().map(e => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};

const registerValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.')
        .escape(), // neutralises HTML/script characters to help prevent stored XSS
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('A valid email address is required.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .matches(/\d/).withMessage('Password must contain at least one number.')
        .matches(/[A-Za-z]/).withMessage('Password must contain at least one letter.'),
    body('role')
        .trim()
        .notEmpty().withMessage('Role is required.')
        .isIn(ALLOWED_ROLES).withMessage(`Role must be one of: ${ALLOWED_ROLES.join(', ')}.`),
    handleValidationErrors,
];

const loginValidationRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('A valid email address is required.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required.'),
    handleValidationErrors,
];

module.exports = { registerValidationRules, loginValidationRules };
