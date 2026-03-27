const express = require('express');
const router = express.Router();
const tipoProyectoController = require('../controllers/tipoProyectoController');

// api/tipos-proyecto
router.post('/', tipoProyectoController.crearTipoProyecto);
router.get('/', tipoProyectoController.obtenerTiposProyecto);
router.put('/:id', tipoProyectoController.actualizarTipoProyecto);

module.exports = router;
