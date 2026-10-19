import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postularProyecto } from '../services/api';

function PostularProyecto() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    presupuesto_estimado: '',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setEnviando(true);
    try {
      await postularProyecto(form);
      setExito('¡Idea enviada! El directorio revisará tu proyecto y estimará el presupuesto.');
      setTimeout(() => navigate('/mis-proyectos'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al postular la idea');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Sugerir Proyecto Vecinal</h1>
        <p className="panel-subtitle">
          Cuéntanos tu idea para mejorar el barrio. No necesitas saber de costos, el directorio se encargará de eso.
        </p>
      </header>

      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {exito && <div className="alert alert-success" role="status">{exito}</div>}

      <div className="certificado-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="titulo">Título de la idea *</label>
            <input
              id="titulo"
              name="titulo"
              placeholder="Ej: Pintar la sede social, arreglar los juegos de la plaza..."
              value={form.titulo}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción de la idea *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describe qué te gustaría hacer, por qué es importante y a quiénes beneficia."
              value={form.descripcion}
              onChange={handleChange}
              required
              aria-required="true"
              rows={5}
            />
          </div>
          <div className="form-group">
            <label htmlFor="presupuesto">Sugerencia de presupuesto (Opcional)</label>
            <input
              id="presupuesto"
              type="number"
              name="presupuesto_estimado"
              placeholder="Si tienes una idea del costo, ingrésalo aquí"
              value={form.presupuesto_estimado}
              onChange={handleChange}
              min="0"
            />
            <small style={{ color: '#6b7280', marginTop: '0.25rem' }}>
              Puedes dejar este campo en blanco si no sabes cuánto cuesta.
            </small>
          </div>
          <button type="submit" className="btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Enviando idea...' : 'Enviar sugerencia de proyecto'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostularProyecto;