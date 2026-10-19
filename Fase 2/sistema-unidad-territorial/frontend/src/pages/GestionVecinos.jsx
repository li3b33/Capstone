import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getVecinos, cambiarEstadoUsuario } from '../services/api';

function GestionVecinos() {
  const [vecinos, setVecinos] = useState([]);
  const [filtro, setFiltro] = useState('pendiente');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const cargarVecinos = useCallback(async () => {
    try {
      const res = await getVecinos(filtro === 'todos' ? null : filtro);
      setVecinos(res.data);
    } catch (error) {
      console.error('Error al cargar vecinos:', error);
    }
  }, [filtro]);

  useEffect(() => {
    let activo = true;
    const cargarConEstado = async () => {
      setCargando(true);
      try {
        await cargarVecinos();
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargarConEstado();
    return () => {
      activo = false;
    };
  }, [cargarVecinos]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const motivo = nuevoEstado === 'rechazado'
      ? prompt('Motivo del rechazo (obligatorio):')
      : null;

    if (nuevoEstado === 'rechazado' && !motivo) return;

    try {
      await cambiarEstadoUsuario(id, nuevoEstado, motivo);
      setMensaje(`Usuario ${nuevoEstado === 'activo' ? 'activado' : 'rechazado'} correctamente`);
      setTimeout(() => setMensaje(''), 3000);
      cargarVecinos();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al cambiar estado');
    }
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'activo': return 'badge badge-success';
      case 'pendiente': return 'badge badge-warning';
      case 'rechazado': return 'badge badge-danger';
      case 'baja': return 'badge badge-secondary';
      default: return 'badge';
    }
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <div>
          <h1>Gestión de Vecinos</h1>
          <p className="panel-subtitle">Aprueba, rechaza o gestiona las inscripciones</p>
        </div>
      </header>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}

      <div className="filtros">
        {['pendiente', 'activo', 'rechazado', 'todos'].map((f) => (
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
      ) : vecinos.length === 0 ? (
        <p className="sin-datos">No hay vecinos en este estado.</p>
      ) : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vecinos.map((v) => (
                <tr key={v.id}>
                  <td>{v.rut}</td>
                  <td>{v.nombres} {v.apellidos}</td>
                  <td>{v.correo}</td>
                  <td>{v.telefono || '—'}</td>
                  <td><span className={getBadgeClass(v.estado)}>{v.estado}</span></td>
                  <td className="acciones">
                    {v.estado === 'pendiente' && (
                      <>
                        <button className="btn-accion btn-aprobar" onClick={() => handleCambiarEstado(v.id, 'activo')}>✓ Activar</button>
                        <button className="btn-accion btn-rechazar" onClick={() => handleCambiarEstado(v.id, 'rechazado')}>✗ Rechazar</button>
                      </>
                    )}
                    {v.estado === 'activo' && (
                      <button className="btn-accion btn-rechazar" onClick={() => handleCambiarEstado(v.id, 'baja')}>Dar de baja</button>
                    )}
                    {v.estado === 'rechazado' && (
                      <button className="btn-accion btn-aprobar" onClick={() => handleCambiarEstado(v.id, 'activo')}>✓ Activar</button>
                    )}
                    {v.estado === 'baja' && (
                      <button className="btn-accion btn-aprobar" onClick={() => handleCambiarEstado(v.id, 'activo')}>✓ Reactivar</button>
                    )}
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

export default GestionVecinos;