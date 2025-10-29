import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './utils/PrivateRoute';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Estilos propios
import './App.css';
import './css/home-modern.css';

// Componentes
import Header from './components/Header';
import Inicio from './components/Inicio';
import QuienesSomos from './components/QuienesSomos';
import Reciclaje from './components/Reciclaje';
import Participa from './components/Participa';
import Resenas from './components/Resenas';
import Separte from './components/Separte';
import Contacto from './components/Contacto';
import SolicitarRecolector from './components/SolicitarRecolector';

// Páginas de autenticación
import Login from './pages/Login';
import Registro from './pages/Registro';
import TrabajaConNosotros from './pages/TrabajaConNosotros';

// Páginas del cliente
import DashboardCliente from './pages/DashboardCliente';
import EscanearQR from './pages/EscanearQR';
import Tienda from './pages/Tienda';
import Historial from './pages/Historial';
import MisCanjes from './pages/MisCanjes';
import Mapa from './pages/Mapa';
import Perfil from './pages/Perfil';

// Componente Landing Page
const LandingPage = () => (
  <>
    <Inicio />
    <QuienesSomos />
    <Reciclaje />
    <Participa />
    <Resenas />
    <Separte />
    <Contacto />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="App">
            <Header />
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/trabaja-con-nosotros" element={<TrabajaConNosotros />} />
              <Route path="/solicitar-recolector" element={<SolicitarRecolector />} />
              <Route path="/quienes-somos" element={<LandingPage />} />

              {/* Rutas protegidas - Cliente */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute requireRole="cliente">
                    <DashboardCliente />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/escanear-qr" 
                element={
                  <PrivateRoute requireRole="cliente">
                    <EscanearQR />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/tienda" 
                element={
                  <PrivateRoute requireRole="cliente">
                    <Tienda />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/historial" 
                element={
                  <PrivateRoute requireRole="cliente">
                    <Historial />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/mis-canjes" 
                element={
                  <PrivateRoute requireRole="cliente">
                    <MisCanjes />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/mapa" 
                element={
                  <PrivateRoute requireRole="cliente">
                    <Mapa />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/perfil" 
                element={
                  <PrivateRoute>
                    <Perfil />
                  </PrivateRoute>
                } 
              />

              {/* Redirección por defecto */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;