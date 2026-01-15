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

async function addFriendship(id1, id2) {

    if (id1 > id2) 
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

export default {
    getAllFriendships,
    addFriendship
}