const express = require('express');
const app = express();
const PORT = 3000;

// import routes
const authRoutes = require('./routes/authRoutes');

// Middleware to parse incoming JSON requests
app.use(express.json());

// Api routing
app.use('/api/auth', authRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('HustleHub+ Secure Backend API is running');
});

// Humza your centralized error-handling middleware right here

// Humza Modify the initialization below to configure HTTPS using your local SSL certification

// Server initialization
app.listen(PORT, () => {
    console.log(`Server is actively running on port ${PORT}`);
});