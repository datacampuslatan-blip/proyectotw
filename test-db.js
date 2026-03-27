require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri || uri === 'URL_DE_CONEXION_AQUI') {
            console.error('Error: Por favor, actualiza tu archivo .env con la cadena de conexión de MongoDB Atlas.');
            process.exit(1);
        }

        await mongoose.connect(uri);
        console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
        
        // Cerramos la conexión después de probar
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

connectDB();
