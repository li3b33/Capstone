import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [form, setForm] = useState({
    rut: '',
    nombres: '',
    apellidos: '',
    fecha_nacimiento: '',
    direccion: '',
    correo: '',
    telefono: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);
    try {
      await registrar(form);
      setExito('¡Registro exitoso! Tu cuenta será revisada por el directorio.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        <h1>Registro de Vecino</h1>
        <p className="auth-subtitle">Completa tus datos para inscribirte en la junta de vecinos</p>

        {error && <div className="alert alert-error">{error}</div>}
        {exito && <div className="alert alert-success">{exito}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>RUT *</label>
              <input name="rut" placeholder="12.345.678-9" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input name="telefono" placeholder="+56 9 1234 5678" onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nombres *</label>
              <input name="nombres" placeholder="Juan" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Apellidos *</label>
              <input name="apellidos" placeholder="Pérez" onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Fecha de nacimiento *</label>
              <input type="date" name="fecha_nacimiento" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Correo electrónico *</label>
              <input type="email" name="correo" placeholder="tu@correo.cl" onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Dirección *</label>
            <input name="direccion" placeholder="Calle, número, depto" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contraseña *</label>
            <input type="password" name="password" placeholder="Mínimo 8 caracteres" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary btn-block" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;