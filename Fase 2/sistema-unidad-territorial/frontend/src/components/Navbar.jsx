import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const cerrarSesion = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🏘️ Junta de Vecinos</Link>
      </div>
      <div className="navbar-links">
        {usuario ? (
          <>
            <span className="navbar-user">Hola, {usuario.nombres}</span>
            <Link to={usuario.rol === 'directorio' ? '/panel-directorio' : '/panel-vecino'}>
              Mi Panel
            </Link>
            <button onClick={cerrarSesion} className="btn-logout">
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register" className="btn-primary">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;