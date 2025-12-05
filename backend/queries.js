const db = require('./db')

function getAllUsers() {
    return db.prepare('SELECT * FROM users').all();
}

function addUser(username, password, email) {
    const stmt = db.prepare(`
        INSERT INTO users (username, password, email, created_at)
        VALUES (?, ?, ?, datetime(\'now\'))
    `);

    return stmt.run(username, password, email)
}

function getUserById(userId) {
    const statment = db.prepare('SELECT * FROM users WHERE id = ?')
    return statment.get(userId)
}

function updateUserById(userId, modifiedData) {
    
    const keys = Object.keys(modifiedData)
    console.log(keys)
    const setStmt = keys.map(key => `${key} = ?`).join(", ")
    const values = keys.map(key => modifiedData[key])
    
    const stmt = db.prepare(`
        UPDATE users
        SET ${setStmt}
        WHERE id = ? 
    `);
    stmt.run(values, userId)

    return getUserById(userId)
}

function deleteUserById(userId) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?')
    stmt.run(userId)
}

function uploadAvatar(userId, filepath) {
    const stmt = db.prepare('UPDATE users SET avatar = ? WHERE id = ?')
    stmt.run(filepath, userId)

    return getUserById(userId)
    
}

module.exports = { 
    getAllUsers, 
    addUser, 
    getUserById,
    updateUserById,
    deleteUserById,
    uploadAvatar 
}
