const Proyecto = require('../models/Proyecto');

// Crear
exports.crearProyecto = async (req, res) => {
    try {
        const proyecto = new Proyecto(req.body);
        await proyecto.save();
        res.status(201).json(proyecto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al crear el Proyecto' });
    }
};

// Listar (Poblando las referencias)
exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find()
            .populate('cliente')
            .populate('tipoProyecto')
            .populate('universidad')
            .populate('etapa');
        res.json(proyectos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener los Proyectos' });
    }
};

// Editar
exports.actualizarProyecto = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;

        const proyectoActualizado = await Proyecto.findByIdAndUpdate(
            id,
            nuevosDatos,
            { new: true, runValidators: true }
        );

        if (!proyectoActualizado) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        res.json(proyectoActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al actualizar el Proyecto' });
    }
};
