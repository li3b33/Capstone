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
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al revisar');
    }
  };

  const handleAprobar = async (id) => {
    if (!confirm('¿Aprobar este proyecto? Se enviará un correo al vecino.')) return;
    try {
      const res = await aprobarProyecto(id);
      setMensaje(res.data.mensaje);
      setTimeout(() => setMensaje(''), 4000);
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
    if (!monto) return '—';
    return '$' + Number(monto).toLocaleString('es-CL');
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <Link to="/panel-directorio" className="btn-volver">← Volver al panel</Link>
        <h1>Gestión de Proyectos</h1>
        <p className="panel-subtitle">Revisa, aprueba o rechaza los proyectos vecinales</p>
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
                <th>Título</th>
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
                  <td>{p.titulo}</td>
                  <td>{p.nombres} {p.apellidos}</td>
                  <td>{formatearMonto(p.presupuesto_estimado)}</td>
                  <td>{formatearFecha(p.fecha_postulacion)}</td>
                  <td><span className={getBadgeClass(p.estado)}>{p.estado}</span></td>
                  <td className="acciones">
                    {p.estado === 'recibido' && (
                      <button className="btn-accion btn-revisar" onClick={() => handleRevisar(p.id)}>
                        🔍 Revisar
                      </button>
                    )}
                    {(p.estado === 'recibido' || p.estado === 'en_revision') && (
                      <>
                        <button className="btn-accion btn-aprobar" onClick={() => handleAprobar(p.id)}>✓ Aprobar</button>
                        <button className="btn-accion btn-rechazar" onClick={() => handleRechazar(p.id)}>✗ Rechazar</button>
                      </>
                    )}
                    {p.estado === 'aprobado' && <span className="texto-info">✓ Aprobado</span>}
                    {p.estado === 'rechazado' && <span className="texto-error">✗ Rechazado</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GestionProyectos;