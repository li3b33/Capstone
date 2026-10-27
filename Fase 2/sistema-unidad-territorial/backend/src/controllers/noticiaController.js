const pool = require('../config/db');

// ============================================
// OBTENER TODAS LAS NOTICIAS (Público)
// ============================================
const listarNoticias = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT n.id, n.titulo, n.contenido, n.imagen_url, n.fecha_publicacion,
              u.nombres AS autor_nombres, u.apellidos AS autor_apellidos
       FROM noticia n
       JOIN usuario u ON u.id = n.autor_id
       ORDER BY n.fecha_publicacion DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar noticias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// CREAR NOTICIA (Solo Directorio)
// ============================================
const crearNoticia = async (req, res) => {
  const { titulo, contenido } = req.body;
  const autorId = req.usuario.id;

  if (!titulo || !contenido) {
    return res.status(400).json({ error: 'El título y el contenido son obligatorios' });
  }

  try {
    // Si el usuario subió una imagen, guardamos su ruta en la base de datos
    let imagenUrl = null;
    if (req.file) {
      imagenUrl = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `INSERT INTO noticia (junta_id, autor_id, titulo, contenido, imagen_url)
       VALUES (1, $1, $2, $3, $4)
       RETURNING id, titulo, fecha_publicacion`,
      [autorId, titulo, contenido, imagenUrl]
    );
    
    res.status(201).json({ mensaje: 'Noticia publicada exitosamente', noticia: result.rows[0] });
  } catch (error) {
    console.error('Error al crear noticia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// ELIMINAR NOTICIA (Solo Directorio)
// ============================================
const eliminarNoticia = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM noticia WHERE id = $1', [id]);
    res.json({ mensaje: 'Noticia eliminada' });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { listarNoticias, crearNoticia, eliminarNoticia };