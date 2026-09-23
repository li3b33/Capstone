import { Link } from 'react-router-dom';
import Card from '../components/Card';

function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <h1>Bienvenido a la Junta de Vecinos</h1>
        <p>
          Sistema de gestión para la unidad territorial. Realiza trámites,
          revisa noticias y participa en las actividades de tu comunidad.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">Inscribirme</Link>
          <Link to="/login" className="btn-secondary">Iniciar sesión</Link>
        </div>
      </section>

      {/* Servicios */}
      <section className="servicios">
        <h2>¿Qué puedes hacer?</h2>
        <div className="cards-grid">
          <Card
            icono="📄"
            titulo="Certificados de residencia"
            descripcion="Solicita tu certificado de residencia de forma online y recíbelo en tu correo."
          />
          <Card
            icono="📋"
            titulo="Postular proyectos"
            descripcion="Presenta ideas para mejorar tu barrio y súmalas al presupuesto participativo."
          />
          <Card
            icono="🏟️"
            titulo="Reservar espacios"
            descripcion="Solicita la cancha, la sede o la plaza para tus actividades comunitarias."
          />
          <Card
            icono="📢"
            titulo="Avisos y noticias"
            descripcion="Mantente informado sobre las novedades y eventos de la junta de vecinos."
          />
        </div>
      </section>

      {/* Noticias recientes */}
      <section className="noticias">
        <h2>Últimas noticias</h2>
        <div className="cards-grid">
          <article className="noticia-card">
            <h3>Nueva directiva 2024-2026</h3>
            <p>En asamblea general se eligió la nueva directiva de la junta.</p>
            <small>20 de enero, 2024</small>
          </article>
          <article className="noticia-card">
            <h3>Proyecto de áreas verdes aprobado</h3>
            <p>El proyecto de mejoramiento de áreas verdes fue aprobado.</p>
            <small>1 de febrero, 2024</small>
          </article>
          <article className="noticia-card">
            <h3>Taller de reciclaje</h3>
            <p>Ya están abiertas las inscripciones para el taller de reciclaje.</p>
            <small>5 de marzo, 2024</small>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;