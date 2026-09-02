/**
 * Catches 404s for any route that wasn't matched above it.
 * Must be registered AFTER all real routes, BEFORE errorHandler.
 */
const notFound = (req, res, next) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

/**
 * Centralised error-handling middleware. Express recognises this as an
 * error handler because it takes four arguments (err, req, res, next).
 * Must be registered LAST, after every route and other middleware.
 *
 * Security rationale: no matter what throws (a bug, a bad DB call, an
 * unexpected exception), the client only ever sees a generic, safe
 * message and an appropriate status code - never a stack trace, file
 * path, environment variable, or other internal detail. Full details
 * are logged server-side only, where the dev team can see them.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    // Log the full error server-side for debugging (never sent to the client)
    console.error(`[ERROR] ${req.method} ${req.originalUrl} -`, err.stack || err.message);

    const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

    res.status(statusCode).json({
        error: statusCode === 500 ? 'An unexpected server error occurred.' : err.message,
    });
};

module.exports = { notFound, errorHandler };
