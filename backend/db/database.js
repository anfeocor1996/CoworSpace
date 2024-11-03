// backend/db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Promisify para manejar las consultas de manera asíncrona
const promisify = (db) => {
    return {
        run: (sql, params = []) => {
            return new Promise((resolve, reject) => {
                db.run(sql, params, function(err) {
                    if (err) reject(err);
                    else resolve({ lastID: this.lastID, changes: this.changes });
                });
            });
        },
        all: (sql, params = []) => {
            return new Promise((resolve, reject) => {
                db.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        },
        get: (sql, params = []) => {
            return new Promise((resolve, reject) => {
                db.get(sql, params, (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
            });
        }
    };
};

// Crear conexión a la base de datos
const dbConnection = new sqlite3.Database(path.join(__dirname, 'cowork.db'), (err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
        // Habilitar foreign keys
        dbConnection.run('PRAGMA foreign_keys = ON');
    }
});

// Exportar la conexión promisificada
const db = promisify(dbConnection);

module.exports = { db, dbConnection };