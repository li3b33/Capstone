const pool = require('../config/db');

// ============================================
// OBTENER ESPACIOS DISPONIBLES
// ============================================
const listarEspacios = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, tipo, descripcion, activo 
       FROM espacio WHERE activo = true ORDER BY nombre ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar espacios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// OBTENER RESERVAS DE LA SEMANA (Para el calendario)
// ============================================
const obtenerCalendario = async (req, res) => {
  const { espacio_id, fecha_inicio } = req.query; // fecha_inicio: YYYY-MM-DD
  try {
    const result = await pool.query(
      `SELECT r.id, r.inicio, r.fin, r.estado, r.usuario_id, r.motivo, u.nombres AS vecino_nombre
       FROM reserva r
       JOIN usuario u ON u.id = r.usuario_id
       WHERE r.espacio_id = $1 
       AND r.estado IN ('pendiente', 'aprobada')
       AND r.inicio >= $2::date
       AND r.inicio < ($2::date + interval '7 days')`,
      [espacio_id, fecha_inicio]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener calendario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// VECINO SOLICITA UNA RESERVA
// ============================================
const solicitar = async (req, res) => {
  const usuarioId = req.usuario.id;
  const { espacio_id, fecha, hora_inicio, hora_fin, motivo } = req.body;

  if (!espacio_id || !fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const inicio = `${fecha} ${hora_inicio}:00`;
  const fin = `${fecha} ${hora_fin}:00`;

  if (inicio >= fin) {
    return res.status(400).json({ error: 'La hora de fin debe ser posterior a la de inicio' });
  }

  try {
    const cruce = await pool.query(
      `SELECT id FROM reserva 
       WHERE espacio_id = $1 
       AND estado IN ('pendiente', 'aprobada')
       AND (inicio < $3 AND fin > $2)`,
      [espacio_id, inicio, fin]
    );

    if (cruce.rows.length > 0) {
      return res.status(409).json({ error: 'El espacio ya está reservado en ese horario. Por favor elige otro bloque.' });
    }

    const result = await pool.query(
      `INSERT INTO reserva (espacio_id, usuario_id, inicio, fin, motivo, estado)
       VALUES ($1, $2, $3, $4, $5, 'pendiente')
       RETURNING id, inicio, fin, estado`,
      [espacio_id, usuarioId, inicio, fin, motivo || null]
    );

    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, responsable_id)
       VALUES ('reserva', $1, NULL, 'pendiente', $2)`,
      [result.rows[0].id, usuarioId]
    );

    res.status(201).json({
      mensaje: 'Solicitud de reserva enviada. El directorio la revisará.',
      reserva: result.rows[0],
    });
  } catch (error) {
    console.error('Error al solicitar reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// VECINO VE SUS RESERVAS
// ============================================
const misReservas = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const result = await pool.query(
      `SELECT r.id, r.inicio, r.fin, r.motivo, r.estado, e.nombre AS espacio_nombre, e.tipo AS espacio_tipo
       FROM reserva r
       JOIN espacio e ON e.id = r.espacio_id
       WHERE r.usuario_id = $1 
       ORDER BY r.inicio DESC`,
      [usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar reservas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: LISTAR RESERVAS PENDIENTES/TODAS
// ============================================
const listarTodas = async (req, res) => {
  const { estado } = req.query;
  try {
    let query = `
      SELECT r.id, r.inicio, r.fin, r.motivo, r.estado,
             e.nombre AS espacio_nombre,
             u.nombres, u.apellidos, u.rut, u.correo
      FROM reserva r
      JOIN espacio e ON e.id = r.espacio_id
      JOIN usuario u ON u.id = r.usuario_id
    `;
    const params = [];
    if (estado) {
      query += ` WHERE r.estado = $1`;
      params.push(estado);
    }
    query += ` ORDER BY r.inicio ASC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar todas las reservas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: CAMBIAR ESTADO (Aprobar/Rechazar)
// ============================================
const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const directorId = req.usuario.id;

  if (!['aprobada', 'rechazada'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const result = await pool.query(
      `UPDATE reserva SET estado = $1 WHERE id = $2 AND estado = 'pendiente'
       RETURNING id, estado`,
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reserva no encontrada o ya procesada' });
    }

    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, responsable_id)
       VALUES ('reserva', $1, 'pendiente', $2, $3)`,
      [id, estado, directorId]
    );

    res.json({ mensaje: `Reserva ${estado} correctamente` });
  } catch (error) {
    console.error('Error al cambiar estado de reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  listarEspacios,
  obtenerCalendario,
  solicitar,
  misReservas,
  listarTodas,
  cambiarEstado,
};