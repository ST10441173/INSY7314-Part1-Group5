// Catches unmatched routes. Must sit after all real routes.
const notFound = (req, res, next) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Centralised error handler - must be registered last. Never leaks
// stack traces, file paths, or config to the client; full detail is
// logged server-side only.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} -`, err.stack || err.message);

    const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

    res.status(statusCode).json({
        error: statusCode === 500 ? 'An unexpected server error occurred.' : err.message,
    });
};

module.exports = { notFound, errorHandler };
