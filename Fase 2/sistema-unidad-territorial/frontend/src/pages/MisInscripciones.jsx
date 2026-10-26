import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMisInscripciones, cancelarInscripcionActividad } from '../services/api';
import AlertModal from '../components/AlertModal';

function MisInscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeExito, setMensajeExito] = useState('');
  
  // Estados para el modal
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'alert', title: '', message: '', idToDelete: null });

  const cargar = () => {
    getMisInscripciones()
      .then(res => setInscripciones(res.data))
      .finally(() => setCargando(false));
  };

  useEffect(() => { cargar(); }, []);

  // Abre el modal de confirmación
  const handleCancelarClick = (id) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: '¿Cancelar inscripción?',
      message: 'El cupo quedará libre para otro vecino. Esta acción no se puede deshacer y no podrás volver a inscribirte en esta actividad.',
      idToDelete: id
    });
  };

  // Se ejecuta al confirmar en el modal
  const confirmarCancelacion = async () => {
    try {
      await cancelarInscripcionActividad(modalConfig.idToDelete);
      setModalConfig({ isOpen: false }); // Cerramos modal
      setMensajeExito('Inscripción cancelada exitosamente. El cupo ha sido liberado.');
      setTimeout(() => setMensajeExito(''), 4000);
      cargar(); // Recargamos la lista
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error.response?.data?.error || 'Error al cancelar la inscripción',
      });
    }
  };

  const formatearFecha = (fecha) => new Date(fecha).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className="panel">
      <header className="panel-header">
        <Link to="/actividades" className="btn-volver">← Volver a actividades</Link>
        <h1>Mis Inscripciones</h1>
        <p className="panel-subtitle">Eventos y talleres en los que estás participando</p>
      </header>

      {mensajeExito && <div className="alert alert-success" role="status">{mensajeExito}</div>}

      {cargando ? <p>Cargando...</p> : inscripciones.length === 0 ? (
        <p className="sin-datos">No estás inscrito en ninguna actividad.</p>
      ) : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Fecha y Hora</th>
                <th>Lugar</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((ins, i) => (
                <tr key={i}>
                  <td><strong>{ins.titulo}</strong></td>
                  <td>{formatearFecha(ins.fecha_hora)}</td>
                  <td>{ins.lugar}</td>
                  <td>
                    <span className={`badge badge-${ins.estado === 'inscrito' ? 'success' : 'danger'}`}>
                      {ins.estado}
                    </span>
                  </td>
                  <td>
                    {ins.estado === 'inscrito' && (
                      <button 
                        className="btn-accion btn-rechazar" 
                        onClick={() => handleCancelarClick(ins.actividad_id)}
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL REUTILIZABLE */}
      <AlertModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.type === 'confirm' ? confirmarCancelacion : () => setModalConfig({ isOpen: false })}
        onCancel={() => setModalConfig({ isOpen: false })}
        confirmText={modalConfig.type === 'confirm' ? 'Sí, cancelar' : 'Entendido'}
      />
    </div>
  );
}

export default MisInscripciones;  