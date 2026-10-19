const express = require('express');
const router = express.Router();
const {
  listarActividades,
  crearActividad,
  inscribirse,
  misInscripciones
} = require('../controllers/actividadController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Todos requieren login
router.get('/', verificarToken, listarActividades);
router.post('/', verificarToken, crearActividad); // El controlador debería validar que sea directorio
router.post('/:id/inscribirse', verificarToken, inscribirse);
router.get('/mis-inscripciones', verificarToken, misInscripciones);

module.exports = router;