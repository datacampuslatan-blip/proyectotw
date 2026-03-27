const mongoose = require('mongoose');

const universidadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la universidad es obligatorio'],
        unique: true,
        trim: true
    },
    direccion: {
        type: String,
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Universidad', universidadSchema);
