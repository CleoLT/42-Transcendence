import  connection  from '../db.js'
import bcrypt from 'bcrypt'

async function getAllUsers() {
    return connection(conn => conn.query('SELECT * FROM users'))
}

async function addUser(username, password, email) {

    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    return connection(conn => conn.query(
        `INSERT INTO users (username, email, password) 
        VALUES (?, ?, ?)`,
        [username, email, hashedPassword]
    ))
}

async function getUserById(id) {
    const rows = await connection(conn => conn.query(
            `SELECT * FROM users WHERE id = ?
            LIMIT 1`,
            [id]
        ))
    return rows[0] || null
        //cuidado que esto devuelve el password !!!
}

async function getUserByName(username) {
    const rows = await connection(conn => conn.query(
            `SELECT * FROM users WHERE username = ?
            LIMIT 1`,
            [username]
        ))
    return rows[0] || null
}

async function getUserByEmail(email) {
    const rows = await connection(conn => conn.query(
            `SELECT * FROM users WHERE email = ?
            LIMIT 1`,
            [email]
        ))
    return rows[0] || null
}

async function tryLogin(username, password) {
    
    const rows = await connection(conn =>
        conn.query('SELECT * FROM users WHERE username = ?', [username])
    );

    const user = rows[0];
    if (!user) return false;

    const match = await bcrypt.compare(password, user.password);
    return match;
}

async function updateUserById(id, modifiedData) {
    const keys = Object.keys(modifiedData)
    console.log(keys)
    const setStmt = keys.map(key => `${key} = ?`).join(", ")
    
    const values = keys.map(key => modifiedData[key])
    const params = [...values, id]
    
    const rows = await connection(conn => conn.query(
        `UPDATE users
        SET ${setStmt}
        WHERE id = ?`, 
        params
    ))
}

async function deleteUserById(userId) {
    await connection(conn => conn.query(
            `DELETE FROM users WHERE id = ?
            LIMIT 1`,
            [userId]
        ))
}

function uploadAvatar(userId, filepath) {
    const stmt = db.prepare('UPDATE users SET avatar = ? WHERE id = ?')
    stmt.run(filepath, userId)

    return getUserById(userId)
    
}

export default { 
    getAllUsers, 
    addUser, 
    getUserById,
    getUserByName,
    getUserByEmail,
    tryLogin,
    updateUserById,
    deleteUserById,
    uploadAvatar 
}
