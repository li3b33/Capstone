import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

function PanelVecino() {
  const { usuario } = useAuth();

  if (!usuario) return <p>Debes iniciar sesión.</p>;

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Hola, {usuario.nombres} 👋</h1>
        <p className="panel-subtitle">
          Bienvenido a tu panel de vecino. Tu cuenta está: <span className="badge badge-success">{usuario.estado}</span>
        </p>
      </header>

      <section className="panel-seccion">
        <h2>¿Qué trámite necesitas hacer hoy?</h2>
        <div className="cards-grid">
          <Link to="/solicitar-certificado" className="card-link">
            <Card icono="📄" titulo="Solicitar certificado" descripcion="Pide tu certificado de residencia." />
          </Link>
          <Link to="/postular-proyecto" className="card-link">
            <Card icono="📋" titulo="Postular proyecto" descripcion="Presenta una idea para tu barrio." />
          </Link>
          <Link to="/reservar-espacio" className="card-link">
            <Card icono="🏟️" titulo="Reservar espacio" descripcion="Solicita la cancha o la sede social." />
          </Link>
          <Link to="/actividades" className="card-link">
            <Card icono="🎉" titulo="Ver actividades" descripcion="Inscríbete en eventos comunitarios." />
          </Link>
        </div>
      </section>

      <div className="alert" style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' }}>
        💡 <strong>Recuerda:</strong> Puedes revisar el estado de tus solicitudes, proyectos y reservas desde el menú de la izquierda.
      </div>
    </div>
  );
}

export default PanelVecino;