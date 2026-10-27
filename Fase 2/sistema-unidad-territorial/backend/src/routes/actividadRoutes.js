const express = require('express');
const router = express.Router();
const {
  listarActividades,
  crearActividad,
  inscribirse,
  misInscripciones,
  cancelarInscripcion 
} = require('../controllers/actividadController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Todos requieren login
router.get('/', verificarToken, listarActividades);
router.post('/', verificarToken, crearActividad);
router.post('/:id/inscribirse', verificarToken, inscribirse);
router.get('/mis-inscripciones', verificarToken, misInscripciones);
router.put('/:id/cancelar', verificarToken, cancelarInscripcion);

module.exports = router;