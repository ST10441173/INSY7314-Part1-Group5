const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
    res.send('HustleHub+ Secure Backend API is running');
});

// Server initialization
app.listen(PORT, () => {
    console.log(`Server is actively running on port ${PORT}`);
});