const Cliente = require('../models/Cliente');

// Crear
exports.crearCliente = async (req, res) => {
    try {
        const cliente = new Cliente(req.body);
        await cliente.save();
        res.status(201).json(cliente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al crear el Cliente' });
    }
};

// Listar
exports.obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener los Clientes' });
    }
};

// Editar
exports.actualizarCliente = async (req, res) => {
    try {
        const id = req.params.id;
        const nuevosDatos = req.body;

        const clienteActualizado = await Cliente.findByIdAndUpdate(
            id,
            nuevosDatos,
            { new: true, runValidators: true }
        );

        if (!clienteActualizado) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        res.json(clienteActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al actualizar el Cliente' });
    }
};
