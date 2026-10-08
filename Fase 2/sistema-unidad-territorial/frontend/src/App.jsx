import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PanelVecino from './pages/PanelVecino';
import PanelDirectorio from './pages/PanelDirectorio';
import GestionVecinos from './pages/GestionVecinos';
import SolicitarCertificado from './pages/SolicitarCertificado';
import MisCertificados from './pages/MisCertificados';
import GestionCertificados from './pages/GestionCertificados';
import PostularProyecto from './pages/PostularProyecto';
import MisProyectos from './pages/MisProyectos';
import GestionProyectos from './pages/GestionProyectos';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/panel-vecino" element={<PanelVecino />} />
            <Route path="/panel-directorio" element={<PanelDirectorio />} />
            <Route path="/gestion-vecinos" element={<GestionVecinos />} />
            <Route path="/solicitar-certificado" element={<SolicitarCertificado />} />
            <Route path="/mis-certificados" element={<MisCertificados />} />
            <Route path="/gestion-certificados" element={<GestionCertificados />} />
            <Route path="/postular-proyecto" element={<PostularProyecto />} />
            <Route path="/mis-proyectos" element={<MisProyectos />} />
            <Route path="/gestion-proyectos" element={<GestionProyectos />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;