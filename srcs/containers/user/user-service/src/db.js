import mariadb from 'mariadb'

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'userpassword',
  database: process.env.DB_NAME || 'transcendance_db',
  connectionLimit: 10
})

async function connection(fct) {
  const conn = await pool.getConnection()
  try {
    return await fct(conn)
  } finally {
    conn.release()
  }
}

async function waitForDb(pool) {
  for (let i = 0; i < 10; i++) {
    try {
      const conn = await pool.getConnection()
      conn.release()
      return
    } catch {
      console.log('Waiting for DB...')
      await new Promise(r => setTimeout(r, 3000))
    }
  }
  throw new Error('DB not ready')
}

export default { connection, waitForDb }