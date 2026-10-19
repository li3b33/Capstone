import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActividades, inscribirseActividad } from '../services/api';

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const cargar = () => {
    getActividades().then(res => setActividades(res.data)).finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const handleInscribirse = async (id) => {
    try {
      const res = await inscribirseActividad(id);
      setMensaje(res.data.mensaje);
      setTimeout(() => setMensaje(''), 3000);
      cargar(); // Recargamos para actualizar los cupos
    } catch (error) {
      alert(error.response?.data?.error || 'Error al inscribirse');
    }
  };

  const formatearFecha = (fecha) => new Date(fecha).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Actividades Vecinales</h1>
        <p className="panel-subtitle">Inscríbete en los eventos de la comunidad</p>
        <Link to="/mis-inscripciones" className="btn-primary btn-inline">Ver mis inscripciones</Link>
      </header>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      {cargando ? <p>Cargando...</p> : actividades.length === 0 ? <p className="sin-datos">No hay actividades programadas.</p> : (
        <div className="cards-grid">
          {actividades.map(act => {
            const cupoLleno = act.inscritos >= act.cupo_maximo;
            const disponible = act.estado === 'programada' && !cupoLleno;

            return (
              <div key={act.id} className="card" style={{ cursor: 'default' }}>
                <h3>{act.titulo}</h3>
                <p style={{ marginBottom: '1rem' }}>{act.descripcion}</p>
                
                <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem' }}>
                  <p>📍 <strong>Lugar:</strong> {act.lugar}</p>
                  <p>🗓️ <strong>Fecha:</strong> {formatearFecha(act.fecha_hora)}</p>
                  <p>👥 <strong>Cupos:</strong> {act.inscritos} / {act.cupo_maximo}</p>
                </div>

                {act.estado === 'cancelada' ? (
                  <span className="badge badge-danger">Cancelada</span>
                ) : cupoLleno ? (
                  <span className="badge badge-warning">Cupo Lleno</span>
                ) : (
                  <button className="btn-primary btn-block" onClick={() => handleInscribirse(act.id)}>
                    Inscribirme
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Actividades;