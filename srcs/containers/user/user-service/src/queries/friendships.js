import pool from '../db.js'

async function connection(fct) {
  const conn = await pool.getConnection()
  try {
    return await fct(conn)
  } finally {
    conn.release()
  }
}

async function getAllFriendships() {
    return connection(conn => conn.query('SELECT * FROM friendships'))
}

async function getFriendshipById(id1, id2) {
   const rows = await connection(conn => conn.query(`
            SELECT * FROM friendships
            WHERE user1_id = ? AND user2_id = ?
            LIMIT 1`,
            [id1, id2]
        ))
    return rows[0] || null
}

async function createFriendship(id1, id2, revert) {
    return connection(conn => conn.query(
         `INSERT INTO friendships (
            user1_id, 
            user2_id, 
            ${revert ? "user2_accept" : "user1_accept"}
          ) 
          VALUES (?, ?, ?)`,
          [id1, id2, 1]
    ))
}

async function acceptPendingFriendship(id1, id2, revert) {
    return connection(conn => conn.query(`
      UPDATE friendships 
      SET ${revert ? "user2_accept" : "user1_accept"} = true 
      WHERE user1_id = ? AND user2_id = ?
      LIMIT 1`,
      [id1, id2]
    ))
}


export default {
    getAllFriendships,
    getFriendshipById,
    createFriendship, 
    acceptPendingFriendship
}