const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ============================================
// REGISTRO DE VECINO
// ============================================
const registrar = async (req, res) => {
  const {
    rut, nombres, apellidos, fecha_nacimiento, direccion,
    correo, telefono, password, tipo_residente, tiempo_residencia
  } = req.body;

  try {
    if (!rut || !nombres || !apellidos || !fecha_nacimiento || !direccion || !correo || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const fechaNac = new Date(fecha_nacimiento);
    const hoy = new Date();
    const edad = Math.floor((hoy - fechaNac) / (365.25 * 24 * 60 * 60 * 1000));
    if (edad < 14) {
      return res.status(400).json({ error: 'Debes tener al menos 14 años para inscribirte' });
    }

    const existeCorreo = await pool.query('SELECT id FROM usuario WHERE correo = $1', [correo]);
    if (existeCorreo.rows.length > 0) {
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }

    const existeRut = await pool.query('SELECT id FROM usuario WHERE rut = $1', [rut]);
    if (existeRut.rows.length > 0) {
      return res.status(409).json({ error: 'El RUT ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuario 
        (junta_id, rut, nombres, apellidos, fecha_nacimiento, direccion, correo, telefono, password_hash, rol, estado, tipo_residente, tiempo_residencia)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'vecino', 'pendiente', $10, $11)
       RETURNING id, rut, nombres, apellidos, correo, rol, estado`,
      [1, rut, nombres, apellidos, fecha_nacimiento, direccion, correo, telefono || null, passwordHash, tipo_residente, tiempo_residencia]
    );

    res.status(201).json({
      mensaje: 'Registro exitoso. Tu cuenta será revisada por el directorio.',
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// LOGIN
// ============================================
const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    if (!correo || !password) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const result = await pool.query('SELECT * FROM usuario WHERE correo = $1', [correo]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = result.rows[0];
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (usuario.estado === 'pendiente') {
      return res.status(403).json({ error: 'Tu cuenta aún no ha sido aprobada por el directorio' });
    }
    if (usuario.estado === 'rechazado') {
      return res.status(403).json({ error: 'Tu cuenta fue rechazada' });
    }
    if (usuario.estado === 'baja') {
      return res.status(403).json({ error: 'Tu cuenta está dada de baja' });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        rut: usuario.rut,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: usuario.telefono, // <-- Aseguramos que viaje el teléfono
        direccion: usuario.direccion,
        rol: usuario.rol,
        estado: usuario.estado,
        tipo_residente: usuario.tipo_residente,
        tiempo_residencia: usuario.tiempo_residencia
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// OBTENER PERFIL
// ============================================
const perfil = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, rut, nombres, apellidos, correo, telefono, direccion, rol, estado FROM usuario WHERE id = $1',
      [req.usuario.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error en perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// ACTUALIZAR PERFIL (Correo y Teléfono)
// ============================================
const actualizarPerfil = async (req, res) => {
  const usuarioId = req.usuario.id;
  const { correo, telefono } = req.body;

  if (!correo) {
    return res.status(400).json({ error: 'El correo electrónico es obligatorio' });
  }

  try {
    // Verificar que el nuevo correo no esté en uso por otro usuario
    const existeCorreo = await pool.query(
      'SELECT id FROM usuario WHERE correo = $1 AND id != $2',
      [correo, usuarioId]
    );

    if (existeCorreo.rows.length > 0) {
      return res.status(409).json({ error: 'Este correo ya está registrado por otro vecino.' });
    }

    // Actualizar los datos
    const result = await pool.query(
      `UPDATE usuario 
       SET correo = $1, telefono = $2 
       WHERE id = $3 
       RETURNING id, rut, nombres, apellidos, correo, telefono, direccion, rol, estado, tipo_residente, tiempo_residencia`,
      [correo, telefono || null, usuarioId]
    );

    res.json({
      mensaje: 'Perfil actualizado correctamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { registrar, login, perfil, actualizarPerfil };