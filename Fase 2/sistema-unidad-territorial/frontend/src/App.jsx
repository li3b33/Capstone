import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout'; // <-- Importamos el Layout

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PanelVecino from './pages/PanelVecino';
import PanelDirectorio from './pages/PanelDirectorio';
import SolicitarCertificado from './pages/SolicitarCertificado';
import MisCertificados from './pages/MisCertificados';
import GestionCertificados from './pages/GestionCertificados';
import GestionVecinos from './pages/GestionVecinos';
import PostularProyecto from './pages/PostularProyecto';
import MisProyectos from './pages/MisProyectos';
import GestionProyectos from './pages/GestionProyectos';
import ReservarEspacio from './pages/ReservarEspacio';
import MisReservas from './pages/MisReservas';
import GestionReservas from './pages/GestionReservas';
import Actividades from './pages/Actividades';
import MisInscripciones from './pages/MisInscripciones';
import GestionActividades from './pages/GestionActividades';
import GestionNoticias from './pages/GestionNoticias';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* === RUTAS PÚBLICAS (Sin Sidebar) === */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === RUTAS CON LAYOUT (Con Sidebar si hay sesión) === */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/panel-vecino" element={<PanelVecino />} />
            <Route path="/panel-directorio" element={<PanelDirectorio />} />
            <Route path="/solicitar-certificado" element={<SolicitarCertificado />} />
            <Route path="/mis-certificados" element={<MisCertificados />} />
            <Route path="/gestion-certificados" element={<GestionCertificados />} />
            <Route path="/gestion-vecinos" element={<GestionVecinos />} />
            <Route path="/postular-proyecto" element={<PostularProyecto />} />
            <Route path="/mis-proyectos" element={<MisProyectos />} />
            <Route path="/gestion-proyectos" element={<GestionProyectos />} />
            <Route path="/reservar-espacio" element={<ReservarEspacio />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
            <Route path="/gestion-reservas" element={<GestionReservas />} />
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/mis-inscripciones" element={<MisInscripciones />} />
            <Route path="/gestion-actividades" element={<GestionActividades />} />
            <Route path="/gestion-noticias" element={<GestionNoticias />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;