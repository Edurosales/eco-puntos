import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner, Container } from 'react-bootstrap';

const PrivateRoute = ({ children, requireRole }) => {
  const { isAuthenticated, user, loading, token } = useAuth();

  console.log('PrivateRoute - Estado completo:', { 
    isAuthenticated, 
    user, 
    loading, 
    requireRole,
    token: token ? 'presente' : 'ausente',
    userRol: user?.rol,
    localStorage: localStorage.getItem('token') ? 'presente' : 'ausente'
  });

  if (loading) {
    console.log('PrivateRoute - Cargando...');
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!isAuthenticated) {
    console.log('PrivateRoute - Usuario no autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // Temporalmente comentado para debug
  // if (requireRole && user?.rol !== requireRole) {
  //   console.log('PrivateRoute - Rol incorrecto:', user?.rol, 'requerido:', requireRole);
  //   return <Navigate to="/dashboard" replace />;
  // }

  console.log('PrivateRoute - Acceso permitido');
  return children;
};

export default PrivateRoute;
