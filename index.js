require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Fail fast if a required secret is missing, rather than starting the
// server in an insecure state (e.g. signing JWTs with "undefined").
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined. Check your .env file.');
    process.exit(1);
}

// Middleware to parse incoming JSON requests
app.use(express.json());

// Api routing
app.use('/api/auth', authRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('HustleHub+ Secure Backend API is running');
});

// Catch requests to routes that don't exist
app.use(notFound);

// Centralised error-handling middleware. Must be registered last so it
// catches errors from every route/middleware above it.
app.use(errorHandler);

// Load the locally-generated self-signed SSL certificate (see
// ssl/generate-cert.sh) and serve the API over HTTPS.
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
};

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HustleHub+ API is running securely on https://localhost:${PORT}`);
});
