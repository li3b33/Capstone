const express = require('express');
const router = express.Router();
const { registrar, login, perfil, actualizarPerfil } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', verificarToken, perfil);
router.put('/perfil', verificarToken, actualizarPerfil);

module.exports = router;