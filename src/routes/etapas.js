const express = require('express');
const router = express.Router();
const etapaController = require('../controllers/etapaController');

// api/etapas
router.post('/', etapaController.crearEtapa);
router.get('/', etapaController.obtenerEtapas);
router.put('/:id', etapaController.actualizarEtapa);

module.exports = router;
