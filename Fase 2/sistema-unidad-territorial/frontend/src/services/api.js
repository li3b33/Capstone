import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones de autenticación
export const login = (correo, password) => api.post('/auth/login', { correo, password });
export const registrar = (datos) => api.post('/auth/registro', datos);
export const getPerfil = () => api.get('/auth/perfil');

// Funciones de usuarios (directorio)
export const getPendientes = () => api.get('/usuarios/pendientes');
export const getVecinos = (estado) => api.get('/usuarios', { params: { estado } });
export const getEstadisticas = () => api.get('/usuarios/estadisticas');
export const cambiarEstadoUsuario = (id, estado, motivo) =>
  api.put(`/usuarios/${id}/estado`, { estado, motivo });

// Funciones de certificados (vecino)
export const solicitarCertificado = () => api.post('/certificados');
export const getMisCertificados = () => api.get('/certificados/mis-certificados');
export const verificarCertificado = (folio) =>
  api.get(`/certificados/verificar/${folio}`);

// Funciones de certificados (directorio)
export const getCertificadosPendientes = () => api.get('/certificados/pendientes');
export const getTodosCertificados = (estado) =>
  api.get('/certificados/todos', { params: { estado } });
export const aprobarCertificado = (id) => api.put(`/certificados/${id}/aprobar`);
export const rechazarCertificado = (id, motivo) =>
  api.put(`/certificados/${id}/rechazar`, { motivo });
export const descargarCertificadoPDF = (id) =>
  api.get(`/certificados/${id}/pdf`, { responseType: 'blob' });

// Funciones de proyectos (vecino)
export const postularProyecto = (datos) => api.post('/proyectos', datos);
export const getMisProyectos = () => api.get('/proyectos/mis-proyectos');

// Funciones de proyectos (directorio)
export const getTodosProyectos = (estado) =>
  api.get('/proyectos/todos', { params: { estado } });
export const revisarProyecto = (id) => api.put(`/proyectos/${id}/revisar`);
export const aprobarProyecto = (id, presupuesto_estimado) => 
  api.put(`/proyectos/${id}/aprobar`, { presupuesto_estimado });
export const rechazarProyecto = (id, motivo) =>
  api.put(`/proyectos/${id}/rechazar`, { motivo });

// Funciones de reservas (vecino)
export const getEspacios = () => api.get('/reservas/espacios');
export const getCalendarioReservas = (espacio_id, fecha_inicio) => 
  api.get('/reservas/calendario', { params: { espacio_id, fecha_inicio } });
export const solicitarReserva = (datos) => api.post('/reservas', datos);
export const getMisReservas = () => api.get('/reservas/mis-reservas');

// Funciones de reservas (directorio)
export const getTodasReservas = (estado) => 
  api.get('/reservas/todas', { params: { estado } });
export const cambiarEstadoReserva = (id, estado) => 
  api.put(`/reservas/${id}/estado`, { estado });

// Funciones de actividades
export const getActividades = () => api.get('/actividades');
export const crearActividad = (datos) => api.post('/actividades', datos);
export const inscribirseActividad = (id) => api.post(`/actividades/${id}/inscribirse`);
export const cancelarInscripcionActividad = (id) => api.put(`/actividades/${id}/cancelar`); 
export const getMisInscripciones = () => api.get('/actividades/mis-inscripciones');

// Funciones de noticias
export const getNoticias = () => api.get('/noticias');
export const crearNoticia = (formData) => api.post('/noticias', formData, {
  headers: { 'Content-Type': 'multipart/form-data',
  },
});
export const eliminarNoticia = (id) => api.delete(`/noticias/${id}`);


export default api;