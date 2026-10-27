import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActividades, inscribirseActividad } from '../services/api';
import AlertModal from '../components/AlertModal';

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para controlar el modal (reemplaza a los alert nativos)
  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    type: 'alert', 
    title: '', 
    message: '' 
  });

  const cargar = () => {
    getActividades()
      .then(res => setActividades(res.data))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  const handleInscribirse = async (id) => {
    try {
      const res = await inscribirseActividad(id);
      
      // Mostrar éxito en el modal
      setModalConfig({
        isOpen: true,
        type: 'alert',
        title: '¡Inscripción exitosa!',
        message: res.data.mensaje
      });
      
      cargar(); // Recargamos para actualizar los cupos
    } catch (error) {
      // Mostrar error (ej: ya está lleno, o canceló previamente) en el modal
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'No se pudo inscribir',
        message: error.response?.data?.error || 'Error al procesar la inscripción'
      });
    }
  };

  const formatearFecha = (fecha) => new Date(fecha).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className="panel">
      <header className="panel-header">
        <Link to="/panel-vecino" className="btn-volver">← Volver al panel</Link>
        <h1>Actividades Vecinales</h1>
        <p className="panel-subtitle">Inscríbete en los eventos de la comunidad</p>
        <Link to="/mis-inscripciones" className="btn-secondary btn-inline">Ver mis inscripciones</Link>
      </header>

      {cargando ? <p>Cargando...</p> : actividades.length === 0 ? <p className="sin-datos">No hay actividades programadas.</p> : (
        <div className="cards-grid">
          {actividades.map(act => {
            const cupoLleno = act.inscritos >= act.cupo_maximo;
            const disponible = act.estado === 'programada' && !cupoLleno;

            return (
              <div key={act.id} className="card" style={{ cursor: 'default', display: 'flex', flexDirection: 'column' }}>
                <h3>{act.titulo}</h3>
                <p style={{ marginBottom: '1rem', flex: 1 }}>{act.descripcion}</p>
                
                <div style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '6px' }}>
                  <p style={{ marginBottom: '0.3rem' }}>📍 <strong>Lugar:</strong> {act.lugar}</p>
                  <p style={{ marginBottom: '0.3rem' }}>🗓️ <strong>Fecha:</strong> {formatearFecha(act.fecha_hora)}</p>
                  <p>👥 <strong>Cupos:</strong> {act.inscritos} / {act.cupo_maximo}</p>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  {act.estado === 'cancelada' ? (
                    <span className="badge badge-danger" style={{ display: 'block', textAlign: 'center', padding: '0.5rem' }}>Actividad Cancelada</span>
                  ) : cupoLleno ? (
                    <span className="badge badge-warning" style={{ display: 'block', textAlign: 'center', padding: '0.5rem' }}>Cupo Lleno</span>
                  ) : (
                    <button 
                      className="btn-primary" 
                      style={{ width: '100%' }} 
                      onClick={() => handleInscribirse(act.id)}
                    >
                      Inscribirme
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL REUTILIZABLE PARA MENSAJES */}
      <AlertModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={() => setModalConfig({ isOpen: false })}
        confirmText="Entendido"
      />
    </div>
  );
}

export default Actividades;