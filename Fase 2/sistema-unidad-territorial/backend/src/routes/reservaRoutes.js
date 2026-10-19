const express = require('express');
const router = express.Router();
const {
  listarEspacios,
  obtenerCalendario,
  solicitar,
  misReservas,
  listarTodas,
  cambiarEstado,
} = require('../controllers/reservaController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Público/Privado
router.get('/espacios', verificarToken, listarEspacios);
router.get('/calendario', verificarToken, obtenerCalendario);

// Vecino
router.post('/', verificarToken, solicitar);
router.get('/mis-reservas', verificarToken, misReservas);

// Directorio
router.get('/todas', verificarToken, listarTodas);
router.put('/:id/estado', verificarToken, cambiarEstado);

module.exports = router;