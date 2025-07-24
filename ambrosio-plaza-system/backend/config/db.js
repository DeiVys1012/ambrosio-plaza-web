const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta al archivo de la base de datos SQLite
const dbPath = path.resolve(__dirname, '../../database/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a SQLite:', err.message);
  } else {
    console.log('✅ Conexión a SQLite establecida correctamente');
  }
});

// Función para ejecutar consultas que retornan múltiples filas
const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve({ rows });
    });
  });
};

// Función para ejecutar una consulta que retorna una sola fila
const queryOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve({ rows: row ? [row] : [] });
    });
  });
};

// Función para ejecutar comandos (INSERT, UPDATE, DELETE)
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({
        lastID: this.lastID,
        changes: this.changes,
        rows: this.lastID ? [{ id: this.lastID }] : []
      });
    });
  });
};

// Función para probar la conexión
const testConnection = async () => {
  try {
    await query('SELECT 1');
    console.log('✅ Conexión a SQLite verificada correctamente');
  } catch (error) {
    console.error('❌ Error conectando a SQLite:', error.message);
    throw error;
  }
};

// Función para cerrar la base de datos
const closePool = async () => {
  db.close();
};

module.exports = {
  db,
  query,
  queryOne,
  run,
  testConnection,
  closePool
}; 