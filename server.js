const express = require('express');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3'); // Importa better-sqlite3

const app = express();
const PORT = 3000;

// Crear o abrir la base de datos SQLite
const db = new Database('./database.db', { verbose: console.log });

// Crear la tabla mensajes si no existe
db.prepare(`
    CREATE TABLE IF NOT EXISTS mensajes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        correo TEXT,
        mensaje TEXT
    )
`).run();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta para manejar el formulario
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Insertar datos en la tabla
        db.prepare('INSERT INTO mensajes (nombre, correo, mensaje) VALUES (?, ?, ?)').run(name, email, message);
        res.send('¡Mensaje guardado con éxito!');
    } catch (err) {
        console.error('Error al insertar datos:', err);
        res.status(500).send('Error al guardar el mensaje.');
    }
});

// Ruta para listar mensajes (opcional, para verificar)
app.get('/messages', (req, res) => {
    try {
        const messages = db.prepare('SELECT * FROM mensajes').all();
        res.json(messages);
    } catch (err) {
        console.error('Error al obtener datos:', err);
        res.status(500).send('Error al obtener los mensajes.');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
