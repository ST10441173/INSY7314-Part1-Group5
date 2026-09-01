// In-memory array to store user records for Part 1
const users = [];

// User structure definition
class User {
    constructor(id, name, email, password, role) {
        this.id = id;             // Unique User ID
        this.name = name;         // Full Name
        this.email = email;       // Email Address
        this.password = password; // Hashed Password (never plain-text)
        this.role = role;         // 'Client', 'Freelancer', or 'Admin'
    }
}

module.exports = { users, User };