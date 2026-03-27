const Universidad = require('../models/Universidad');

// Crear
exports.crearUniversidad = async (req, res) => {
    try {
        const universidad = new Universidad(req.body);
        await universidad.save();
        res.status(201).json(universidad);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al crear la Universidad' });
    }
};

// Listar
exports.obtenerUniversidades = async (req, res) => {
    try {
        const universidades = await Universidad.find();
        res.json(universidades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener las Universidades' });
    }
};

// Editar
exports.actualizarUniversidad = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;

        const universidadActualizada = await Universidad.findByIdAndUpdate(
            id,
            nuevosDatos,
            { new: true, runValidators: true }
        );

        if (!universidadActualizada) {
            return res.status(404).json({ msg: 'Universidad no encontrada' });
        }

        res.json(universidadActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al actualizar la Universidad' });
    }
};
