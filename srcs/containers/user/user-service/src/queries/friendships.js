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

async function createFriendship(id1, id2, revert) {

    if (revert)
        return connection(conn => conn.query(
            `INSERT INTO friendships (user1_id, user2_id, user2_accept) 
            VALUES (?, ?, ?)`,
            [id2, id1, 1]
        ))
    else
        return connection(conn => conn.query(
            `INSERT INTO friendships (user1_id, user2_id, user1_accept) 
            VALUES (?, ?, ?)`,
            [id1, id2, 1]
        ))
}

async function checkIfFrienshipExists(id1, id2) {
  return connection(conn => conn.query(`
    SELECT * FROM friendships 
    WHERE user1_id = ? AND user2_id = ?
    LIMIT 1`,
    [id1, id2]
  ))
}

async function acceptPendingFriendship(id1, id2, revert) {
  let rows
  if (revert) {
    rows = connection(conn => conn.query(`
    UPDATE friendships 
    SET user2_accept = true 
    WHERE user1_id = ? AND user2_id = ?
    LIMIT 1`,
    [id1, id2]
  ))
  } else {
    rows = connection(conn => conn.query(`
    UPDATE friendships 
    SET user1_accept = true 
    WHERE user1_id = ? AND user2_id = ?
    LIMIT 1`,
    [id1, id2]
  ))
  }
  return rows
}


export default {
    getAllFriendships,
    createFriendship, 
    checkIfFrienshipExists,
    acceptPendingFriendship
}