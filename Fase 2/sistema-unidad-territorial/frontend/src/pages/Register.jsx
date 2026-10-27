import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Función para formatear el RUT automáticamente (ej: 123456789 -> 12.345.678-9)
const formatearRut = (valor) => {
  let rutLimpio = valor.replace(/[^0-9kK]/g, '');
  if (rutLimpio.length <= 1) return rutLimpio;
  
  const cuerpo = rutLimpio.slice(0, -1);
  const dv = rutLimpio.slice(-1).toUpperCase();
  const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${cuerpoConPuntos}-${dv}`;
};

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
    tipo_residente: 'dueño',
    tiempo_residencia: ''
  });
  
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'rut') {
      setForm({ ...form, rut: formatearRut(e.target.value) });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    
    // Validación simple del RUT antes de enviar
    if (form.rut.length < 8) {
      setError('Por favor, ingresa un RUT válido.');
      return;
    }

    if (!form.tiempo_residencia) {
      setError('Por favor, selecciona cuánto tiempo llevas viviendo en el sector.');
      return;
    }

    setCargando(true);
    try {
      await registrar(form);
      setExito('¡Registro exitoso! Tu cuenta será revisada por el directorio.');
      setTimeout(() => navigate('/login'), 3000);
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

        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {exito && <div className="alert alert-success" role="status">{exito}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>RUT *</label>
              <input 
                name="rut" 
                placeholder="12.345.678-9" 
                value={form.rut}
                onChange={handleChange} 
                maxLength="12"
                required 
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input 
                name="telefono" 
                placeholder="+56 9 1234 5678" 
                value={form.telefono}
                onChange={handleChange} 
              />
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
            <label>Dirección particular *</label>
            <input name="direccion" placeholder="Calle, número, depto" onChange={handleChange} required />
          </div>

          {/* NUEVOS CAMPOS DE RESIDENCIA */}
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Residente *</label>
              <select name="tipo_residente" onChange={handleChange} value={form.tipo_residente} required>
                <option value="dueño">Dueño/a de casa</option>
                <option value="arrendatario">Arrendatario/a</option>
                <option value="familiar">Familiar / Allegado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Tiempo viviendo en el sector *</label>
              <select name="tiempo_residencia" onChange={handleChange} value={form.tiempo_residencia} required>
                <option value="">Selecciona una opción</option>
                <option value="menos_1_ano">Menos de 1 año</option>
                <option value="1_5_anos">De 1 a 5 años</option>
                <option value="5_10_anos">De 5 a 10 años</option>
                <option value="mas_10_anos">Más de 10 años</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.5rem' }}>
            <label>Contraseña *</label>
            <input type="password" name="password" placeholder="Mínimo 8 caracteres" onChange={handleChange} required minLength="8" />
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={cargando} style={{ marginTop: '1rem', padding: '0.8rem' }}>
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