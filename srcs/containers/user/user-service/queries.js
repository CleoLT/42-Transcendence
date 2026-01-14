import pool from './db.js'

async function connection(fct) {
  const conn = await pool.getConnection()
  try {
    return await fct(conn)
  } finally {
    conn.release()
  }
}

async function getAllUsers() {
    return connection(conn => conn.query('SELECT * FROM users'))
}

async function addUser(username, password, email) {
    return connection(conn => conn.query(
        `INSERT INTO users (username, email, password) 
        VALUES (?, ?, ?)`,
        [username, email, password]
    ))
}

async function getUserById(id) {
    const rows = await connection(conn => conn.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        ))
    return rows[0]
}

async function updateUserById(id, modifiedData) {

    const keys = Object.keys(modifiedData)
    console.log(keys)
    const setStmt = keys.map(key => `${key} = ?`).join(", ")
    const values = keys.map(key => modifiedData[key])
    
    const rows = connection(conn => conn.query(
        `UPDATE users
        SET ${setStmt}
        WHERE id = ?`, 
        values, 
        [id]
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
/*async function getAllUsers() {
    //return db.prepare('SELECT * FROM users').all();
    const conn = await pool.getConnection()
    try {
        const rows = await conn.query('SELECT * FROM users')
        return rows
    } finally {
        conn.release()
    }
}

async function addUser(username, password, email) {
    const conn = await pool.getConnection()
     try {
        const rows = await conn.query(
            `INSERT INTO users (username, email, password) 
            VALUES (?, ?, ?)`,
            [username, email, password]
        )
        return rows
    } finally {
        conn.release()
    }
}

async function getUserById(id) {
    const conn = await pool.getConnection()
     try {
        const rows = await conn.query(
            'SELECT * FROM users WHERE id = ?',
            [id]
        )
        return rows[0]
    } finally {
        conn.release()
    }
}*/


export default { 
    getAllUsers, 
    addUser, 
    getUserById,
    updateUserById,
    deleteUserById,
    uploadAvatar 
}
