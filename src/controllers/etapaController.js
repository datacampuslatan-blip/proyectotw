const Etapa = require('../models/Etapa');

// Crear
exports.crearEtapa = async (req, res) => {
    try {
        const etapa = new Etapa(req.body);
        await etapa.save();
        res.status(201).json(etapa);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al crear la Etapa' });
    }
};

// Listar
exports.obtenerEtapas = async (req, res) => {
    try {
        const etapas = await Etapa.find();
        res.json(etapas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener las Etapas' });
    }
};

// Editar
exports.actualizarEtapa = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;

        const etapaActualizada = await Etapa.findByIdAndUpdate(
            id,
            nuevosDatos,
            { new: true, runValidators: true }
        );

        if (!etapaActualizada) {
            return res.status(404).json({ msg: 'Etapa no encontrada' });
        }

        res.json(etapaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al actualizar la Etapa' });
    }
};
