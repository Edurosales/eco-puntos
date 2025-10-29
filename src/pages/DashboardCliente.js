import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { clienteService } from '../services/clienteService';
import { FaQrcode, FaStore, FaHistory, FaMapMarkedAlt, FaCoins, FaArrowUp, FaArrowDown, FaGift } from 'react-icons/fa';
import '../css/home-modern.css';

const DashboardCliente = () => {
  const { user } = useAuth();
  const { error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [puntos, setPuntos] = useState(null);

  useEffect(() => {
    loadPuntos();
  }, []);

  const loadPuntos = async () => {
    try {
      const data = await clienteService.getMisPuntos();
      setPuntos(data);
    } catch (err) {
      error('Error al cargar tus puntos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-dark" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner-modern" style={{ width: '60px', height: '60px' }}></div>
      </section>
    );
  }

  return (
    <section className="section-dark" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '50px' }}>
      <Container>
        {/* Cabecera con saludo */}
        <Row className="mb-4">
          <Col xs={12}>
            <h1 className="section-title mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              ¡Hola, {user?.nombre}! 👋
            </h1>
            <p className="text-white-50" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
              Bienvenido a tu panel de EcoPuntos
            </p>
          </Col>
        </Row>

        {/* Tarjeta de puntos principales - DESTACADA */}
        <Row className="mb-4">
          <Col xs={12}>
            <div className="benefit-card p-4 text-center" style={{
              background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%)',
              boxShadow: '0 8px 32px rgba(0, 255, 0, 0.4)'
            }}>
              <FaCoins size={60} className="mb-3" style={{ color: '#000' }} />
              <h6 className="text-uppercase mb-2" style={{ color: '#000', fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
                Tus Puntos Disponibles
              </h6>
              <h1 className="mb-2 fw-bold" style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: '#000' }}>
                {puntos?.puntos_actuales || 0}
              </h1>
              <p className="mb-0" style={{ color: '#000', opacity: 0.8, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                puntos listos para canjear
              </p>
            </div>
          </Col>
        </Row>

        {/* Accesos rápidos principales */}
        <Row className="g-3 mb-4">
          <Col xs={12} sm={6}>
            <div className="card-modern h-100" style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 255, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
            >
              <div className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaQrcode size={40} className="text-gradient me-3" />
                  <div>
                    <h5 className="text-white mb-0">Escanear QR</h5>
                    <small className="text-white-50">Reclama puntos ahora</small>
                  </div>
                </div>
                <p className="text-white-50 small mb-3">
                  Escanea códigos QR de residuos entregados para ganar puntos
                </p>
                <Button
                  as={Link}
                  to="/escanear-qr"
                  className="btn-modern w-100"
                >
                  <FaQrcode className="me-2" />
                  Escanear Ahora
                </Button>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6}>
            <div className="card-modern h-100" style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 255, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '';
            }}
            >
              <div className="p-4">
                <div className="d-flex align-items-center mb-3">
                  <FaStore size={40} className="text-gradient me-3" />
                  <div>
                    <h5 className="text-white mb-0">Tienda</h5>
                    <small className="text-white-50">Canjea tus puntos</small>
                  </div>
                </div>
                <p className="text-white-50 small mb-3">
                  Canjea tus puntos por increíbles premios y beneficios
                </p>
                <Button
                  as={Link}
                  to="/tienda"
                  className="btn-outline-modern w-100"
                >
                  <FaStore className="me-2" />
                  Ver Premios
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Estadísticas adicionales */}
        <Row className="mb-4">
          <Col xs={12}>
            <h5 className="text-white mb-3" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
              📊 Tus Estadísticas
            </h5>
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          <Col xs={12} sm={6} md={4}>
            <div className="benefit-card p-3 text-center h-100" style={{
              background: 'linear-gradient(135deg, #00D100 0%, #008000 100%)'
            }}>
              <FaArrowUp size={35} className="mb-2" style={{ color: '#fff' }} />
              <h6 className="text-uppercase mb-1" style={{ color: '#fff', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
                Puntos Ganados
              </h6>
              <h3 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#fff' }}>
                +{puntos?.total_ganados || 0}
              </h3>
              <small style={{ color: 'rgba(255,255,255,0.8)' }}>Total acumulado</small>
            </div>
          </Col>

          <Col xs={12} sm={6} md={4}>
            <div className="benefit-card p-3 text-center h-100" style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
            }}>
              <FaArrowDown size={35} className="mb-2" style={{ color: '#000' }} />
              <h6 className="text-uppercase mb-1" style={{ color: '#000', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
                Puntos Canjeados
              </h6>
              <h3 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#000' }}>
                -{puntos?.total_canjeados || 0}
              </h3>
              <small style={{ color: 'rgba(0,0,0,0.7)' }}>En premios</small>
            </div>
          </Col>

          <Col xs={12} sm={12} md={4}>
            <div className="benefit-card p-3 text-center h-100" style={{
              background: 'linear-gradient(135deg, #00CED1 0%, #008B8B 100%)'
            }}>
              <FaGift size={35} className="mb-2" style={{ color: '#fff' }} />
              <h6 className="text-uppercase mb-1" style={{ color: '#fff', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
                Transacciones
              </h6>
              <h3 className="mb-0 fw-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#fff' }}>
                {puntos?.total_transacciones || 0}
              </h3>
              <small style={{ color: 'rgba(255,255,255,0.8)' }}>Movimientos</small>
            </div>
          </Col>
        </Row>

        {/* Más accesos */}
        <Row className="mb-4">
          <Col xs={12}>
            <h5 className="text-white mb-3" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
              🔍 Explora Más
            </h5>
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          <Col xs={12} sm={6}>
            <div className="card-modern" style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = 'var(--primary-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '';
            }}
            >
              <div className="p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <FaHistory size={30} className="text-gradient me-3" />
                    <div>
                      <h6 className="text-white mb-0">Mi Historial</h6>
                      <small className="text-white-50">Ver transacciones</small>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    to="/historial"
                    className="btn-outline-modern btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12} sm={6}>
            <div className="card-modern" style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = 'var(--primary-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '';
            }}
            >
              <div className="p-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <FaMapMarkedAlt size={30} className="text-gradient me-3" />
                    <div>
                      <h6 className="text-white mb-0">Puntos de Acopio</h6>
                      <small className="text-white-50">Encuentra ubicaciones</small>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    to="/mapa"
                    className="btn-outline-modern btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    Mapa
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Información motivacional */}
        <Row>
          <Col xs={12}>
            <div className="benefit-card p-4">
              <div className="d-flex align-items-start">
                <span style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginRight: '1rem' }}>💡</span>
                <div>
                  <h5 className="text-gradient mb-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                    ¿Sabías que...?
                  </h5>
                  <p className="text-white-50 mb-0" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                    Por cada kilogramo de residuos reciclados ganas puntos que puedes canjear por premios increíbles. 
                    ¡Sigue reciclando y ayuda al planeta mientras ganas recompensas! 🌍♻️
                  </p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default DashboardCliente;
