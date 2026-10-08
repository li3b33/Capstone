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
      await postularProyecto({
        ...form,
        presupuesto_estimado: parseInt(form.presupuesto_estimado, 10),
      });
      setExito('¡Proyecto postulado! El directorio lo revisará pronto.');
      setTimeout(() => navigate('/mis-proyectos'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al postular el proyecto');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <Link to="/panel-vecino" className="btn-volver">← Volver al panel</Link>
        <h1>Postular Proyecto Vecinal</h1>
        <p className="panel-subtitle">
          Presenta una idea para mejorar tu barrio. El directorio la revisará.
        </p>
      </header>

      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {exito && <div className="alert alert-success" role="status">{exito}</div>}

      <div className="certificado-card">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="titulo">Título del proyecto *</label>
            <input
              id="titulo"
              name="titulo"
              placeholder="Ej: Mejoramiento de áreas verdes"
              value={form.titulo}
              onChange={handleChange}
              required
              aria-required="true"
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describe tu idea, qué problema resuelve y cómo beneficia al barrio"
              value={form.descripcion}
              onChange={handleChange}
              required
              aria-required="true"
              rows={5}
            />
          </div>
          <div className="form-group">
            <label htmlFor="presupuesto">Presupuesto estimado (CLP) *</label>
            <input
              id="presupuesto"
              type="number"
              name="presupuesto_estimado"
              placeholder="Ej: 1500000"
              value={form.presupuesto_estimado}
              onChange={handleChange}
              required
              aria-required="true"
              min="0"
            />
          </div>
          <button type="submit" className="btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Postular proyecto'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostularProyecto;