/*const Database = require('better-sqlite3');
const path = require('path');

// Ruta a tu archivo SQLite
const dbPath = path.join(__dirname, 'data', 'database.sqlite');

// Abrir o crear la base de datos
const db = new Database(dbPath);

// Crear tablas si no existen (opcional)
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password TEXT,
  alias TEXT UNIQUE,
  bio TEXT,
  avatar TEXT,
  online_status BOOLEAN DEFAULT 0,
	created_at TIMESTAMP,
	playing_time TIME
);
`);
*/

const mariadb = require('mariadb')

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'userpassword',
  database: process.env.DB_NAME || 'transcendance_db',
  connectionLimit: 5
})

module.exports = pool;
