import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '../css/home-modern.css';

const QuienesSomos = () => {
  const navigate = useNavigate();

  return (
    <section className="section-dark section-spacer" id="Quienes-somos">
      <Container>
        <h2 className="section-title">¿Quiénes Somos?</h2>
        <p className="section-subtitle">
          Somos una compañía que busca alinearse al cambio climático y promover la salud del medio ambiente
        </p>

        {/* Menú de Campañas */}
        <Row className="mb-5 justify-content-center">
          {['Conoce EcoPuntos', 'El proceso de Reciclaje', 'Actualidad', 'Ciudadanía', 'Recicladores', 'Administración Pública'].map((item, index) => (
            <Col key={index} lg={4} md={6} className="mb-3">
              <div className="benefit-card text-center text-white">
                <i className="fas fa-leaf text-gradient"></i>
                <p className="mb-0 fw-semibold">{item}</p>
              </div>
            </Col>
          ))}
        </Row>

        {/* CTA: Trabaja con Nosotros */}
        <div className="cta-box">
          <div className="card-icon mx-auto">
            <i className="fas fa-recycle"></i>
          </div>
          <h2 className="section-title mb-3">¿Quieres ser Recolector?</h2>
          <p className="text-white-50 fs-5 mb-4 px-3">
            Únete a nuestro equipo de recolectores, genera ingresos extras y ayuda al medio ambiente. 
            Gana puntos por cada residuo procesado y accede a beneficios exclusivos.
          </p>
          
          <Row className="g-3 mb-4 justify-content-center">
            <Col md={4}>
              <div className="benefit-card">
                <i className="fas fa-coins text-gradient"></i>
                <p className="text-white fw-semibold mb-0">Gana Puntos</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="benefit-card">
                <i className="fas fa-chart-line text-gradient"></i>
                <p className="text-white fw-semibold mb-0">Panel Exclusivo</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="benefit-card">
                <i className="fas fa-leaf text-gradient"></i>
                <p className="text-white fw-semibold mb-0">Impacto Ambiental</p>
              </div>
            </Col>
          </Row>
          
          <button 
            onClick={() => navigate('/solicitar-recolector')}
            className="btn-modern"
          >
            <i className="fas fa-hand-point-right me-2"></i>
            ¡Solicita ser Recolector Ahora!
          </button>
        </div>
      </Container>
    </section>
  );
};

export default QuienesSomos;