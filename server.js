const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa CORS

const app = express();

// Configuración de CORS
app.use(cors());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Cerdo3312',
    database: 'contacto_portafolio',
});


// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Ruta GET para el punto raíz
app.get('/', (req, res) => {
    res.send('¡Bienvenido al servidor de contacto!');
});

// Ruta para manejar el formulario
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validación básica
    if (!name || !email || !message) {
        res.status(400).send('Todos los campos son obligatorios.');
        return;
    }

    // Query para insertar datos
    const sql = 'INSERT INTO mensajes (nombre, correo, mensaje) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Error al insertar datos:', err);
            res.status(500).send('Error al guardar el mensaje.');
            return;
        }
        res.status(200).send('¡Mensaje guardado con éxito!');
    });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
