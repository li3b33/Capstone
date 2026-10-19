import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  getTodosProyectos,
  revisarProyecto,
  aprobarProyecto,
  rechazarProyecto,
} from '../services/api';

function GestionProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [filtro, setFiltro] = useState('recibido');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  
  // Estado para controlar el modal
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);

  const cargar = useCallback(async () => {
    setError('');
    try {
      const res = await getTodosProyectos(filtro === 'todos' ? null : filtro);
      setProyectos(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar proyectos');
    }
  }, [filtro]);

  useEffect(() => {
    let activo = true;
    const cargarConEstado = async () => {
      setCargando(true);
      try {
        await cargar();
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargarConEstado();
    return () => {
      activo = false;
    };
  }, [cargar]);

  const handleRevisar = async (id) => {
    try {
      await revisarProyecto(id);
      setMensaje('Proyecto marcado en revisión');
      setTimeout(() => setMensaje(''), 3000);
      setProyectoSeleccionado(null); // Cerramos el modal si estaba abierto
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al revisar');
    }
  };

  const handleAprobar = async (id) => {
    const presupuesto = prompt('Ingresa el presupuesto estimado (en CLP) para aprobar este proyecto:');
    
    if (presupuesto === null) return;
    if (!presupuesto || isNaN(presupuesto) || parseInt(presupuesto) <= 0) {
      alert('Debes ingresar un número válido mayor a 0');
      return;
    }

    try {
      const res = await aprobarProyecto(id, parseInt(presupuesto, 10));
      setMensaje(res.data.mensaje);
      setTimeout(() => setMensaje(''), 4000);
      setProyectoSeleccionado(null);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al aprobar');
    }
  };

  const handleRechazar = async (id) => {
    const motivo = prompt('Motivo del rechazo (obligatorio, mínimo 5 caracteres):');
    if (!motivo || motivo.trim().length < 5) {
      alert('El motivo es obligatorio y debe tener al menos 5 caracteres');
      return;
    }
    try {
      const res = await rechazarProyecto(id, motivo);
      setMensaje(res.data.mensaje);
      setTimeout(() => setMensaje(''), 4000);
      setProyectoSeleccionado(null);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al rechazar');
    }
  };

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
    if (!monto) return 'Por estimar';
    return '$' + Number(monto).toLocaleString('es-CL');
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Gestión de Proyectos</h1>
        <p className="panel-subtitle">Revisa las ideas de los vecinos y asígnales un presupuesto</p>
      </header>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <div className="filtros">
        {['recibido', 'en_revision', 'aprobado', 'rechazado', 'todos'].map((f) => (
          <button
            key={f}
            className={filtro === f ? 'btn-filtro active' : 'btn-filtro'}
            onClick={() => setFiltro(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : proyectos.length === 0 ? (
        <p className="sin-datos">No hay proyectos en este estado.</p>
      ) : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>Propuesta</th>
                <th>Vecino</th>
                <th>Presupuesto</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proyectos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.titulo}</strong>
                  </td>
                  <td>{p.nombres} {p.apellidos}</td>
                  <td>{formatearMonto(p.presupuesto_estimado)}</td>
                  <td>{formatearFecha(p.fecha_postulacion)}</td>
                  <td><span className={getBadgeClass(p.estado)}>{p.estado}</span></td>
                  <td className="acciones">
                    <button className="btn-accion btn-revisar" onClick={() => setProyectoSeleccionado(p)}>
                      👁️ Leer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE LECTURA DE PROPUESTA */}
      {proyectoSeleccionado && (
        <div className="modal-overlay" onClick={() => setProyectoSeleccionado(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setProyectoSeleccionado(null)}>×</button>
            
            <h2>{proyectoSeleccionado.titulo}</h2>
            
            <div className="modal-info">
              <p><strong>Propuesto por:</strong> {proyectoSeleccionado.nombres} {proyectoSeleccionado.apellidos} ({proyectoSeleccionado.rut})</p>
              <p><strong>Fecha de postulación:</strong> {formatearFecha(proyectoSeleccionado.fecha_postulacion)}</p>
              <p><strong>Presupuesto sugerido por el vecino:</strong> {formatearMonto(proyectoSeleccionado.presupuesto_estimado)}</p>
              <p><strong>Estado actual:</strong> <span className={getBadgeClass(proyectoSeleccionado.estado)}>{proyectoSeleccionado.estado}</span></p>
            </div>

            <h3 style={{ color: '#1e3a8a', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Descripción de la idea:</h3>
            <div className="modal-descripcion">
              {proyectoSeleccionado.descripcion}
            </div>

            {/* Acciones dentro del modal (solo si está pendiente) */}
            {(proyectoSeleccionado.estado === 'recibido' || proyectoSeleccionado.estado === 'en_revision') && (
              <div className="modal-acciones">
                {proyectoSeleccionado.estado === 'recibido' && (
                  <button className="btn-accion btn-revisar" style={{ flex: 1, padding: '0.75rem' }} onClick={() => handleRevisar(proyectoSeleccionado.id)}>
                    🔍 Marcar en revisión
                  </button>
                )}
                <button className="btn-accion btn-aprobar" style={{ flex: 1, padding: '0.75rem' }} onClick={() => handleAprobar(proyectoSeleccionado.id)}>
                  ✓ Aprobar
                </button>
                <button className="btn-accion btn-rechazar" style={{ flex: 1, padding: '0.75rem' }} onClick={() => handleRechazar(proyectoSeleccionado.id)}>
                  ✗ Rechazar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionProyectos;