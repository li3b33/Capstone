import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMisReservas } from '../services/api';

function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getMisReservas().then(res => setReservas(res.data)).finally(() => setCargando(false));
  }, []);

  const formatearFechaHora = (fecha) => new Date(fecha).toLocaleString('es-CL');

  const getBadgeClass = (estado) => {
    if (estado === 'aprobada') return 'badge badge-success';
    if (estado === 'pendiente') return 'badge badge-warning';
    if (estado === 'rechazada') return 'badge badge-danger';
    return 'badge';
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Mis Reservas</h1>
        <Link to="/reservar-espacio" className="btn-primary btn-inline">+ Nueva reserva</Link>
      </header>

      {cargando ? <p>Cargando...</p> : reservas.length === 0 ? (
        <div className="sin-datos">
          <p>No tienes reservas aún.</p>
          <Link to="/reservar-espacio" className="btn-primary">Reservar espacio</Link>
        </div>
      ) : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>Espacio</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Motivo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(r => (
                <tr key={r.id}>
                  <td>{r.espacio_nombre}</td>
                  <td>{formatearFechaHora(r.inicio)}</td>
                  <td>{formatearFechaHora(r.fin)}</td>
                  <td>{r.motivo || '—'}</td>
                  <td><span className={getBadgeClass(r.estado)}>{r.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default MisReservas;