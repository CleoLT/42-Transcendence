import mariadb from 'mariadb'

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'userpassword',
  database: process.env.DB_NAME || 'transcendance_db',
  connectionLimit: 5
})

async function connection(fct) {
  const conn = await pool.getConnection()
  try {
    return await fct(conn)
  } finally {
    conn.release()
  }
}
/*
async function waitForDb(retries = 10, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await pool.getConnection()
      await conn.release()
      console.log('✅ DB ready')
      return
    } catch {
      console.log('⏳ Waiting for DB...')
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('DB not ready after retries')
}
*/
export default connection
