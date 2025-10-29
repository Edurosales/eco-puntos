import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import '../css/home-modern.css';

const Separte = () => {
  const navigate = useNavigate();

  return (
    <section className="section-dark section-spacer">
      <Container>
        <div className="cta-box">
          <div className="card-icon mx-auto">
            <i className="fas fa-users"></i>
          </div>
          
          <h2 className="section-title mb-3">
            Para ser parte de nuestro equipo de trabajo puedes contactarte a nuestros puestos laborales
          </h2>
          
          <p className="text-white-50 fs-5 mb-4 px-3">
            Escribe y envía currículum para también ser un agente de cambio y apoya a la causa sostenible
            del medio ambiente.
          </p>
          
          <button 
            onClick={() => navigate('/solicitar-recolector')}
            className="btn-modern"
          >
            <i className="fas fa-paper-plane me-2"></i>
            Solicitar ser Recolector
          </button>
        </div>
      </Container>
    </section>
  );
};

export default Separte;