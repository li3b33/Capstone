import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { actualizarPerfil } from '../services/api';
import AlertModal from '../components/AlertModal';

function MiPerfil() {
  const { usuario, actualizarPerfilGlobal } = useAuth();
  
  const [form, setForm] = useState({
    correo: usuario?.correo || '',
    telefono: usuario?.telefono || ''
  });
  
  const [cargando, setCargando] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'alert', title: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const res = await actualizarPerfil(form);
      actualizarPerfilGlobal(res.data.usuario); // Actualiza el Sidebar y Home
      
      setModalConfig({
        isOpen: true,
        type: 'alert',
        title: '¡Perfil Actualizado!',
        message: 'Tus datos de contacto han sido guardados correctamente.'
      });
    } catch (error) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error al actualizar',
        message: error.response?.data?.error || 'No se pudieron guardar los cambios.'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Mi Perfil</h1>
        <p className="panel-subtitle">Revisa tus datos personales y actualiza tu información de contacto</p>
      </header>

      <div className="certificado-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div className="datos-lista" style={{ marginBottom: '2rem' }}>
          <div className="dato">
            <span className="dato-label">RUT</span>
            <span className="dato-valor">{usuario?.rut}</span>
          </div>
          <div className="dato">
            <span className="dato-label">Nombre completo</span>
            <span className="dato-valor">{usuario?.nombres} {usuario?.apellidos}</span>
          </div>
          <div className="dato">
            <span className="dato-label">Dirección registrada</span>
            <span className="dato-valor">{usuario?.direccion}</span>
          </div>
          <div className="dato">
            <span className="dato-label">Rol en la junta</span>
            <span className="dato-valor" style={{ textTransform: 'capitalize' }}>{usuario?.rol}</span>
          </div>
        </div>

        <hr style={{ borderColor: '#e5e7eb', margin: '2rem 0' }} />
        <h3 style={{ fontSize: '1.1rem', color: '#1e3a8a', marginBottom: '1rem' }}>Editar información de contacto</h3>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="perfil-correo">Correo electrónico</label>
            <input 
              id="perfil-correo"
              type="email" 
              name="correo" 
              value={form.correo} 
              onChange={handleChange} 
              required 
            />
            <small style={{ color: '#6b7280', marginTop: '0.2rem' }}>Aquí recibirás las notificaciones de tus trámites.</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="perfil-telefono">Teléfono de contacto</label>
            <input 
              id="perfil-telefono"
              type="text" 
              name="telefono" 
              value={form.telefono} 
              onChange={handleChange} 
              placeholder="+56 9 1234 5678"
            />
          </div>

          <button type="submit" className="btn-primary btn-block" disabled={cargando} style={{ marginTop: '1rem' }}>
            {cargando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>

      <AlertModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={() => setModalConfig({ isOpen: false })}
        confirmText="Entendido"
      />
    </div>
  );
}

export default MiPerfil;