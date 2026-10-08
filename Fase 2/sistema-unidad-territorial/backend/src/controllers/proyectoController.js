const pool = require('../config/db');
const {
  enviarProyectoAprobado,
  enviarProyectoRechazado,
} = require('../services/emailService');

// ============================================
// VECINO POSTULA UN PROYECTO
// ============================================
const postular = async (req, res) => {
  const usuarioId = req.usuario.id;
  const { titulo, descripcion, presupuesto_estimado } = req.body;

  if (!titulo || !descripcion || !presupuesto_estimado) {
    return res.status(400).json({ error: 'Título, descripción y presupuesto son obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO proyecto (usuario_id, titulo, descripcion, presupuesto_estimado, estado)
       VALUES ($1, $2, $3, $4, 'recibido')
       RETURNING id, titulo, estado, fecha_postulacion`,
      [usuarioId, titulo, descripcion, presupuesto_estimado]
    );

    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, responsable_id)
       VALUES ('proyecto', $1, NULL, 'recibido', $2)`,
      [result.rows[0].id, usuarioId]
    );

    res.status(201).json({
      mensaje: 'Proyecto postulado. El directorio lo revisará pronto.',
      proyecto: result.rows[0],
    });
  } catch (error) {
    console.error('Error al postular proyecto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// VECINO VE SUS PROYECTOS
// ============================================
const misProyectos = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const result = await pool.query(
      `SELECT id, titulo, descripcion, presupuesto_estimado, estado, fecha_postulacion
       FROM proyecto WHERE usuario_id = $1 ORDER BY fecha_postulacion DESC`,
      [usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar proyectos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: LISTAR PROYECTOS
// ============================================
const listarTodos = async (req, res) => {
  const { estado } = req.query;
  try {
    let query = `
      SELECT p.id, p.titulo, p.descripcion, p.presupuesto_estimado, p.estado, p.fecha_postulacion,
             u.rut, u.nombres, u.apellidos, u.correo
      FROM proyecto p
      JOIN usuario u ON u.id = p.usuario_id
    `;
    const params = [];
    if (estado) {
      query += ` WHERE p.estado = $1`;
      params.push(estado);
    }
    query += ` ORDER BY p.fecha_postulacion DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar proyectos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: MARCAR EN REVISIÓN
// ============================================
const revisar = async (req, res) => {
  const { id } = req.params;
  const directorId = req.usuario.id;

  try {
    const result = await pool.query(
      `UPDATE proyecto SET estado = 'en_revision'
       WHERE id = $1 AND estado = 'recibido'
       RETURNING id, estado`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado o ya procesado' });
    }
    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, responsable_id)
       VALUES ('proyecto', $1, 'recibido', 'en_revision', $2)`,
      [id, directorId]
    );
    res.json({ mensaje: 'Proyecto marcado en revisión', proyecto: result.rows[0] });
  } catch (error) {
    console.error('Error al revisar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: APROBAR PROYECTO
// ============================================
const aprobar = async (req, res) => {
  const { id } = req.params;
  const directorId = req.usuario.id;

  try {
    const proyecto = await pool.query(
      `SELECT p.*, u.correo, u.nombres, u.apellidos
       FROM proyecto p
       JOIN usuario u ON u.id = p.usuario_id
       WHERE p.id = $1 AND p.estado IN ('recibido', 'en_revision')`,
      [id]
    );
    if (proyecto.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado o ya procesado' });
    }

    const estadoAnterior = proyecto.rows[0].estado;
    const result = await pool.query(
      `UPDATE proyecto SET estado = 'aprobado' WHERE id = $1
       RETURNING id, titulo, estado, presupuesto_estimado`,
      [id]
    );

    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, responsable_id)
       VALUES ('proyecto', $1, $2, 'aprobado', $3)`,
      [id, estadoAnterior, directorId]
    );

    const usuario = proyecto.rows[0];
    let emailEnviado = false;
    try {
      await enviarProyectoAprobado(usuario, result.rows[0]);
      emailEnviado = true;
    } catch (emailError) {
      console.error('⚠️ Error al enviar email:', emailError.message);
    }

    res.json({
      mensaje: emailEnviado
        ? 'Proyecto aprobado y notificado por email'
        : 'Proyecto aprobado (no se pudo enviar el email)',
      proyecto: result.rows[0],
      emailEnviado,
    });
  } catch (error) {
    console.error('Error al aprobar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: RECHAZAR PROYECTO
// ============================================
const rechazar = async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;
  const directorId = req.usuario.id;

  if (!motivo || motivo.trim().length < 5) {
    return res.status(400).json({ error: 'Debes indicar un motivo (mínimo 5 caracteres)' });
  }

  try {
    const proyecto = await pool.query(
      `SELECT p.*, u.correo, u.nombres, u.apellidos
       FROM proyecto p
       JOIN usuario u ON u.id = p.usuario_id
       WHERE p.id = $1 AND p.estado IN ('recibido', 'en_revision')`,
      [id]
    );
    if (proyecto.rows.length === 0) {
      return res.status(404).json({ error: 'Proyecto no encontrado o ya procesado' });
    }

    const estadoAnterior = proyecto.rows[0].estado;
    await pool.query(`UPDATE proyecto SET estado = 'rechazado' WHERE id = $1`, [id]);
    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, motivo, responsable_id)
       VALUES ('proyecto', $1, $2, 'rechazado', $3, $4)`,
      [id, estadoAnterior, motivo, directorId]
    );

    const usuario = proyecto.rows[0];
    let emailEnviado = false;
    try {
      await enviarProyectoRechazado(usuario, proyecto.rows[0], motivo);
      emailEnviado = true;
    } catch (emailError) {
      console.error('⚠️ Error al enviar email:', emailError.message);
    }

    res.json({
      mensaje: emailEnviado
        ? 'Proyecto rechazado y notificado por email'
        : 'Proyecto rechazado (no se pudo enviar el email)',
      emailEnviado,
    });
  } catch (error) {
    console.error('Error al rechazar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { postular, misProyectos, listarTodos, revisar, aprobar, rechazar };