require('dotenv').config();
const mongoose = require('mongoose');

// Definimos el mismo esquema que en seed-db.js
const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    categoria: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    especificaciones: {
        ram: String,
        disco: String,
        color: String
    },
    fechaIngreso: { type: Date, default: Date.now }
});

const Producto = mongoose.model('Producto', productoSchema);

async function añadirMasProductos() {
    try {
        console.log('⏳ Conectando a MongoDB Atlas para añadir más datos...');
        await mongoose.connect(process.env.MONGODB_URI);

        const nuevosProductos = [
            {
                nombre: "Mouse Ergonómico Inalámbrico",
                categoria: "Accesorios",
                precio: 45.99,
                stock: 30,
                especificaciones: { color: "Negro Mate" }
            },
            {
                nombre: "Auriculares Noise Cancelling",
                categoria: "Audio",
                precio: 199.00,
                stock: 12,
                especificaciones: { color: "Plateado" }
            },
            {
                nombre: "Silla Gamer Ergo-Flow",
                categoria: "Mobiliario",
                precio: 280.50,
                stock: 8,
                especificaciones: { color: "Rojo/Negro" }
            }
        ];

        console.log('🚀 Insertando 3 nuevos productos adicionales...');
        // Esta vez NO usamos deleteMany, para que se sumen a los anteriores
        const resultados = await Producto.insertMany(nuevosProductos);

        console.log(`✨ ¡Éxito! Se añadieron ${resultados.length} productos nuevos.`);
        console.log('Total de productos ahora: 6 (aprox)');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

añadirMasProductos();
