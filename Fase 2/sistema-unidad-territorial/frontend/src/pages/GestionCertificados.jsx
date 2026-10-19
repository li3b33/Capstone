import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  getCertificadosPendientes,
  getTodosCertificados,
  aprobarCertificado,
  rechazarCertificado,
  descargarCertificadoPDF,
} from '../services/api';

function GestionCertificados() {
  const [certificados, setCertificados] = useState([]);
  const [filtro, setFiltro] = useState('pendiente');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setError('');
    try {
      const res =
        filtro === 'pendiente'
          ? await getCertificadosPendientes()
          : await getTodosCertificados(filtro === 'todos' ? null : filtro);
      setCertificados(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar certificados');
    }
  }, [filtro]);

  useEffect(() => {
    let activo = true;
    const cargarConEstado = async () => {
      setCargando(true);
      try {
        await cargar();
      } finally {
        if (activo) setCargando(false);
      }
    };
    cargarConEstado();
    return () => {
      activo = false;
    };
  }, [cargar]);

  const handleAprobar = async (id) => {
    if (!confirm('¿Aprobar este certificado? Se enviará un correo al vecino.')) return;
    try {
      const res = await aprobarCertificado(id);
      setMensaje(res.data.mensaje);
      setTimeout(() => setMensaje(''), 4000);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al aprobar');
    }
  };

  const handleRechazar = async (id) => {
    const motivo = prompt('Motivo del rechazo (obligatorio, mínimo 5 caracteres):');
    if (!motivo || motivo.trim().length < 5) {
      alert('El motivo es obligatorio y debe tener al menos 5 caracteres');
      return;
    }
    try {
      const res = await rechazarCertificado(id, motivo);
      setMensaje(res.data.mensaje);
      setTimeout(() => setMensaje(''), 4000);
      cargar();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al rechazar');
    }
  };

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
    } catch {
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
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="panel">
      <header className="panel-header">
        <h1>Gestión de Certificados</h1>
        <p className="panel-subtitle">Aprueba o rechaza las solicitudes de certificados de residencia</p>
      </header>

      {mensaje && <div className="alert alert-success" role="status">{mensaje}</div>}
      {error && <div className="alert alert-error" role="alert">{error}</div>}

      <div className="filtros">
        {['pendiente', 'aprobado', 'rechazado', 'todos'].map((f) => (
          <button
            key={f}
            className={filtro === f ? 'btn-filtro active' : 'btn-filtro'}
            onClick={() => setFiltro(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {cargando ? (
        <p>Cargando...</p>
      ) : certificados.length === 0 ? (
        <p className="sin-datos">No hay certificados en este estado.</p>
      ) : (
        <div className="tabla-container">
          <table className="tabla">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Vecino</th>
                <th>RUT</th>
                <th>Dirección</th>
                <th>Fecha solicitud</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((c) => (
                <tr key={c.id}>
                  <td>{c.folio || '—'}</td>
                  <td>{c.nombres} {c.apellidos}</td>
                  <td>{c.rut}</td>
                  <td>{c.direccion_certificada}</td>
                  <td>{formatearFecha(c.fecha_solicitud)}</td>
                  <td><span className={getBadgeClass(c.estado)}>{c.estado}</span></td>
                  <td className="acciones">
                    {c.estado === 'pendiente' && (
                      <>
                        <button className="btn-accion btn-aprobar" onClick={() => handleAprobar(c.id)}>✓ Aprobar</button>
                        <button className="btn-accion btn-rechazar" onClick={() => handleRechazar(c.id)}>✗ Rechazar</button>
                      </>
                    )}
                    {c.estado === 'aprobado' && (
                      <>
                        <span className="texto-info">✓ Emitido</span>
                        <button
                          className="btn-accion btn-aprobar"
                          onClick={() => handleDescargar(c.id, c.folio)}
                        >
                          📄 Descargar
                        </button>
                      </>
                    )}
                    {c.estado === 'rechazado' && (
                      <span className="texto-error">✗ Rechazado</span>
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

export default GestionCertificados;