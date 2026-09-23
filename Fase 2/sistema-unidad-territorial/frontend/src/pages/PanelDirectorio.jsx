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
          <Card icono="👥" titulo="Vecinos por aprobar" descripcion="1 solicitud pendiente" />
          <Card icono="📄" titulo="Certificados por emitir" descripcion="2 solicitudes" />
          <Card icono="📋" titulo="Proyectos por revisar" descripcion="1 en revisión" />
          <Card icono="🏟️" titulo="Reservas por aprobar" descripcion="2 solicitudes" />
        </div>
      </section>

      <section className="panel-seccion">
        <h2>Gestión</h2>
        <div className="cards-grid">
          <Card icono="📢" titulo="Crear aviso" descripcion="Notificar a los vecinos" />
          <Card icono="📰" titulo="Crear noticia" descripcion="Publicar en el sitio" />
          <Card icono="📊" titulo="Historial" descripcion="Ver trazabilidad" />
          <Card icono="⚙️" titulo="Configuración" descripcion="Datos de la junta" />
        </div>
      </section>
    </div>
  );
}

export default PanelDirectorio;