import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// Leer el usuario del localStorage UNA VEZ al inicio
function getUsuarioInicial() {
  try {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    if (token && usuarioGuardado) {
      return JSON.parse(usuarioGuardado);
    }
  } catch (e) {
    console.error('Error al leer usuario del localStorage', e);
  }
  return null;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(getUsuarioInicial);

  const login = async (correo, password) => {
    const res = await api.post('/auth/login', { correo, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
    setUsuario(res.data.usuario);
    return res.data;
  };

  const registrar = async (datos) => {
    const res = await api.post('/auth/registro', datos);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}