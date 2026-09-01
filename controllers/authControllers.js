const { users, User } = require('../models/userModel');
// Muhammad: Import your password hashing utility here once youve created it 

/**
 * Controller to handle the creation of new user accounts.
 * Expects name, email, password, and role in the request body.
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Humza: This is aTemporary manual check. You will replace this with your robust validation middleware
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Query the mock "database" (array) to see if the submitted email is already registered
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.status(409).json({ error: 'User already exists with this email.' }); // 409 Conflict
        }

        // Muhammad: Temporary Placeholder u should hash the password here before saving.
        
        const hashedPassword = password; // REPLACE this line when the hashing is implemented

        // Instantiate a new user object. Simulates an auto-incrementing ID by adding 1 to the array's current length
        const newUser = new User(
            users.length + 1, 
            name,
            email,
            hashedPassword,
            role
        );
        users.push(newUser);

        // Sends a success response. We intentionally omit the password in the returned user object for security.
        res.status(201).json({ // 201 Created
            message: 'User registered successfully',
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });

    } catch (error) {
        // Humza: the centralized error handler will eventually catch these server errors i hope

        // Catch unexpected issues (like a failing database connection) to prevent the whole app from crashing
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// Muhammad: Create your loginUser controller here and export it below

module.exports = { registerUser };