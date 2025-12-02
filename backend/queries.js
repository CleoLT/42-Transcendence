const db = require('./db')

function getAllUsers() {
    return db.prepare('SELECT * FROM users').all();
}

function addUser(username, password, email) {
    const insert = db.prepare(`
        INSERT INTO users (username, password, email, created_at)
        VALUES (?, ?, ?, datetime(\'now\'))
    `);

    return insert.run(username, password, email)
}

function getUserById(userId) {
    const statment = db.prepare('SELECT * FROM users WHERE id = ?')
    return statment.get(userId)
}

module.exports = { getAllUsers, addUser, getUserById }
