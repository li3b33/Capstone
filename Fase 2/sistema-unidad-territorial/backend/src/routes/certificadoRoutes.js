const express = require('express');
const router = express.Router();
const {
  solicitar,
  misCertificados,
  verificarPorFolio,
  listarPendientes,
  listarTodos,
  aprobar,
  rechazar,
  descargarPDF,
} = require('../controllers/certificadoController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rutas del vecino (privadas)
router.post('/', verificarToken, solicitar);
router.get('/mis-certificados', verificarToken, misCertificados);

// Rutas del directorio (privadas)
router.get('/pendientes', verificarToken, listarPendientes);
router.get('/todos', verificarToken, listarTodos);
router.put('/:id/aprobar', verificarToken, aprobar);
router.put('/:id/rechazar', verificarToken, rechazar);

// Descarga de PDF (vecino dueño o directorio)
router.get('/:id/pdf', verificarToken, descargarPDF);

// Ruta pública
router.get('/verificar/:folio', verificarPorFolio);

module.exports = router;