import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: agrega el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funciones de usuarios
export const getPendientes = () => api.get('/usuarios/pendientes');
export const getVecinos = (estado) => api.get('/usuarios', { params: { estado } });
export const getEstadisticas = () => api.get('/usuarios/estadisticas');
export const cambiarEstadoUsuario = (id, estado, motivo) =>
  api.put(`/usuarios/${id}/estado`, { estado, motivo });

export default api;