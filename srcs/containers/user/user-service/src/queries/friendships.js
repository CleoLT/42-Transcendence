//import pool from '../db.js'
import  db  from '../db.js'

/*async function db.connection(fct) {
  const conn = await pool.getdb.Connection()
  try {
    return await fct(conn)
  } finally {
    conn.release()
  }
}*/

async function getAllFriendships() {
    return db.connection(conn => conn.query('SELECT * FROM friendships'))
}

async function getFriendshipById(id1, id2) {
   const rows = await db.connection(conn => conn.query(`
            SELECT * FROM friendships
            WHERE user1_id = ? AND user2_id = ?
            LIMIT 1`,
            [id1, id2]
        ))
    return rows[0] || null
}

async function getFriendsByUserId(id) {
    return db.connection(conn => conn.query(
            `SELECT * FROM friendships 
            WHERE (user1_id = ? OR user2_id = ?)
            AND user1_accept = true 
            AND user2_accept = true`,
            [id, id]
        ))
}

async function getPendingFriendships(id) {
    return db.connection(conn => conn.query(
            `SELECT * FROM friendships 
            WHERE (user1_id = ? 
                AND user1_accept = true 
                AND user2_accept = false)
            OR (user2_id = ? 
                AND user1_accept = false 
                AND user2_accept = true)`,
            [id, id]
        ))
}

async function getReceivedFriendRequests(id) {
    return db.connection(conn => conn.query(
            `SELECT * FROM friendships 
            WHERE (user1_id = ? 
                AND user1_accept = false 
                AND user2_accept = true)
            OR (user2_id = ? 
                AND user1_accept = true 
                AND user2_accept = false)`,
            [id, id]
        ))
}

async function createFriendship(id1, id2, revert) {
    return db.connection(conn => conn.query(
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
    return db.connection(conn => conn.query(`
      UPDATE friendships 
      SET ${revert ? "user2_accept" : "user1_accept"} = true 
      WHERE user1_id = ? AND user2_id = ?
      LIMIT 1`,
      [id1, id2]
    ))
}

async function checkIfAreFriends(id1, id2) {
  const rows = await db.connection(conn => conn.query(`
      SELECT * FROM friendships
      WHERE user1_id = ? AND user2_id = ? AND user1_accept = true AND user2_accept = true
      LIMIT 1`,
      [id1, id2]
  ))
  return rows[0] || null
}

async function authorizeToPlay(id1, id2, revert) {

    return db.connection(conn => conn.query(`
      UPDATE friendships 
      SET ${revert ? "user2_authorization" : "user1_authorization"} = true 
      WHERE user1_id = ? AND user2_id = ? AND user1_accept = true AND user2_accept = true
      LIMIT 1`,
      [id1, id2]
    ))
}

async function cancelFriendship(id1, id2, revert) {
// SET ${revert ? "user2_accept" : "user1_accept"} = false,
    return db.connection(conn => conn.query(`
      UPDATE friendships 
      SET user1_accept = false,
        user2_accept = false,
        user1_authorization = false,
        user2_authorization = false
      WHERE user1_id = ? AND user2_id = ?
      LIMIT 1`,
      [id1, id2]
    ))
}

async function cancelAuthorization(id1, id2, revert) {

    return db.connection(conn => conn.query(`
      UPDATE friendships 
      SET ${revert ? "user2_authorization" : "user1_authorization"} = false 
      WHERE user1_id = ? 
        AND user2_id = ? 
        AND user1_accept = true 
        AND user2_accept = true
      LIMIT 1`,
      [id1, id2]
    ))
}

export default {
    getAllFriendships,
    getFriendshipById,
    getFriendsByUserId,
    getPendingFriendships,
    getReceivedFriendRequests,
    createFriendship, 
    acceptPendingFriendship,
    checkIfAreFriends,
    authorizeToPlay,
    cancelFriendship,
    cancelAuthorization
}