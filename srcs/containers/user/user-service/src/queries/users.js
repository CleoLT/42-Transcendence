import pool from '../db.js'
import bcrypt from 'bcrypt'

async function connection(fct) {
  const conn = await pool.getConnection()
  try {
    return await fct(conn)
  } finally {
    conn.release()
  }
}

async function userExists(userId) {
  const rows = await connection(conn => conn.query(
    "SELECT 1 FROM users WHERE id = ? LIMIT 1",
    [userId]
  ));
  return rows[0] || null;
}


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
            'SELECT * FROM users WHERE id = ?',
            [id]
        ))
    return rows[0]
}

async function getUserByName(username) {
    const rows = await connection(conn => conn.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        ))
    return rows[0]
}

async function getCredentialsCoincidence(username, password) {
    
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
    
    const rows = connection(conn => conn.query(
        `UPDATE users
        SET ${setStmt}
        WHERE id = ?`, 
        params
    ))

    //stmt.run(values, userId)
    return getUserById(id)
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

export default { 
    userExists,
    getAllUsers, 
    addUser, 
    getUserById,
    getUserByName,
    getCredentialsCoincidence,
    updateUserById,
    deleteUserById,
    uploadAvatar 
}
