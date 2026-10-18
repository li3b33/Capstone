const pool = require('../config/db');
const {
  enviarCertificadoAprobado,
  enviarCertificadoRechazado,
} = require('../services/emailService');
const { generarCertificadoPDF } = require('../services/certificadoPdfService');

// ============================================
// VECINO SOLICITA UN CERTIFICADO
// ============================================
const solicitar = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const pendiente = await pool.query(
      `SELECT id FROM solicitud_certificado WHERE usuario_id = $1 AND estado = 'pendiente'`,
      [usuarioId]
    );
    if (pendiente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya tienes una solicitud pendiente.' });
    }
    const usuario = await pool.query(`SELECT direccion FROM usuario WHERE id = $1`, [usuarioId]);
    if (usuario.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const result = await pool.query(
      `INSERT INTO solicitud_certificado (usuario_id, estado, direccion_certificada)
       VALUES ($1, 'pendiente', $2)
       RETURNING id, estado, fecha_solicitud`,
      [usuarioId, usuario.rows[0].direccion]
    );
    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, responsable_id)
       VALUES ('certificado', $1, NULL, 'pendiente', $2)`,
      [result.rows[0].id, usuarioId]
    );
    res.status(201).json({
      mensaje: 'Solicitud enviada. El directorio la revisará pronto.',
      solicitud: result.rows[0],
    });
  } catch (error) {
    console.error('Error al solicitar certificado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// VECINO VE SUS CERTIFICADOS
// ============================================
const misCertificados = async (req, res) => {
  const usuarioId = req.usuario.id;
  try {
    const result = await pool.query(
      `SELECT id, estado, folio, direccion_certificada, fecha_solicitud, fecha_emision
       FROM solicitud_certificado WHERE usuario_id = $1 ORDER BY fecha_solicitud DESC`,
      [usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar certificados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// VERIFICACIÓN PÚBLICA POR FOLIO
// ============================================
const verificarPorFolio = async (req, res) => {
  const { folio } = req.params;
  try {
    const result = await pool.query(
      `SELECT sc.folio, sc.fecha_emision, sc.direccion_certificada,
              u.nombres, u.apellidos, u.rut, j.nombre AS junta
       FROM solicitud_certificado sc
       JOIN usuario u ON u.id = sc.usuario_id
       JOIN junta j ON j.id = u.junta_id
       WHERE sc.folio = $1 AND sc.estado = 'aprobado'`,
      [folio]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificado no encontrado o no válido' });
    }
    res.json({ valido: true, certificado: result.rows[0] });
  } catch (error) {
    console.error('Error al verificar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: LISTAR PENDIENTES
// ============================================
const listarPendientes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT sc.id, sc.estado, sc.fecha_solicitud, sc.direccion_certificada,
              u.id AS usuario_id, u.rut, u.nombres, u.apellidos, u.correo, u.telefono
       FROM solicitud_certificado sc
       JOIN usuario u ON u.id = sc.usuario_id
       WHERE sc.estado = 'pendiente'
       ORDER BY sc.fecha_solicitud ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar pendientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: LISTAR TODOS
// ============================================
const listarTodos = async (req, res) => {
  const { estado } = req.query;
  try {
    let query = `
      SELECT sc.id, sc.estado, sc.folio, sc.fecha_solicitud, sc.fecha_emision,
             sc.direccion_certificada,
             u.rut, u.nombres, u.apellidos, u.correo
      FROM solicitud_certificado sc
      JOIN usuario u ON u.id = sc.usuario_id
    `;
    const params = [];
    if (estado) {
      query += ` WHERE sc.estado = $1`;
      params.push(estado);
    }
    query += ` ORDER BY sc.fecha_solicitud DESC`;
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar certificados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: APROBAR CERTIFICADO
// ============================================
const aprobar = async (req, res) => {
  const { id } = req.params;
  const directorId = req.usuario.id;
  try {
    const solicitud = await pool.query(
      `SELECT sc.*, u.correo, u.nombres, u.apellidos
       FROM solicitud_certificado sc
       JOIN usuario u ON u.id = sc.usuario_id
       WHERE sc.id = $1 AND sc.estado = 'pendiente'`,
      [id]
    );
    if (solicitud.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada o ya procesada' });
    }
    const anio = new Date().getFullYear();
    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM solicitud_certificado WHERE folio IS NOT NULL`
    );
    const numero = String(countResult.rows[0].total + 1).padStart(4, '0');
    const folio = `CERT-${anio}-${numero}`;
    const result = await pool.query(
      `UPDATE solicitud_certificado
       SET estado = 'aprobado', folio = $1, fecha_emision = now()
       WHERE id = $2
       RETURNING id, folio, estado, fecha_emision, direccion_certificada`,
      [folio, id]
    );
    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, responsable_id)
       VALUES ('certificado', $1, 'pendiente', 'aprobado', $2)`,
      [id, directorId]
    );
    const certificado = result.rows[0];
    const usuario = solicitud.rows[0];
    let emailEnviado = false;
    try {
      await enviarCertificadoAprobado(usuario, certificado);
      emailEnviado = true;
    } catch (emailError) {
      console.error('⚠️ Error al enviar email:', emailError.message);
    }
    res.json({
      mensaje: emailEnviado
        ? 'Certificado aprobado y notificado por email'
        : 'Certificado aprobado (no se pudo enviar el email)',
      certificado,
      emailEnviado,
    });
  } catch (error) {
    console.error('Error al aprobar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DIRECTORIO: RECHAZAR CERTIFICADO
// ============================================
const rechazar = async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;
  const directorId = req.usuario.id;
  if (!motivo || motivo.trim().length < 5) {
    return res.status(400).json({ error: 'Debes indicar un motivo (mínimo 5 caracteres)' });
  }
  try {
    const solicitud = await pool.query(
      `SELECT sc.*, u.correo, u.nombres, u.apellidos
       FROM solicitud_certificado sc
       JOIN usuario u ON u.id = sc.usuario_id
       WHERE sc.id = $1 AND sc.estado = 'pendiente'`,
      [id]
    );
    if (solicitud.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada o ya procesada' });
    }
    await pool.query(
      `UPDATE solicitud_certificado SET estado = 'rechazado' WHERE id = $1`,
      [id]
    );
    await pool.query(
      `INSERT INTO historial_estado (tipo, entidad_id, estado_anterior, estado_nuevo, motivo, responsable_id)
       VALUES ('certificado', $1, 'pendiente', 'rechazado', $2, $3)`,
      [id, motivo, directorId]
    );
    const usuario = solicitud.rows[0];
    let emailEnviado = false;
    try {
      await enviarCertificadoRechazado(usuario, solicitud.rows[0], motivo);
      emailEnviado = true;
    } catch (emailError) {
      console.error('⚠️ Error al enviar email:', emailError.message);
    }
    res.json({
      mensaje: emailEnviado
        ? 'Certificado rechazado y notificado por email'
        : 'Certificado rechazado (no se pudo enviar el email)',
      emailEnviado,
    });
  } catch (error) {
    console.error('Error al rechazar:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// DESCARGAR PDF DEL CERTIFICADO
// ============================================
const descargarPDF = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.usuario.id;
  const rol = req.usuario.rol;

  try {
    const result = await pool.query(
      `SELECT sc.*, 
              u.nombres, u.apellidos, u.rut, u.direccion,
              j.nombre AS junta_nombre, j.comuna, j.id AS junta_id
       FROM solicitud_certificado sc
       JOIN usuario u ON u.id = sc.usuario_id
       JOIN junta j ON j.id = u.junta_id
       WHERE sc.id = $1 AND sc.estado = 'aprobado'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificado no encontrado o no aprobado' });
    }

    const cert = result.rows[0];

    if (rol !== 'directorio' && cert.usuario_id !== usuarioId) {
      return res.status(403).json({ error: 'No tienes permiso para descargar este certificado' });
    }

    const juntaResult = await pool.query(
      `SELECT * FROM junta WHERE id = $1`,
      [cert.junta_id]
    );
    const directorioResult = await pool.query(
      `SELECT u.nombres, u.apellidos, u.rut, di.cargo
       FROM directorio_integrante di
       JOIN usuario u ON u.id = di.usuario_id
       WHERE di.junta_id = $1 AND di.fecha_fin IS NULL`,
      [cert.junta_id]
    );

    const usuario = {
      nombres: cert.nombres,
      apellidos: cert.apellidos,
      rut: cert.rut,
      direccion: cert.direccion,
    };
    const junta = juntaResult.rows[0];
    const directorio = directorioResult.rows;

    const pdfBuffer = await generarCertificadoPDF(cert, usuario, junta, directorio);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="certificado-${cert.folio}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ error: 'Error al generar el PDF' });
  }
};

module.exports = {
  solicitar,
  misCertificados,
  verificarPorFolio,
  listarPendientes,
  listarTodos,
  aprobar,
  rechazar,
  descargarPDF,
};