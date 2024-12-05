const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar la base de datos SQLite
const db = new Database('./database.db');

// Crear la tabla si no existe
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
app.use(cors());

// Sirve los archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el formulario de contacto
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO mensajes (nombre, correo, mensaje) VALUES (?, ?, ?)');
        stmt.run(name, email, message);
        res.send('¡Mensaje guardado con éxito!');
    } catch (err) {
        console.error('Error al guardar el mensaje:', err);
        res.status(500).send('Error al guardar el mensaje.');
    }
});

// Ruta para ver mensajes
app.get('/messages', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM mensajes');
        const messages = stmt.all();
        res.json(messages);
    } catch (err) {
        console.error('Error al obtener mensajes:', err);
        res.status(500).send('Error al obtener mensajes.');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
