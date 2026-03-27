require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta principal (Test)
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

app.use('/api/tipos-proyecto', require('./routes/tiposProyecto'));
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/universidades', require('./routes/universidades'));
app.use('/api/etapas', require('./routes/etapas'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
