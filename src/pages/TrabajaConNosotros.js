import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaTruck, FaRecycle, FaHandshake } from 'react-icons/fa';
import '../css/home-modern.css';

const TrabajaConNosotros = () => {
  return (
    <section className="section-dark" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <h2 className="section-title">Únete a Nuestro Equipo</h2>
        <p className="section-subtitle">
          Sé parte del cambio. Conviértete en recolector y ayuda a hacer del mundo un lugar más limpio.
        </p>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="card-modern text-center fadeIn">
              <FaTruck size={60} className="text-gradient mb-3" />
              <h4 className="text-white mb-3 fw-bold">Recolector</h4>
              <p className="text-white-50">
                Recoge residuos reciclables de los usuarios y genera códigos QR para que reclamen sus puntos.
              </p>
            </div>
          </Col>

          <Col md={4}>
            <div className="card-modern text-center fadeIn">
              <FaRecycle size={60} className="text-gradient mb-3" />
              <h4 className="text-white mb-3 fw-bold">Impacto Ambiental</h4>
              <p className="text-white-50">
                Contribuye directamente a reducir la contaminación y fomenta la cultura del reciclaje.
              </p>
            </div>
          </Col>

          <Col md={4}>
            <div className="card-modern text-center fadeIn">
              <FaHandshake size={60} className="text-gradient mb-3" />
              <h4 className="text-white mb-3 fw-bold">Beneficios</h4>
              <p className="text-white-50">
                Gana ingresos extra, horarios flexibles y sé parte de una comunidad comprometida.
              </p>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={6}>
            <div className="cta-box">
              <div className="card-icon mx-auto mb-4">
                <i className="fas fa-user-plus" style={{ fontSize: '2.5rem', color: 'white' }}></i>
              </div>
              <h3 className="text-white mb-4 fs-2 fw-bold">
                ¿Listo para Comenzar?
              </h3>
              <p className="text-white-50 mb-4 fs-5">
                Inicia sesión o regístrate como recolector para empezar a trabajar con nosotros.
              </p>
              <a
                href={process.env.REACT_APP_RECOLECTOR_URL + '/login'}
                className="btn-modern text-decoration-none d-inline-block"
              >
                <i className="fas fa-sign-in-alt me-2"></i>
                Iniciar Sesión como Recolector
              </a>
              <p className="text-white-50 mt-4">
                ¿Aún no tienes cuenta? Contacta con el administrador para registrarte.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TrabajaConNosotros;
