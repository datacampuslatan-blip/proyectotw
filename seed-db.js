require('dotenv').config();
const mongoose = require('mongoose');

// 1. DEFINICIÓN DEL ESQUEMA (El "plano" o molde de nuestros datos)
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

// 2. CREACIÓN DEL MODELO (La "fábrica" para interactuar con la colección)
// Mongoose creará automáticamente una colección llamada 'productos' (en plural)
const Producto = mongoose.model('Producto', productoSchema);

async function sembrarDatos() {
    try {
        // 3. CONEXIÓN A MONGO DB ATLAS
        console.log('⏳ Conectando a MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conexión establecida.');

        // 4. LIMPIEZA INICIAL (Opcional: borra datos previos para no duplicar)
        console.log('🧹 Limpiando colección de productos...');
        await Producto.deleteMany({});

        // 5. DATOS DE EJEMPLO
        const productosEjemplo = [
            {
                nombre: "Laptop Gamer X-100",
                categoria: "Electrónica",
                precio: 1250.99,
                stock: 10,
                especificaciones: { ram: "16GB", disco: "1TB SSD", color: "Gris Espacial" }
            },
            {
                nombre: "Teclado Mecánico RGB",
                categoria: "Accesorios",
                precio: 85.50,
                stock: 50,
                especificaciones: { color: "Negro" }
            },
            {
                nombre: "Monitor 4K UltraWide",
                categoria: "Electrónica",
                precio: 450.00,
                stock: 5,
                especificaciones: { ram: "N/A", disco: "N/A", color: "Blanco" }
            }
        ];

        // 6. INSERCIÓN DE DATOS
        console.log('🚀 Insertando productos en la nube...');
        const resultados = await Producto.insertMany(productosEjemplo);
        console.log(`✨ ¡Éxito! Se han creado ${resultados.length} productos.`);

        // 7. MOSTRAR LO QUE SE CREÓ EN CONSOLA
        console.log('\n--- Productos Creados ---');
        resultados.forEach(p => console.log(`- ${p.nombre} ($${p.precio})`));

    } catch (error) {
        console.error('❌ Error en el proceso:', error.message);
    } finally {
        // 8. CIERRE DE CONEXIÓN (Siempre cerramos al terminar)
        await mongoose.connection.close();
        console.log('\n🔒 Conexión cerrada.');
        process.exit(0);
    }
}

// Ejecutar la función
sembrarDatos();
