import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

function PanelVecino() {
  const { usuario } = useAuth();

  // Si por alguna razón no hay usuario (no debería pasar si está logueado)
  if (!usuario) {
    return (
      <div className="panel">
        <p>Debes iniciar sesión para ver tu panel.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <header className="panel-header">
        <div>
          <h1>Hola, {usuario.nombres} {usuario.apellidos}</h1>
          <p className="panel-subtitle">
            Bienvenido a tu panel de vecino. Estado:{' '}
            <span className={`badge badge-${usuario.estado === 'activo' ? 'success' : 'warning'}`}>
              {usuario.estado}
            </span>
          </p>
        </div>
      </header>

      <section className="panel-seccion">
        <h2>Trámites</h2>
        <div className="cards-grid">
          <Card icono="📄" titulo="Solicitar certificado" descripcion="Pide tu certificado de residencia." />
          <Card icono="📋" titulo="Postular proyecto" descripcion="Presenta una idea para tu barrio." />
          <Card icono="🏟️" titulo="Reservar espacio" descripcion="Cancha, sede o plaza." />
          <Card icono="🎉" titulo="Inscribirme en actividad" descripcion="Eventos y talleres con cupo." />
        </div>
      </section>

      <section className="panel-seccion">
        <h2>Mis solicitudes</h2>
        <div className="cards-grid">
          <Card icono="📑" titulo="Mis certificados" descripcion="3 emitidos" />
          <Card icono="📁" titulo="Mis proyectos" descripcion="2 postulados" />
          <Card icono="📅" titulo="Mis reservas" descripcion="1 activa" />
          <Card icono="🔔" titulo="Notificaciones" descripcion="2 sin leer" />
        </div>
      </section>
    </div>
  );
}

export default PanelVecino;