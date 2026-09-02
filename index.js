require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Fail fast rather than start with an insecure/undefined JWT secret
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined. Check your .env file.');
    process.exit(1);
}

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('HustleHub+ Secure Backend API is running');
});

app.use(notFound);
app.use(errorHandler);

// Local self-signed cert (see ssl/generate-cert.sh)
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem')),
};

https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HustleHub+ API is running securely on https://localhost:${PORT}`);
});
