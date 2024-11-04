// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta raíz para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.json({ 
        message: "API funcionando correctamente",
        status: "online"
    });
});

// Importar rutas
const apiRouter = require('./routes/api');

// Usar las rutas
app.use('/api', apiRouter);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});