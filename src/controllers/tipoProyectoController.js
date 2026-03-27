const TipoProyecto = require('../models/TipoProyecto');

// Crear
exports.crearTipoProyecto = async (req, res) => {
    try {
        const tipoProyecto = new TipoProyecto(req.body);
        await tipoProyecto.save();
        res.status(201).json(tipoProyecto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al crear el Tipo de Proyecto' });
    }
};

// Listar
exports.obtenerTiposProyecto = async (req, res) => {
    try {
        const tiposProyectos = await TipoProyecto.find();
        res.json(tiposProyectos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener los Tipos de Proyecto' });
    }
};

// Editar
exports.actualizarTipoProyecto = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;

        const tipoProyectoActualizado = await TipoProyecto.findByIdAndUpdate(
            id,
            nuevosDatos,
            { new: true, runValidators: true }
        );

        if (!tipoProyectoActualizado) {
            return res.status(404).json({ msg: 'Tipo de Proyecto no encontrado' });
        }

        res.json(tipoProyectoActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al actualizar el Tipo de Proyecto' });
    }
};
