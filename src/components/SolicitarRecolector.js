import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../css/home-modern.css';

const SolicitarRecolector = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [puntoAcopio, setPuntoAcopio] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [formData, setFormData] = useState({
    nombre_lugar: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    referencia: '',
    ubicacion_gps: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    verificarEstadoRecolector();
  }, []);

  const verificarEstadoRecolector = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingStatus(false);
        return;
      }

      // Verificar si ya tiene un punto de acopio
      const response = await axios.get('http://localhost:8000/api/puntos-acopio', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Buscar si el usuario actual tiene un punto de acopio
      const miPunto = response.data.find(p => p.user_id_recolector === user?.id_usuario);
      setPuntoAcopio(miPunto || null);
    } catch (err) {
      console.error('Error al verificar estado:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Debes iniciar sesión como cliente primero');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/api/acopios',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('¡Solicitud enviada exitosamente! El administrador la revisará pronto.');
      
      // Limpiar formulario
      setFormData({
        nombre_lugar: '',
        direccion: '',
        departamento: '',
        provincia: '',
        distrito: '',
        referencia: '',
        ubicacion_gps: ''
      });

      // Recargar estado
      setTimeout(() => {
        verificarEstadoRecolector();
      }, 2000);

    } catch (err) {
      console.error('Error:', err);
      if (err.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Error al enviar la solicitud. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gps = `${position.coords.latitude},${position.coords.longitude}`;
          setFormData({ ...formData, ubicacion_gps: gps });
          setSuccess('Ubicación obtenida correctamente');
          setTimeout(() => setSuccess(''), 2000);
        },
        (error) => {
          setError('No se pudo obtener tu ubicación. Ingrésala manualmente.');
          setTimeout(() => setError(''), 3000);
        }
      );
    } else {
      setError('Tu navegador no soporta geolocalización');
    }
  };

  // Renderizado condicional basado en estado
  if (loadingStatus) {
    return (
      <div className="solicitar-recolector-page">
        <div className="solicitar-hero">
          <div className="solicitar-overlay">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8 text-center" style={{ padding: '100px 20px' }}>
                  <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="text-white mt-3">Verificando estado...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si ya es recolector aprobado
  if (puntoAcopio && puntoAcopio.estado === 'aprobado') {
    return (
      <div className="solicitar-recolector-page" style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, rgba(79, 172, 254, 0.15) 0%, rgba(0, 0, 0, 1) 60%)',
        paddingTop: '100px'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(79, 172, 254, 0.4)',
                borderRadius: '20px',
                padding: '50px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px'
                }}>
                  <i className="fas fa-check" style={{ fontSize: '2.5rem', color: 'white' }}></i>
                </div>
                <h2 className="text-white mb-3">¡Ya eres Recolector!</h2>
                <p className="text-white-50 mb-4" style={{ fontSize: '1.1rem' }}>
                  Tu punto de acopio <strong className="text-primary">{puntoAcopio.nombre_lugar}</strong> está activo
                </p>
                <button
                  onClick={() => window.location.href = process.env.REACT_APP_RECOLECTOR_URL + '/login'}
                  style={{
                    padding: '15px 40px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 5px 15px rgba(79, 172, 254, 0.3)'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <i className="fas fa-arrow-right me-2"></i>
                  Ir al Portal Recolector
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si ya solicitó pero está pendiente
  if (puntoAcopio && puntoAcopio.estado === 'pendiente') {
    return (
      <div className="solicitar-recolector-page" style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, rgba(79, 172, 254, 0.15) 0%, rgba(0, 0, 0, 1) 60%)',
        paddingTop: '100px'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div style={{
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 193, 7, 0.4)',
                borderRadius: '20px',
                padding: '50px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #FFD93D 0%, #FFA500 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 30px'
                }}>
                  <i className="fas fa-clock" style={{ fontSize: '2.5rem', color: 'white' }}></i>
                </div>
                <h2 className="text-white mb-3">Solicitud en Revisión</h2>
                <p className="text-white-50 mb-4" style={{ fontSize: '1.1rem' }}>
                  Tu solicitud para el punto de acopio <strong className="text-warning">{puntoAcopio.nombre_lugar}</strong> está siendo revisada por el administrador
                </p>
                <div style={{
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  borderRadius: '10px',
                  padding: '20px',
                  marginTop: '30px'
                }}>
                  <p className="text-warning mb-2"><i className="fas fa-info-circle me-2"></i><strong>Estado:</strong> Pendiente de aprobación</p>
                  <p className="text-white-50 mb-0" style={{ fontSize: '0.9rem' }}>
                    Te notificaremos cuando tu solicitud sea aprobada
                  </p>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    marginTop: '30px',
                    padding: '12px 30px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    background: 'transparent',
                    color: 'white',
                    border: '2px solid rgba(79, 172, 254, 0.5)',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(79, 172, 254, 0.1)';
                    e.target.style.borderColor = 'rgba(79, 172, 254, 0.8)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'rgba(79, 172, 254, 0.5)';
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Volver al Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario para solicitar (si no tiene punto de acopio)
  return (
    <section className="section-dark" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="cta-box">
              <div className="card-icon mx-auto">
                <i className="fas fa-recycle"></i>
              </div>
              <h2 className="section-title mb-2">Conviértete en Recolector</h2>
              <p className="text-white-50 fs-5 mb-4">
                Únete a nuestro equipo y ayuda al medio ambiente mientras ganas puntos
              </p>

              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')} className="fadeIn">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')} className="fadeIn">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </Alert>
              )}

              {/* Beneficios */}
              <Row className="g-3 mb-4">
                <Col md={6}>
                  <div className="benefit-card text-center">
                    <i className="fas fa-coins text-gradient fs-3"></i>
                    <p className="text-white fw-semibold mb-0 mt-2">Gana puntos extra</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="benefit-card text-center">
                    <i className="fas fa-chart-line text-gradient fs-3"></i>
                    <p className="text-white fw-semibold mb-0 mt-2">Panel de estadísticas</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="benefit-card text-center">
                    <i className="fas fa-qrcode text-gradient fs-3"></i>
                    <p className="text-white fw-semibold mb-0 mt-2">Genera códigos QR</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="benefit-card text-center">
                    <i className="fas fa-leaf text-gradient fs-3"></i>
                    <p className="text-white fw-semibold mb-0 mt-2">Impacto ambiental</p>
                  </div>
                </Col>
              </Row>

              {/* Formulario */}
              <Form onSubmit={handleSubmit} className="text-start">
                <h5 className="text-white mb-4 text-center">
                  <i className="fas fa-map-marker-alt me-2 text-gradient"></i>
                  Información del Punto de Acopio
                </h5>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">
                    <i className="fas fa-building me-2"></i>
                    Nombre del Lugar *
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="form-control-modern"
                    placeholder="Ej: Acopio Central Lima"
                    value={formData.nombre_lugar}
                    onChange={(e) => setFormData({ ...formData, nombre_lugar: e.target.value })}
                    required
                    disabled={loading}
                  />
                  <Form.Text className="text-white-50">
                    Nombre con el que se identificará tu punto de recolección
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">
                    <i className="fas fa-location-arrow me-2"></i>
                    Dirección *
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="form-control-modern"
                    placeholder="Ej: Av. Principal 123"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    required
                    disabled={loading}
                  />
                  <Form.Text className="text-white-50">
                    Dirección exacta donde operarás
                  </Form.Text>
                </Form.Group>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="form-label-modern">
                        <i className="fas fa-globe me-2"></i>
                        Departamento *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control-modern"
                        placeholder="Ej: Lima"
                        value={formData.departamento}
                        onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="form-label-modern">
                        <i className="fas fa-map me-2"></i>
                        Provincia *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control-modern"
                        placeholder="Ej: Lima"
                        value={formData.provincia}
                        onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="form-label-modern">
                        <i className="fas fa-map-marked-alt me-2"></i>
                        Distrito *
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="form-control-modern"
                        placeholder="Ej: San Isidro"
                        value={formData.distrito}
                        onChange={(e) => setFormData({ ...formData, distrito: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-modern">
                    <i className="fas fa-info-circle me-2"></i>
                    Referencia
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="form-control-modern"
                    placeholder="Ej: Frente al mercado central, al costado de la farmacia"
                    value={formData.referencia}
                    onChange={(e) => setFormData({ ...formData, referencia: e.target.value })}
                    disabled={loading}
                  />
                  <Form.Text className="text-white-50">
                    Referencias adicionales para facilitar la ubicación (opcional)
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-modern">
                    <i className="fas fa-map-pin me-2"></i>
                    Ubicación GPS *
                  </Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      className="form-control-modern"
                      placeholder="Ej: -12.0464,-77.0428"
                      value={formData.ubicacion_gps}
                      onChange={(e) => setFormData({ ...formData, ubicacion_gps: e.target.value })}
                      required
                      disabled={loading}
                    />
                    <Button
                      variant="outline"
                      className="btn-outline-modern"
                      onClick={obtenerUbicacion}
                      disabled={loading}
                    >
                      <i className="fas fa-crosshairs me-2"></i>
                      Ubicación
                    </Button>
                  </div>
                  <Form.Text className="text-white-50">
                    Formato: latitud,longitud. Usa el botón para obtenerla automáticamente.
                  </Form.Text>
                </Form.Group>

                <Alert variant="info" className="mb-4">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Importante:</strong> Una vez enviada tu solicitud, el equipo administrativo 
                  la revisará. Recibirás una notificación cuando sea aprobada y podrás acceder al 
                  <strong> Portal de Recolector</strong>.
                </Alert>

                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Button
                    variant="outline"
                    className="btn-outline-modern"
                    onClick={() => navigate('/quienes-somos')}
                    disabled={loading}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    className="btn-modern"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-modern me-2" style={{ width: '20px', height: '20px', display: 'inline-block' }}></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Enviar Solicitud
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SolicitarRecolector;
