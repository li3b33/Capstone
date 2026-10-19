import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getActividades, crearActividad } from '../services/api';

function GestionActividades() {
  const [actividades, setActividades] = useState([]);
  const [form, setForm] = useState({ titulo: '', descripcion: '', lugar: '', fecha_hora: '', cupo_maximo: 20 });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const cargar = () => { getActividades().then(res => setActividades(res.data)); };
  useEffect(() => { cargar(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setExito('');
    try {
      await crearActividad(form);
      setExito('Actividad creada exitosamente');
      setForm({ titulo: '', descripcion: '', lugar: '', fecha_hora: '', cupo_maximo: 20 });
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear');
    }
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Gestión de Actividades</h1>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="certificado-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
        <h2>Crear Nueva Actividad</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Título de la actividad *</label>
              <input required value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} placeholder="Ej: Taller de Tejido" />
            </div>
            <div className="form-group">
              <label>Lugar *</label>
              <input required value={form.lugar} onChange={e => setForm({...form, lugar: e.target.value})} placeholder="Ej: Sede Social" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha y Hora *</label>
              <input type="datetime-local" required value={form.fecha_hora} onChange={e => setForm({...form, fecha_hora: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Cupo Máximo *</label>
              <input type="number" required min="1" value={form.cupo_maximo} onChange={e => setForm({...form, cupo_maximo: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea rows="3" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}></textarea>
          </div>
          <button type="submit" className="btn-primary">Crear Actividad</button>
        </form>
      </div>

      <h2>Actividades Programadas</h2>
      <div className="tabla-container">
        <table className="tabla">
          <thead>
            <tr>
              <th>Título</th>
              <th>Fecha</th>
              <th>Lugar</th>
              <th>Cupos (Inscritos/Máx)</th>
            </tr>
          </thead>
          <tbody>
            {actividades.map(act => (
              <tr key={act.id}>
                <td>{act.titulo}</td>
                <td>{new Date(act.fecha_hora).toLocaleString('es-CL')}</td>
                <td>{act.lugar}</td>
                <td>{act.inscritos} / {act.cupo_maximo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GestionActividades;