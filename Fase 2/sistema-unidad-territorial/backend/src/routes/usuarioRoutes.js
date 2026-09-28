const express = require('express');
const router = express.Router();
const {
  listarPendientes,
  listarVecinos,
  cambiarEstado,
  estadisticas,
} = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.get('/pendientes', verificarToken, listarPendientes);
router.get('/', verificarToken, listarVecinos);
router.get('/estadisticas', verificarToken, estadisticas);
router.put('/:id/estado', verificarToken, cambiarEstado);

module.exports = router;