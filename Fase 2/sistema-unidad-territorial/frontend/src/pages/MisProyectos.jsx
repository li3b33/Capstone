import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMisProyectos } from '../services/api';

function MisProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const res = await getMisProyectos();
        if (activo) setProyectos(res.data);
      } catch (error) {
        console.error('Error al cargar proyectos:', error);
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'aprobado': return 'badge badge-success';
      case 'recibido': return 'badge badge-warning';
      case 'en_revision': return 'badge badge-info';
      case 'rechazado': return 'badge badge-danger';
      default: return 'badge';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const formatearMonto = (monto) => {
    if (!monto) return '—';
    return '$' + Number(monto).toLocaleString('es-CL');
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <Link to="/panel-vecino" className="btn-volver">← Volver al panel</Link>
        <h1>Mis Proyectos</h1>
        <p className="panel-subtitle">Historial de proyectos postulados</p>
        <Link to="/postular-proyecto" className="btn-primary btn-inline">
          + Postular nuevo proyecto
        </Link>
      </header>

      {cargando ? (
        <p>Cargando...</p>
      ) : proyectos.length === 0 ? (
        <div className="sin-datos">
          <p>Aún no has postulado ningún proyecto.</p>
          <Link to="/postular-proyecto" className="btn-primary">
            Postular mi primer proyecto
          </Link>
        </div>
      ) : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>Título</th>
                <th>Presupuesto</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <tr key={p.id}>
                  <td>{p.titulo}</td>
                  <td>{formatearMonto(p.presupuesto_estimado)}</td>
                  <td>{formatearFecha(p.fecha_postulacion)}</td>
                  <td><span className={getBadgeClass(p.estado)}>{p.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MisProyectos;