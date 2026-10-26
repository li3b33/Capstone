import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNoticias } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { usuario } = useAuth();
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getNoticias()
      .then((res) => setNoticias(res.data))
      .catch((err) => console.error("Error al cargar noticias:", err))
      .finally(() => setCargando(false));
  }, []);

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

  // Función para obtener la URL correcta de la imagen
  const obtenerUrlImagen = (url) => {
    if (!url) return null;
    // Si la imagen fue subida a nuestro backend (empieza con /uploads)
    if (url.startsWith('/uploads')) {
      return `http://localhost:3000${url}`;
    }
    // Si es una URL externa antigua
    return url;
  };

  return (
    <div className="home">
      {/* CABECERA DINÁMICA */}
      <header className="panel-header" style={{ borderBottom: 'none', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{usuario ? `Hola, ${usuario.nombres} 👋` : 'Bienvenido a la Junta de Vecinos'}</h1>
          <p className="panel-subtitle">
            {usuario 
              ? 'Este es el muro de noticias de tu comunidad.' 
              : 'Mantente al día con las últimas novedades de tu barrio.'}
          </p>
        </div>
        
        {/* Si NO hay usuario, mostramos botones de login/registro a la derecha */}
        {!usuario && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn-primary">Iniciar Sesión</Link>
            <Link to="/register" className="btn-secondary">Registrarse</Link>
          </div>
        )}

        {/* Si HAY usuario y es director, mostramos botón para publicar */}
        {usuario?.rol === 'directorio' && (
          <Link to="/gestion-noticias" className="btn-secondary">
            + Publicar noticia
          </Link>
        )}
      </header>

      {/* LISTA DE NOTICIAS */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', color: '#1e3a8a', marginBottom: '1.5rem' }}>Últimas Noticias</h2>
        
        {cargando ? (
          <p>Cargando noticias...</p>
        ) : noticias.length === 0 ? (
          <div className="alert" style={{ background: '#f8fafc', color: '#64748b' }}>
            No hay noticias publicadas aún.
          </div>
        ) : (
          <div className="cards-grid">
            {noticias.map((n) => {
              const imagenSrc = obtenerUrlImagen(n.imagen_url);

              return (
                <article key={n.id} className="card" style={{ cursor: 'default', display: 'flex', flexDirection: 'column' }}>
                  {/* Mostrar imagen si existe */}
                  {imagenSrc && (
                    <img 
                      src={imagenSrc} 
                      alt={n.titulo} 
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} 
                    />
                  )}
                  
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1e3a8a' }}>{n.titulo}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', flex: 1, whiteSpace: 'pre-wrap' }}>{n.contenido}</p>
                  
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', fontSize: '0.8rem', color: '#9ca3af', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{formatearFecha(n.fecha_publicacion)}</span>
                    <span>Por: {n.autor_nombres}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;