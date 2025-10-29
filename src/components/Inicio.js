import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/home-modern.css';

const Inicio = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleEmpezar = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/registro');
    }
  };

  return (
    <section className="home-hero d-flex align-items-center" id="Inicio">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} md={12} className="mb-4 mb-lg-0 fadeIn">
            <h1 className="hero-title">
              ¡Impulsa el Reciclaje!
            </h1>
            <h3 className="hero-subtitle">
              Mediante Puntos de Recolección y Gana Premios
            </h3>
            <p className="hero-description">
              Ecopuntos es una plataforma de reciclaje que ayuda a mejorar la reutilización y la recolección 
              de residuos mediante la concientización, incentivación y gamificación del reciclaje.
            </p>
            <p className="hero-description">
              Localiza los puntos de reciclaje y reutilización en el distrito de Ate. Calcula y comparte, 
              recibe alertas y participa en campañas para ganar puntos canjeables en tu tarjeta virtual.
            </p>
            <p className="hero-description mb-4">
              ¡Compite con otros usuarios y ayuda al planeta!
            </p>
            <Button 
              onClick={handleEmpezar}
              className="btn-modern"
            >
              <i className={`fas ${isAuthenticated ? 'fa-dashboard' : 'fa-rocket'} me-2`}></i>
              {isAuthenticated ? 'Ir al Dashboard' : 'Comenzar Ahora'}
            </Button>
          </Col>

          <Col lg={6} md={12} className="text-center fadeIn">
            <div className="hero-image">
              <img 
                src="/img/reciclaje.png" 
                alt="reciclaje" 
                className="img-fluid"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Inicio;