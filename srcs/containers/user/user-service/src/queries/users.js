import db  from '../db.js'
import bcrypt from 'bcryptjs'

async function getAllUsers() {
    return db.connection(conn => conn.query('SELECT * FROM users'))
}

async function addUser(username, password, email) {

    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    return db.connection(conn => conn.query(
        `INSERT INTO users (username, email, password, avatar, bio) 
        VALUES (?, ?, ?, ?, ?)`,
        [username, email, hashedPassword, "/avatars/cat.jpg", "Some words about you.. Are you a flower addict?... Are you a cat or a dog person ? Do you hate MAGA as such as the team? 4 x space or tab user? Are you in Epstein files ? Do you personally know anyone mentioned in it? Are you an A.C.A.B person? ... ..."]
    ))
}

async function getUserById(id) {
    const rows = await db.connection(conn => conn.query(
            `SELECT * FROM users WHERE id = ?
            LIMIT 1`,
            [id]
        ))
    return rows[0] || null
        //cuidado que esto devuelve el password !!!
}

async function getUserByName(username) {
    const rows = await db.connection(conn => conn.query(
            `SELECT * FROM users WHERE username = ?
            LIMIT 1`,
            [username]
        ))
    return rows[0] || null
}

async function getUserByEmail(email) {
    const rows = await db.connection(conn => conn.query(
            `SELECT * FROM users WHERE email = ?
            LIMIT 1`,
            [email]
        ))
    return rows[0] || null
}

async function getAvatarByUserId(id) {
    const rows = await db.connection(conn => conn.query(
            `SELECT avatar FROM users WHERE id = ?
            LIMIT 1`,
            [id]
        ))
    return rows[0] || null
}

async function tryLogin(username, password) {
    
    const rows = await db.connection(conn =>
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
    
    const rows = await db.connection(conn => conn.query(
        `UPDATE users
        SET ${setStmt}
        WHERE id = ?`, 
        params
    ))
}

async function deleteUserById(userId) {
    await db.connection(conn => conn.query(
            `DELETE FROM users WHERE id = ?
            LIMIT 1`,
            [userId]
        ))
}

async function uploadAvatar(userId, filepath) {
    const rows = await db.connection(conn => conn.query(
        `UPDATE users
        SET avatar = ?
        WHERE id = ?`, 
        [filepath, userId]
    ))
}

async function deleteAvatar(userId) {
    await db.connection(conn => conn.query(
        `UPDATE users
        SET avatar = NULL
        WHERE id = ?
        LIMIT 1`,
        [userId]
        ))
}

export default { 
    getAllUsers, 
    addUser, 
    getUserById,
    getUserByName,
    getUserByEmail,
    getAvatarByUserId,
    tryLogin,
    updateUserById,
    deleteUserById,
    uploadAvatar,
    deleteAvatar
}
