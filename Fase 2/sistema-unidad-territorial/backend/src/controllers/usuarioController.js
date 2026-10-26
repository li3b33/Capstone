const pool = require('../config/db');

// ============================================
// LISTAR VECINOS PENDIENTES
// ============================================
const listarPendientes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, rut, nombres, apellidos, correo, telefono, direccion, fecha_nacimiento, creado_en, tipo_residente, tiempo_residencia
       FROM usuario
       WHERE estado = 'pendiente' AND rol = 'vecino'
       ORDER BY creado_en ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar pendientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// LISTAR TODOS LOS VECINOS (con filtro opcional por estado)
// ============================================
const listarVecinos = async (req, res) => {
  const { estado } = req.query;
  try {
    let query = `SELECT id, rut, nombres, apellidos, correo, telefono, direccion, estado, creado_en, tipo_residente, tiempo_residencia
                 FROM usuario
                 WHERE rol = 'vecino'`;
    const params = [];

    if (estado) {
      query += ` AND estado = $1`;
      params.push(estado);
    }

    query += ` ORDER BY creado_en DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar vecinos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// CAMBIAR ESTADO DE UN USUARIO
// ============================================
const cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado, motivo } = req.body;
  const directorId = req.usuario.id;

  const estadosValidos = ['activo', 'rechazado', 'baja'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    // Verificar que el usuario existe
    const existe = await pool.query('SELECT id, estado, rol FROM usuario WHERE id = $1', [id]);
    if (existe.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (existe.rows[0].rol === 'directorio') {
      return res.status(403).json({ error: 'No puedes cambiar el estado de otro director' });
    }

    const estadoAnterior = existe.rows[0].estado;

    // Actualizar estado
    const result = await pool.query(
      `UPDATE usuario SET estado = $1 WHERE id = $2
       RETURNING id, rut, nombres, apellidos, correo, estado`,
      [estado, id]
    );

    // Registrar en historial
    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, motivo, responsable_id)
       VALUES ('usuario', $1, $2, $3, $4, $5)`,
      [id, estadoAnterior, estado, motivo || null, directorId]
    );

    res.json({
      mensaje: `Usuario ${estado === 'activo' ? 'activado' : estado}`,
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// ESTADÍSTICAS PARA EL PANEL
// ============================================
const estadisticas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT estado, COUNT(*)::int AS total
       FROM usuario
       WHERE rol = 'vecino'
       GROUP BY estado`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error en estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { listarPendientes, listarVecinos, cambiarEstado, estadisticas };