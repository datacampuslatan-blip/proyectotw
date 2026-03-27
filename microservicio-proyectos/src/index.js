require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Conectar a la base de datos Atlas
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('✅ Microservicio de PROYECTOS funcionando correctamente (Desacoplado)');
});

// Importar rutas únicas de este contexto delimitado
app.use('/api/proyectos', require('./routes/proyectos'));

const PORT = process.env.PORT || 4001; // Puerto Dedicado al Microservicio

// ✅ Health Check (Para que Nginx/Orquestador sepa que estamos vivos)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'api-proyectos', pid: process.pid });
});

const server = app.listen(PORT, () => {
    console.log(`🚀 [MICROSERVICIO] Proyectos corriendo en el puerto ${PORT}`);
});

// ✅ Graceful Shutdown (Apagado Seguro sin tumbar peticiones en vuelo)
process.on('SIGTERM', () => {
    console.log('🛑 [SIGTERM] Señal recibida. Apagando el servidor de proyectos...');
    server.close(() => {
        console.log('✅ Servidor apagado correctamente.');
        process.exit(0);
    });
});
