const mongoose = require('mongoose');

const etapaSchema = new mongoose.Schema({
    nombre: {
        type: String, // ej. Anteproyecto, Entrega parcial 1, etc.
        required: [true, 'El nombre de la etapa es obligatorio'],
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Etapa', etapaSchema);
