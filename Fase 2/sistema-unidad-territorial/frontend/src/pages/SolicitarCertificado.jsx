import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { solicitarCertificado } from '../services/api';
import { useAuth } from '../context/AuthContext';

function SolicitarCertificado() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleSolicitar = async () => {
    setError('');
    setExito('');
    setEnviando(true);
    try {
      const res = await solicitarCertificado();
      setExito(res.data.mensaje);
      setTimeout(() => navigate('/mis-certificados'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar el certificado');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <Link to="/panel-vecino" className="btn-volver">← Volver al panel</Link>
        <h1>Solicitar Certificado de Residencia</h1>
        <p className="panel-subtitle">
          El directorio revisará tu solicitud y recibirás la resolución.
        </p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="certificado-card">
        <h2>Datos que se certificarán</h2>
        <div className="datos-lista">
          <div className="dato">
            <span className="dato-label">Nombre completo</span>
            <span className="dato-valor">{usuario?.nombres} {usuario?.apellidos}</span>
          </div>
          <div className="dato">
            <span className="dato-label">RUT</span>
            <span className="dato-valor">{usuario?.rut}</span>
          </div>
          <div className="dato">
            <span className="dato-label">Dirección</span>
            <span className="dato-valor">{usuario?.direccion || '—'}</span>
          </div>
          <div className="dato">
            <span className="dato-label">Correo</span>
            <span className="dato-valor">{usuario?.correo}</span>
          </div>
        </div>

        <p className="aviso">
          Al solicitar el certificado, el directorio revisará tu información
          y emitirá el documento. Recibirás una notificación con la resolución.
        </p>

        <button
          className="btn-primary btn-block"
          onClick={handleSolicitar}
          disabled={enviando}
        >
          {enviando ? 'Enviando solicitud...' : 'Solicitar certificado'}
        </button>
      </div>
    </div>
  );
}

export default SolicitarCertificado;