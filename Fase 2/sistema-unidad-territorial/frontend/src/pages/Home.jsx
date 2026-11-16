import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNoticias } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { usuario } = useAuth();
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para controlar la noticia que se está viendo en el modal
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  useEffect(() => {
    getNoticias()
      .then((res) => setNoticias(res.data))
      .catch((err) => console.error("Error al cargar noticias:", err))
      .finally(() => setCargando(false));
  }, []);

  const formatearFecha = (fecha) => new Date(fecha).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });

  const obtenerUrlImagen = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads')) return `http://localhost:3000${url}`;
    return url;
  };

  return (
    <div className="home">
      {/* CABECERA DINÁMICA */}
      <header className="panel-header" style={{ borderBottom: 'none', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{usuario ? `Hola, ${usuario.nombres} 👋` : 'Bienvenido a la Junta de Vecinos'}</h1>
          <p className="panel-subtitle">
            {usuario ? 'Este es el muro de noticias de tu comunidad.' : 'Mantente al día con las últimas novedades de tu barrio.'}
          </p>
        </div>
        
        {!usuario && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className="btn-primary">Iniciar Sesión</Link>
            <Link to="/register" className="btn-secondary">Registrarse</Link>
          </div>
        )}
        {usuario?.rol === 'directorio' && (
          <Link to="/gestion-noticias" className="btn-secondary">+ Publicar noticia</Link>
        )}
      </header>

      {/* LISTA DE NOTICIAS */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-hover)', marginBottom: '1.5rem' }}>Últimas Noticias</h2>
        
        {cargando ? (
          <p>Cargando noticias...</p>
        ) : noticias.length === 0 ? (
          <div className="alert" style={{ background: '#FDFBF7', color: '#64748b' }}>No hay noticias publicadas aún.</div>
        ) : (
          <div className="cards-grid">
            {noticias.map((n) => {
              const imagenSrc = obtenerUrlImagen(n.imagen_url);
              return (
                // Al hacer clic en la tarjeta, se guarda la noticia y se abre el modal
                <article key={n.id} className="card" onClick={() => setNoticiaSeleccionada(n)}>
                  {imagenSrc && (
                    <img 
                      src={imagenSrc} 
                      alt={n.titulo} 
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} 
                    />
                  )}
                  <h3>{n.titulo}</h3>
                  <p>{n.contenido.substring(0, 100)}...</p>
                  <div className="card-footer">
                    <span>{formatearFecha(n.fecha_publicacion)}</span>
                    <span>Leer más →</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DE NOTICIA COMPLETA */}
      {noticiaSeleccionada && (
        <div className="modal-overlay" onClick={() => setNoticiaSeleccionada(null)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Escape' && setNoticiaSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} role="button" tabIndex={0} onKeyDown={(e) => e.stopPropagation()} style={{ maxWidth: '700px', backgroundColor: '#FDFBF7' }}>
            <button className="modal-close" onClick={() => setNoticiaSeleccionada(null)}>×</button>
            
            {obtenerUrlImagen(noticiaSeleccionada.imagen_url) && (
              <img 
                src={obtenerUrlImagen(noticiaSeleccionada.imagen_url)} 
                alt={noticiaSeleccionada.titulo} 
                style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }} 
              />
            )}
            
            <h2 style={{ color: 'var(--primary-hover)', marginBottom: '0.5rem' }}>{noticiaSeleccionada.titulo}</h2>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem', borderBottom: '1px solid #D1D5DB', paddingBottom: '1rem' }}>
              Publicado el {formatearFecha(noticiaSeleccionada.fecha_publicacion)} por <strong>{noticiaSeleccionada.autor_nombres} {noticiaSeleccionada.autor_apellidos}</strong>
            </p>
            
            {/* Texto completo con saltos de línea respetados */}
            <div style={{ whiteSpace: 'pre-wrap', color: '#374151', lineHeight: '1.6', fontSize: '1rem' }}>
              {noticiaSeleccionada.contenido}
            </div>
            
            <div className="modal-acciones" style={{ marginTop: '2rem' }}>
              <button className="btn-cerrar-modal" onClick={() => setNoticiaSeleccionada(null)}>Cerrar lectura</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;