import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTodasReservas, cambiarEstadoReserva } from '../services/api';

function GestionReservas() {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('pendiente');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const cargar = useCallback(async () => {
    try {
      const res = await getTodasReservas(filtro === 'todos' ? null : filtro);
      setReservas(res.data);
    } catch (error) {
      console.error(error);
    }
  }, [filtro]);

  useEffect(() => {
    setCargando(true);
    cargar().finally(() => setCargando(false));
  }, [cargar]);

  const handleCambiarEstado = async (id, estado) => {
    if (!confirm(`¿Seguro que deseas ${estado === 'aprobada' ? 'aprobar' : 'rechazar'} esta reserva?`)) return;
    try {
      await cambiarEstadoReserva(id, estado);
      setMensaje(`Reserva ${estado} correctamente`);
      setTimeout(() => setMensaje(''), 3000);
      cargar();
    } catch (error) {
      alert('Error al cambiar estado');
    }
  };

  const formatearFechaHora = (fecha) => new Date(fecha).toLocaleString('es-CL');

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Gestión de Reservas</h1>
        <p className="panel-subtitle">Aprueba o rechaza las solicitudes de espacios comunitarios</p>
      </header>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <div className="filtros">
        {['pendiente', 'aprobada', 'rechazada', 'todos'].map(f => (
          <button key={f} className={filtro === f ? 'btn-filtro active' : 'btn-filtro'} onClick={() => setFiltro(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {cargando ? <p>Cargando...</p> : reservas.length === 0 ? <p className="sin-datos">No hay reservas aquí.</p> : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>Espacio</th>
                <th>Vecino</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(r => (
                <tr key={r.id}>
                  <td>{r.espacio_nombre}</td>
                  <td>{r.nombres} {r.apellidos}</td>
                  <td>{formatearFechaHora(r.inicio)} <br/> hasta {formatearFechaHora(r.fin)}</td>
                  <td><span className={`badge badge-${r.estado === 'aprobada' ? 'success' : r.estado === 'pendiente' ? 'warning' : 'danger'}`}>{r.estado}</span></td>
                  <td className="acciones">
                    {r.estado === 'pendiente' && (
                      <>
                        <button className="btn-accion btn-aprobar" onClick={() => handleCambiarEstado(r.id, 'aprobada')}>✓ Aprobar</button>
                        <button className="btn-accion btn-rechazar" onClick={() => handleCambiarEstado(r.id, 'rechazada')}>✗ Rechazar</button>
                      </>
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
export default GestionReservas;