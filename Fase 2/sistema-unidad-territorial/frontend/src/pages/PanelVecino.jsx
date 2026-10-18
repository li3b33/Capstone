import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

function PanelVecino() {
  const { usuario } = useAuth();

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
          <h1>Hola, {usuario.nombres} {usuario.apellidos} 👋</h1>
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
          <Link to="/solicitar-certificado" className="card-link">
            <Card icono="📄" titulo="Solicitar certificado" descripcion="Pide tu certificado de residencia." />
          </Link>
          <Link to="/postular-proyecto" className="card-link">
            <Card icono="📋" titulo="Postular proyecto" descripcion="Presenta una idea para tu barrio." />
          </Link>
          <Card icono="🏟️" titulo="Reservar espacio" descripcion="Cancha, sede o plaza." />
          <Card icono="🎉" titulo="Inscribirme en actividad" descripcion="Eventos y talleres con cupo." />
        </div>
      </section>

      <section className="panel-seccion">
        <h2>Mis solicitudes</h2>
        <div className="cards-grid">
          <Link to="/mis-certificados" className="card-link">
            <Card icono="📑" titulo="Mis certificados" descripcion="Ver historial" />
          </Link>
          <Link to="/mis-proyectos" className="card-link">
            <Card icono="📁" titulo="Mis proyectos" descripcion="Ver historial" />
          </Link>
          <Card icono="📅" titulo="Mis reservas" descripcion="1 activa" />
          <Card icono="🔔" titulo="Notificaciones" descripcion="2 sin leer" />
        </div>
      </section>
    </div>
  );
}

export default PanelVecino;