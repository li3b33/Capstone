import { Link } from 'react-router-dom';
import Card from '../components/Card';

function PanelDirectorio() {
  return (
    <div className="panel">
      <header className="panel-header">
        <div>
          <h1>Panel del Directorio</h1>
          <p className="panel-subtitle">Gestión de la junta de vecinos</p>
        </div>
      </header>

      <section className="panel-seccion">
        <h2>Pendientes</h2>
        <div className="cards-grid">
          <Link to="/gestion-vecinos" className="card-link">
            <Card icono="👥" titulo="Vecinos por aprobar" descripcion="Ver y gestionar inscripciones" />
          </Link>
          <Link to="/gestion-certificados" className="card-link">
            <Card icono="📄" titulo="Certificados por emitir" descripcion="Revisar solicitudes" />
          </Link>
          <Link to="/gestion-proyectos" className="card-link">
            <Card icono="📋" titulo="Proyectos por revisar" descripcion="Ver y gestionar" />
          </Link>
          <Link to="/gestion-reservas" className="card-link">
            <Card icono="🏟️" titulo="Reservas por aprobar" descripcion="Revisar solicitudes" />
          </Link>
        </div>
      </section>

      <section className="panel-seccion">
        <h2>Gestión</h2>
        <div className="cards-grid">
          <Link to="/gestion-actividades" className="card-link">
            <Card icono="🎉" titulo="Gestionar actividades" descripcion="Crear, editar y eliminar actividades" />
          </Link>
          <Link to="/gestion-noticias" className="card-link">
            <Card icono="📰" titulo="Crear noticia" descripcion="Publicar en el sitio" />
          </Link>
          <Card icono="📊" titulo="Historial" descripcion="Ver trazabilidad" />
          <Card icono="⚙️" titulo="Configuración" descripcion="Datos de la junta" />
        </div>
      </section>
    </div>
  );
}

export default PanelDirectorio;