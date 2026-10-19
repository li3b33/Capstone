import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMisInscripciones } from '../services/api';

function MisInscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    getMisInscripciones().then(res => setInscripciones(res.data)).finally(() => setCargando(false));
  }, []);

  const formatearFecha = (fecha) => new Date(fecha).toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className="panel">
      <header className="panel-header">
        <Link to="/actividades" className="btn-volver">← Volver a actividades</Link>
        <h1>Mis Inscripciones</h1>
      </header>

      {cargando ? <p>Cargando...</p> : inscripciones.length === 0 ? <p className="sin-datos">No estás inscrito en ninguna actividad.</p> : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Fecha y Hora</th>
                <th>Lugar</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {inscripciones.map((ins, i) => (
                <tr key={i}>
                  <td>{ins.titulo}</td>
                  <td>{formatearFecha(ins.fecha_hora)}</td>
                  <td>{ins.lugar}</td>
                  <td><span className="badge badge-success">{ins.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MisInscripciones;