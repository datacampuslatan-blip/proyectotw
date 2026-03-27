const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
    numero: {
        type: String,
        required: [true, 'El número del proyecto es obligatorio'],
        unique: true,
        trim: true
    },
    titulo: {
        type: String,
        required: [true, 'El título del proyecto es obligatorio'],
        trim: true
    },
    fechaIniciacion: {
        type: Date,
        required: [true, 'La fecha de iniciación es obligatoria']
    },
    fechaEntrega: {
        type: Date,
        required: [true, 'La fecha de entrega es obligatoria']
    },
    valor: {
        type: Number,
        required: [true, 'El valor del proyecto es obligatorio']
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: [true, 'El cliente es obligatorio']
    },
    tipoProyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoProyecto',
        required: [true, 'El tipo de proyecto es obligatorio']
    },
    universidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Universidad',
        required: [true, 'La universidad es obligatoria']
    },
    etapa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Etapa',
        required: [true, 'La etapa es obligatoria']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Proyecto', proyectoSchema);
