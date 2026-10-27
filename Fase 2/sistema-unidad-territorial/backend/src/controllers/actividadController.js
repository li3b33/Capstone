const pool = require('../config/db');

// ============================================
// LISTAR ACTIVIDADES (Para vecinos y directorio)
// ============================================
const listarActividades = async (req, res) => {
  try {
    // Traemos las actividades y contamos cuántos inscritos activos tienen
    const result = await pool.query(
      `SELECT a.*, 
              (SELECT COUNT(*) FROM inscripcion_actividad ia 
               WHERE ia.actividad_id = a.id AND ia.estado = 'inscrito') AS inscritos
       FROM actividad a
       ORDER BY a.fecha_hora ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar actividades:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: CREAR ACTIVIDAD
// ============================================
const crearActividad = async (req, res) => {
  const { titulo, descripcion, lugar, fecha_hora, cupo_maximo } = req.body;
  const directorId = req.usuario.id;

  if (!titulo || !lugar || !fecha_hora || !cupo_maximo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    // Asumimos que el director pertenece a la junta 1
    const result = await pool.query(
      `INSERT INTO actividad (junta_id, creado_por, titulo, descripcion, lugar, fecha_hora, cupo_maximo, estado)
       VALUES (1, $1, $2, $3, $4, $5, $6, 'programada')
       RETURNING id, titulo, fecha_hora, cupo_maximo`,
      [directorId, titulo, descripcion, lugar, fecha_hora, cupo_maximo]
    );
    res.status(201).json({ mensaje: 'Actividad creada', actividad: result.rows[0] });
  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// VECINO: INSCRIBIRSE EN ACTIVIDAD
// ============================================
const inscribirse = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario.id;

  try {
    // 1. Verificar si ya tiene un registro en esta actividad
    const yaInscrito = await pool.query(
      `SELECT estado FROM inscripcion_actividad 
       WHERE actividad_id = $1 AND usuario_id = $2`,
      [id, usuarioId]
    );

    if (yaInscrito.rows.length > 0) {
      if (yaInscrito.rows[0].estado === 'inscrito') {
        return res.status(400).json({ error: 'Ya estás inscrito en esta actividad' });
      }
      if (yaInscrito.rows[0].estado === 'cancelado') {
        return res.status(400).json({ error: 'Cancelaste tu inscripción previamente. No es posible volver a inscribirse en esta actividad.' });
      }
    }

    // 2. Verificar cupo
    const actQuery = await pool.query(
      `SELECT cupo_maximo, 
              (SELECT COUNT(*) FROM inscripcion_actividad WHERE actividad_id = $1 AND estado = 'inscrito') AS inscritos
       FROM actividad WHERE id = $1`,
      [id]
    );

    if (actQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Actividad no encontrada' });
    }

    const { cupo_maximo, inscritos } = actQuery.rows[0];

    if (parseInt(inscritos) >= parseInt(cupo_maximo)) {
      return res.status(400).json({ error: 'La actividad ya está llena' });
    }

    // 3. Insertar
    await pool.query(
      `INSERT INTO inscripcion_actividad (actividad_id, usuario_id, estado)
       VALUES ($1, $2, 'inscrito')`,
      [id, usuarioId]
    );

    res.status(201).json({ mensaje: 'Te has inscrito exitosamente' });
  } catch (error) {
    console.error('Error al inscribirse:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// VECINO: VER MIS INSCRIPCIONES
// ============================================
const misInscripciones = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const result = await pool.query(
      `SELECT ia.actividad_id, a.titulo, a.fecha_hora, a.lugar, ia.fecha_inscripcion, ia.estado
       FROM inscripcion_actividad ia
       JOIN actividad a ON a.id = ia.actividad_id
       WHERE ia.usuario_id = $1 ORDER BY a.fecha_hora ASC`,
      [usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al ver inscripciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
// ============================================
// VECINO: CANCELAR INSCRIPCIÓN
// ============================================
const cancelarInscripcion = async (req, res) => {
  const { id } = req.params; // ID de la actividad
  const usuarioId = req.usuario.id;

  try {
    // En lugar de borrar la fila, cambiamos el estado a 'cancelado'
    const result = await pool.query(
      `UPDATE inscripcion_actividad 
       SET estado = 'cancelado' 
       WHERE actividad_id = $1 AND usuario_id = $2 AND estado = 'inscrito'
       RETURNING id`,
      [id, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No estás inscrito en esta actividad o ya la cancelaste.' });
    }

    res.json({ mensaje: 'Inscripción cancelada exitosamente. El cupo ha sido liberado.' });
  } catch (error) {
    console.error('Error al cancelar inscripción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  listarActividades,
  crearActividad,
  inscribirse,
  misInscripciones,
  cancelarInscripcion
};