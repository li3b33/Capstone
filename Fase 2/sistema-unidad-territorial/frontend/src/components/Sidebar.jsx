import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, FileText, FolderKanban, CalendarDays, 
  Megaphone, LogOut, LayoutDashboard, Users, ShieldCheck
} from 'lucide-react';

function Sidebar() {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'sidebar-link active' : 'sidebar-link';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* Asumiendo que el logo está en public/favicon.svg */}
        <img src="/favicon.svg" alt="Logo" />
        <span>Unidad Territorial</span>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className={isActive('/')}>
          <Home size={18} /> Inicio
        </Link>

        {usuario?.rol === 'vecino' && (
          <>
            <Link to="/panel-vecino" className={isActive('/panel-vecino')}>
              <LayoutDashboard size={18} /> Mi Panel
            </Link>
            <Link to="/mis-certificados" className={isActive('/mis-certificados')}>
              <FileText size={18} /> Mis Certificados
            </Link>
            <Link to="/mis-proyectos" className={isActive('/mis-proyectos')}>
              <FolderKanban size={18} /> Mis Proyectos
            </Link>
            <Link to="/mis-reservas" className={isActive('/mis-reservas')}>
              <CalendarDays size={18} /> Mis Reservas
            </Link>
            <Link to="/mis-inscripciones" className={isActive('/mis-inscripciones')}>
              <CalendarDays size={18} /> Mis Inscripciones
            </Link>
          </>
        )}

        {usuario?.rol === 'directorio' && (
          <>
            <Link to="/panel-directorio" className={isActive('/panel-directorio')}>
              <LayoutDashboard size={18} /> Mi Panel
            </Link>
            <Link to="/gestion-vecinos" className={isActive('/gestion-vecinos')}>
              <Users size={18} /> Gestionar Vecinos
            </Link>
            <Link to="/gestion-certificados" className={isActive('/gestion-certificados')}>
              <ShieldCheck size={18} /> Certificados
            </Link>
            <Link to="/gestion-proyectos" className={isActive('/gestion-proyectos')}>
              <FolderKanban size={18} /> Proyectos
            </Link>
            <Link to="/gestion-noticias" className={isActive('/gestion-noticias')}>
              <Megaphone size={18} /> Noticias
            </Link>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        {usuario ? (
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        ) : (
          <Link to="/login" className="btn-primary" style={{ width: '100%' }}>Iniciar Sesión</Link>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;