import db  from '../db.js'
import bcrypt from 'bcrypt'
import schema from '../schemas/users.js'

async function getAllUsers() {
    return db.connection(conn => conn.query('SELECT * FROM users'))
}

async function addUser(username, password, email) {

    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
    const randomAvatar = schema.avatarImages[Math.floor(Math.random() * schema.avatarImages.length)]
    const bio = "Some words about you... \nAre you a flower addict?... \nAre you a cat or a dog person ? Do you hate MAGA as such as the team? \n4 x space or tab user? Are you in Epstein files ? \nDo you personally know anyone mentioned in it? \nAre you an A.C.A.B person? \n... \n..."

    return db.connection(conn => conn.query(
        `INSERT INTO users (username, email, password, avatar, bio) 
        VALUES (?, ?, ?, ?, ?)`,
        [username, email, hashedPassword, randomAvatar, bio]
    ))
}

async function getUserById(id) {
    const rows = await db.connection(conn => conn.query(
            `SELECT * FROM users WHERE id = ?
            LIMIT 1`,
            [id]
        ))
    return rows[0] || null
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
    //if modified password hash the password
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
