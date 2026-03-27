const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// api/clientes
router.post('/', clienteController.crearCliente);
router.get('/', clienteController.obtenerClientes);
router.put('/:id', clienteController.actualizarCliente);

module.exports = router;
