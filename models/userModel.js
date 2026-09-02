// In-memory store for Part 1 - replaced with MongoDB in Part 2.
const users = [];

class User {
    constructor(id, name, email, password, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password; // always a bcrypt hash, never plain-text
        this.role = role; // 'Client', 'Freelancer', or 'Admin'
    }
}

module.exports = { users, User };
