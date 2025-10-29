import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLeaf } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(0, 0, 0, 0.9)',
      borderTop: '1px solid rgba(79, 172, 254, 0.3)',
      padding: '30px 0',
      marginTop: 'auto'
    }}>
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="text-primary mb-3">
              <FaLeaf className="me-2" />
              EcoPuntos
            </h5>
            <p className="text-white-50 small">
              Impulsando el reciclaje mediante puntos de recolección y premios.
              Juntos por un planeta más limpio.
            </p>
          </Col>
          
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="text-white mb-3">Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white-50 text-decoration-none small">Inicio</a></li>
              <li><a href="/#Quiens-somos" className="text-white-50 text-decoration-none small">Quiénes Somos</a></li>
              <li><a href="/#Participa" className="text-white-50 text-decoration-none small">Cómo Participar</a></li>
              <li><a href="/#Contacto" className="text-white-50 text-decoration-none small">Contacto</a></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h6 className="text-white mb-3">Síguenos</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-primary" style={{ fontSize: '1.5rem' }}>
                <FaFacebook />
              </a>
              <a href="#" className="text-primary" style={{ fontSize: '1.5rem' }}>
                <FaTwitter />
              </a>
              <a href="#" className="text-primary" style={{ fontSize: '1.5rem' }}>
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" style={{ borderColor: 'rgba(79, 172, 254, 0.3)' }} />
        
        <Row>
          <Col className="text-center">
            <p className="text-white-50 small mb-0">
              © 2025 EcoPuntos. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
