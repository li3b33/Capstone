import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMisCertificados, descargarCertificadoPDF } from '../services/api';

function MisCertificados() {
  const [certificados, setCertificados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const res = await getMisCertificados();
        if (activo) setCertificados(res.data);
      } catch (error) {
        console.error('Error al cargar certificados:', error);
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  const handleDescargar = async (id, folio) => {
    try {
      const res = await descargarCertificadoPDF(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificado-${folio}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error al descargar el certificado');
    }
  };

  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'aprobado': return 'badge badge-success';
      case 'pendiente': return 'badge badge-warning';
      case 'rechazado': return 'badge badge-danger';
      default: return 'badge';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <Link to="/panel-vecino" className="btn-volver">← Volver al panel</Link>
        <h1>Mis Certificados</h1>
        <p className="panel-subtitle">
          Historial de solicitudes y certificados emitidos
        </p>
        <Link to="/solicitar-certificado" className="btn-primary btn-inline">
          + Nueva solicitud
        </Link>
      </header>

      {cargando ? (
        <p>Cargando...</p>
      ) : certificados.length === 0 ? (
        <div className="sin-datos">
          <p>Aún no has solicitado ningún certificado.</p>
          <Link to="/solicitar-certificado" className="btn-primary">
            Solicitar mi primer certificado
          </Link>
        </div>
      ) : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Fecha solicitud</th>
                <th>Fecha emisión</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((c) => (
                <tr key={c.id}>
                  <td>{c.folio || '—'}</td>
                  <td>{formatearFecha(c.fecha_solicitud)}</td>
                  <td>{formatearFecha(c.fecha_emision)}</td>
                  <td><span className={getBadgeClass(c.estado)}>{c.estado}</span></td>
                  <td>
                    {c.estado === 'aprobado' && (
                      <button
                        className="btn-accion btn-aprobar"
                        onClick={() => handleDescargar(c.id, c.folio)}
                      >
                        📄 Descargar PDF
                      </button>
                    )}
                    {c.estado === 'pendiente' && (
                      <span className="texto-info">En revisión</span>
                    )}
                    {c.estado === 'rechazado' && (
                      <span className="texto-error">Solicitud rechazada</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MisCertificados;