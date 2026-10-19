const express = require('express');
const router = express.Router();
const { listarNoticias, crearNoticia, eliminarNoticia } = require('../controllers/noticiaController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Público (cualquiera puede ver las noticias)
router.get('/', listarNoticias);

// Privado (solo directores con token pueden crear/borrar)
router.post('/', verificarToken, crearNoticia);
router.delete('/:id', verificarToken, eliminarNoticia);

module.exports = router;