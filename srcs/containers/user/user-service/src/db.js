//import mariadb from 'mariadb'
import fs from 'fs'
import * as mariadb from 'mariadb'

function readSecret(path) {
  return fs.readFileSync(path, 'utf8').trim()
}

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: readSecret(process.env.DB_USER_FILE),
  password: readSecret(process.env.DB_PASSWORD_FILE),
  database: readSecret(process.env.DB_NAME_FILE),
 /* ssl: {
    ca: fs.readFileSync('/certs/ca.crt'),
    key: fs.readFileSync('/certs/user-service.key'),
    cert: fs.readFileSync('/certs/user-service.crt'),
  },*/
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