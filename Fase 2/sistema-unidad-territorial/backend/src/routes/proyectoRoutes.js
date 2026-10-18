const express = require('express');
const router = express.Router();
const {
  postular,
  misProyectos,
  listarTodos,
  revisar,
  aprobar,
  rechazar,
} = require('../controllers/proyectoController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rutas del vecino
router.post('/', verificarToken, postular);
router.get('/mis-proyectos', verificarToken, misProyectos);

// Rutas del directorio
router.get('/todos', verificarToken, listarTodos);
router.put('/:id/revisar', verificarToken, revisar);
router.put('/:id/aprobar', verificarToken, aprobar);
router.put('/:id/rechazar', verificarToken, rechazar);

module.exports = router;