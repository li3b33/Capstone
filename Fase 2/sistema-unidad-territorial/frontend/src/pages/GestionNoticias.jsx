import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNoticias, crearNoticia, eliminarNoticia } from '../services/api';

function GestionNoticias() {
  const [noticias, setNoticias] = useState([]);
  // Quitamos 'imagen_url' del estado y agregamos 'imagen' (el archivo)
  const [form, setForm] = useState({ titulo: '', contenido: '' });
  const [imagen, setImagen] = useState(null); 
  
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const cargar = () => {
    getNoticias().then(res => setNoticias(res.data));
  };

  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setExito('');
    
    try {
      // Creamos el FormData para empaquetar los textos y el archivo
      const formData = new FormData();
      formData.append('titulo', form.titulo);
      formData.append('contenido', form.contenido);
      if (imagen) {
        formData.append('imagen', imagen);
      }

      await crearNoticia(formData);
      setExito('Noticia publicada exitosamente');
      setForm({ titulo: '', contenido: '' });
      setImagen(null); // Limpiamos el archivo
      
      // Limpiar el input file visualmente
      document.getElementById('input-imagen').value = '';
      
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la noticia');
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta noticia?')) return;
    try {
      await eliminarNoticia(id);
      cargar();
    } catch (err) {
      alert('Error al eliminar la noticia');
    }
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <Link to="/panel-directorio" className="btn-volver">← Volver al panel</Link>
        <h1>Gestión de Noticias</h1>
        <p className="panel-subtitle">Publica novedades para que todos los vecinos las vean en el inicio</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="certificado-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
        <h2>Publicar Nueva Noticia</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Título de la noticia *</label>
            <input required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ej: Nueva directiva electa" />
          </div>
          <div className="form-group">
            <label>Contenido *</label>
            <textarea required rows="4" value={form.contenido} onChange={e => setForm({...form, contenido: e.target.value})} placeholder="Escribe los detalles aquí..."></textarea>
          </div>
          <div className="form-group">
            <label>Imagen de la noticia (Opcional)</label>
            <input 
              id="input-imagen"
              type="file" 
              accept="image/*" 
              onChange={e => setImagen(e.target.files[0])} 
              style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '8px' }}
            />
            <small style={{ color: '#6b7280', marginTop: '0.2rem' }}>Sube un archivo JPG o PNG.</small>
          </div>
          <button type="submit" className="btn-primary">Publicar Noticia</button>
        </form>
      </div>

      <h2>Noticias Publicadas</h2>
      <div className="tabla-container">
        <table className="tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {noticias.map(n => (
              <tr key={n.id}>
                <td>{n.titulo}</td>
                <td>{n.autor_nombres} {n.autor_apellidos}</td>
                <td>{new Date(n.fecha_publicacion).toLocaleDateString('es-CL')}</td>
                <td>
                  <button className="btn-accion btn-rechazar" onClick={() => handleEliminar(n.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GestionNoticias;