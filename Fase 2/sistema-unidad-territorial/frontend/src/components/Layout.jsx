import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { usuario } = useAuth(); // Verificamos si hay usuario

  return (
    <div className="app-layout" style={{ display: usuario ? 'grid' : 'block' }}>
      {/* Si hay usuario, mostramos el Sidebar */}
      {usuario && <Sidebar />}
      
      {/* El contenido principal. Si no hay usuario, ocupa el 100% */}
      <main className="main-content" style={{ width: !usuario ? '100%' : 'auto' }}>
        <Outlet /> {/* Aquí se cargan las páginas (Home, Login, etc.) */}
      </main>
    </div>
  );
}

export default Layout;