const express = require('express');
const router = express.Router();
const universidadController = require('../controllers/universidadController');

// api/universidades
router.post('/', universidadController.crearUniversidad);
router.get('/', universidadController.obtenerUniversidades);
router.put('/:id', universidadController.actualizarUniversidad);

module.exports = router;
