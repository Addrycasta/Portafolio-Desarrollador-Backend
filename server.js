const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Importa cors

const app = express();
const PORT = 3000;

// Permite todas las solicitudes de cualquier origen
app.use(cors());

// Crear o abrir la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al conectar a SQLite:', err);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear la tabla mensajes si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS mensajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        correo TEXT,
        mensaje TEXT
    )
`);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta para manejar el formulario
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Insertar datos en la tabla
    const sql = 'INSERT INTO mensajes (nombre, correo, mensaje) VALUES (?, ?, ?)';
    db.run(sql, [name, email, message], function (err) {
        if (err) {
            console.error('Error al insertar datos en SQLite:', err);
            res.status(500).send('Error al guardar el mensaje.');
        } else {
            res.send('¡Mensaje guardado con éxito!');
        }
    });
});

// Ruta para listar mensajes (opcional, para verificar)
app.get('/messages', (req, res) => {
    const sql = 'SELECT * FROM mensajes';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener datos de SQLite:', err);
            res.status(500).send('Error al obtener los mensajes.');
        } else {
            res.json(rows);
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
