const mongoose = require('mongoose');

const tipoProyectoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del tipo de proyecto es obligatorio'],
        unique: true,
        trim: true
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('TipoProyecto', tipoProyectoSchema);
