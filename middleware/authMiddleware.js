const jwt = require('jsonwebtoken');

/**
 * Protects a route by requiring a valid JWT in the Authorization header.
 * Expected header format: "Authorization: Bearer <token>"
 *
 * Rejects (401) requests with:
 *  - no Authorization header
 *  - a header that isn't a Bearer token
 *  - a token that fails signature verification
 *  - a token that has expired
 *
 * On success, attaches the decoded payload to req.user for use in
 * downstream route handlers (e.g. req.user.id, req.user.role).
 */
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (error) {
        // Covers both invalid signatures and expired tokens (TokenExpiredError)
        // without leaking any internal error detail to the client.
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

/**
 * Restricts a route to specific roles. Must be used AFTER `protect`,
 * since it relies on req.user being set.
 * Usage: router.delete('/gigs/:id', protect, authorize('Freelancer', 'Admin'), ...)
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'You do not have permission to perform this action.' });
        }
        next();
    };
};

module.exports = { protect, authorize };
