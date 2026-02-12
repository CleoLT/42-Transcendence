import mariadb from 'mariadb'
import fs from 'fs'

/*const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'userpassword',
  database: process.env.DB_NAME || 'transcendance_db',
  connectionLimit: 10
})*/

function readSecret(path) {
  return fs.readFileSync(path, 'utf8').trim()
}

const pool = mariadb.createPool({
  host: readSecret(process.env.DB_HOST_FILE),
  port: 3306,
  user: readSecret(process.env.DB_USER_FILE),
  password: readSecret(process.env.DB_PASSWORD_FILE),
  database: readSecret(process.env.DB_NAME_FILE),
  connectTimeout: 5000
})


async function connection(fct) {
  const conn = await pool.getConnection()
  try {
    return await fct(conn)
  } finally {
    conn.release()
  }
}

export default { connection, readSecret}