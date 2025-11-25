const Database = require('better-sqlite3');
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
  information TEXT,
  avatar TEXT,
);
`);

module.exports = db;
