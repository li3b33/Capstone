import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEspacios, getCalendarioReservas, solicitarReserva } from '../services/api';

const HORARIOS = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

function ReservarEspacio() {
  const navigate = useNavigate();
  const [espacios, setEspacios] = useState([]);
  const [cargandoEspacios, setCargandoEspacios] = useState(true);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState(null);
  const [semanaActual, setSemanaActual] = useState(new Date());
  const [reservasOcupadas, setReservasOcupadas] = useState([]);
  
  const [form, setForm] = useState({ fecha: '', hora_inicio: '', hora_fin: '', motivo: '' });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  // 1. Cargar espacios disponibles
  useEffect(() => {
    setCargandoEspacios(true);
    getEspacios()
      .then((res) => {
        setEspacios(res.data);
        if (res.data.length > 0) setEspacioSeleccionado(res.data[0].id);
      })
      .catch((err) => {
        console.error("Error al cargar espacios:", err);
        setError('Error al cargar los espacios. Revisa la consola.');
      })
      .finally(() => setCargandoEspacios(false));
  }, []);

  // 2. Cargar reservas de la semana seleccionada
  useEffect(() => {
    if (!espacioSeleccionado) return;
    
    const lunes = new Date(semanaActual);
    const dia = lunes.getDay() || 7;
    if (dia !== 1) lunes.setDate(lunes.getDate() - dia + 1);
    const fechaStr = lunes.toISOString().split('T')[0];

    getCalendarioReservas(espacioSeleccionado, fechaStr).then((res) => {
      setReservasOcupadas(res.data);
    });
  }, [espacioSeleccionado, semanaActual]);

  const getDiasSemana = () => {
    const lunes = new Date(semanaActual);
    const dia = lunes.getDay() || 7;
    if (dia !== 1) lunes.setDate(lunes.getDate() - dia + 1);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(lunes);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const dias = getDiasSemana();

  const estaOcupado = (fecha, hora) => {
    const fechaLocal = new Date(fecha.getTime() - (fecha.getTimezoneOffset() * 60000));
    const fechaStr = `${fechaLocal.toISOString().split('T')[0]}T${hora}:00`;
    return reservasOcupadas.some((r) => {
      const inicio = new Date(r.inicio).getTime();
      const fin = new Date(r.fin).getTime();
      const bloque = new Date(fechaStr).getTime();
      return bloque >= inicio && bloque < fin;
    });
  };

  const seleccionarBloque = (fecha, hora) => {
    if (estaOcupado(fecha, hora)) return;
    
    const fechaLocal = new Date(fecha.getTime() - (fecha.getTimezoneOffset() * 60000));
    const fechaStr = fechaLocal.toISOString().split('T')[0];
    const hFin = String(parseInt(hora.split(':')[0]) + 1).padStart(2, '0') + ':00';
    
    setForm({ ...form, fecha: fechaStr, hora_inicio: hora, hora_fin: hFin });
    setMostrarModal(true);
  };

  const handleSolicitar = async () => {
    setCargando(true);
    setError('');
    try {
      await solicitarReserva({ espacio_id: espacioSeleccionado, ...form });
      setMostrarModal(false);
      setExito('¡Reserva solicitada! El directorio la revisará pronto.');
      setTimeout(() => navigate('/mis-reservas'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar reserva');
      setMostrarModal(false); // Cerramos modal para que se vea el error
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Reservar Espacio Comunitario</h1>
        <p className="panel-subtitle">Selecciona un espacio y elige un bloque disponible en el calendario</p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="form-group" style={{ marginBottom: '2rem' }}>
        <label>Selecciona el espacio</label>
        
        {cargandoEspacios ? (
          <p>Cargando espacios...</p>
        ) : espacios.length === 0 ? (
          <div className="alert alert-error" style={{maxWidth: '400px'}}>
            No hay espacios registrados en la base de datos. Pídele al director que cree uno.
          </div>
        ) : (
          <select 
            value={espacioSeleccionado || ''} 
            onChange={(e) => setEspacioSeleccionado(e.target.value)}
            className="form-select"
          >
            {espacios.map(e => (
              <option key={e.id} value={e.id}>{e.nombre} ({e.tipo})</option>
            ))}
          </select>
        )}
      </div>

      {espacios.length > 0 && (
        <>
          <div className="calendario-header">
            <button className="btn-secondary" onClick={() => {
              const d = new Date(semanaActual); d.setDate(d.getDate() - 7); setSemanaActual(d);
            }}>← Semana anterior</button>
            
            <h3>{dias[0].toLocaleDateString('es-CL')} al {dias[6].toLocaleDateString('es-CL')}</h3>
            
            <button className="btn-secondary" onClick={() => {
              const d = new Date(semanaActual); d.setDate(d.getDate() + 7); setSemanaActual(d);
            }}>Semana siguiente →</button>
          </div>

          <div className="calendario-grid">
            <div className="calendario-col-horas">
              <div className="calendario-celda-header"></div>
              {HORARIOS.map(h => <div key={h} className="calendario-celda-hora">{h}</div>)}
            </div>

            {dias.map((dia, i) => (
              <div key={i} className="calendario-col-dia">
                <div className="calendario-celda-header">
                  {dia.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric' })}
                </div>
                {HORARIOS.map(hora => {
                  const ocupado = estaOcupado(dia, hora);
                  return (
                    <div 
                      key={hora} 
                      className={`calendario-celda-bloque ${ocupado ? 'ocupado' : 'disponible'}`}
                      onClick={() => seleccionarBloque(dia, hora)}
                    >
                      {ocupado ? 'Ocupado' : ''}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setMostrarModal(false)}>×</button>
            
            <h2>Confirmar Reserva</h2>
            
            <div className="modal-info">
              <p><strong>Espacio:</strong> {espacios.find(e => e.id === espacioSeleccionado)?.nombre}</p>
              <p><strong>Fecha:</strong> {new Date(form.fecha + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p><strong>Horario:</strong> {form.hora_inicio} a {form.hora_fin} hrs</p>
            </div>

            <div className="form-group">
              <label>Motivo de la reserva (opcional)</label>
              <input 
                type="text" 
                placeholder="Ej: Cumpleaños, reunión de vecinos..." 
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              />
            </div>

            <div className="modal-acciones">
              <button className="btn-cerrar-modal" onClick={() => setMostrarModal(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSolicitar} disabled={cargando}>
                {cargando ? 'Enviando...' : 'Solicitar Reserva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReservarEspacio;