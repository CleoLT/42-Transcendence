import mariadb from 'mariadb'

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'userpassword',
  database: process.env.DB_NAME || 'transcendance_db',
  connectionLimit: 5
})

export default pool;
