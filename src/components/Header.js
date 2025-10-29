import React, { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaSignOutAlt, FaQrcode, FaStore, FaHistory, FaMapMarkedAlt, FaCoins, FaGift } from 'react-icons/fa';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setExpanded(false);
  };

  const closeMenu = () => {
    setExpanded(false);
  };

  const isLanding = location.pathname === '/';

  return (
    <Navbar 
      expand="lg" 
      expanded={expanded}
      onToggle={setExpanded}
      fixed="top"
      variant="dark"
      style={{
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
        padding: '0.75rem 0',
        minHeight: '70px'
      }}
    >
      <Container fluid className="px-3 px-lg-4">
        <Navbar.Brand as={Link} to="/" onClick={closeMenu} className="py-0">
          <img 
            src="/img/ecopuntos.png" 
            alt="Ecopuntos" 
            style={{
              width: 'clamp(120px, 20vw, 140px)',
              height: 'auto',
              maxWidth: '100%'
            }}
          />
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="navbar-nav" 
          style={{
            borderColor: 'rgba(0, 255, 0, 0.5)',
            padding: '0.5rem 0.75rem'
          }} 
        />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-2">
            {!isAuthenticated ? (
              // Menú para usuarios NO autenticados
              <>
                <Nav.Link as={Link} to="/" className="text-white px-lg-3 py-2" onClick={closeMenu}>Inicio</Nav.Link>
                <Nav.Link as={Link} to="/trabaja-con-nosotros" className="text-white px-lg-3 py-2" onClick={closeMenu}>Trabaja con Nosotros</Nav.Link>
                <Nav.Link as={Link} to="/login" className="py-2" onClick={closeMenu}>
                  <Button 
                    style={{
                      background: 'transparent',
                      border: '2px solid rgba(0, 255, 0, 0.8)',
                      color: '#00FF00',
                      padding: '8px 24px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    className="px-4 w-100 w-lg-auto"
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(0, 255, 0, 0.1)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Iniciar sesión
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/registro" className="py-2" onClick={closeMenu}>
                  <Button 
                    style={{
                      background: 'linear-gradient(135deg, #00FF00 0%, #00D100 100%)',
                      border: 'none',
                      color: 'white',
                      padding: '8px 24px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      boxShadow: '0 4px 15px rgba(0, 255, 0, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    className="px-4 w-100 w-lg-auto"
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0, 255, 0, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 0, 0.3)';
                    }}
                  >
                    Registrarse
                  </Button>
                </Nav.Link>
              </>
            ) : (
              // Menú para usuarios AUTENTICADOS (Cliente)
              <>
                <Nav.Link as={Link} to="/dashboard" className="text-white px-lg-3 py-2" onClick={closeMenu}>
                  <FaCoins className="me-1" />
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/escanear-qr" className="text-white px-lg-3 py-2" onClick={closeMenu}>
                  <FaQrcode className="me-1" />
                  Escanear QR
                </Nav.Link>
                <Nav.Link as={Link} to="/tienda" className="text-white px-lg-3 py-2" onClick={closeMenu}>
                  <FaStore className="me-1" />
                  Tienda
                </Nav.Link>
                <Nav.Link as={Link} to="/mapa" className="text-white px-lg-3 py-2" onClick={closeMenu}>
                  <FaMapMarkedAlt className="me-1" />
                  Mapa
                </Nav.Link>
                
                <NavDropdown 
                  title={
                    <span className="text-white">
                      <FaUser className="me-1" />
                      {user?.nombre || 'Usuario'}
                    </span>
                  } 
                  id="user-dropdown"
                  align="end"
                  className="text-white"
                >
                  <NavDropdown.Item as={Link} to="/perfil" onClick={closeMenu}>
                    <FaUser className="me-2" />
                    Mi Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/mis-canjes" onClick={closeMenu}>
                    <FaGift className="me-2" />
                    Mis Canjes
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/historial" onClick={closeMenu}>
                    <FaHistory className="me-2" />
                    Mi Historial
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item className="text-muted small">
                    Puntos: <strong>{user?.puntos || 0}</strong>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <FaSignOutAlt className="me-2" />
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;