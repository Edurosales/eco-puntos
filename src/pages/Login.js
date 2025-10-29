import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import '../css/home-modern.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    console.log('=== INICIO LOGIN ===');
    console.log('Intentando login con:', formData.email);
    
    const result = await login(formData.email, formData.password);
    
    console.log('=== RESULTADO LOGIN ===');
    console.log('Success:', result.success);
    console.log('User completo:', result.user);
    console.log('Token en localStorage:', localStorage.getItem('token'));
    
    if (result.success) {
      success(`¡Bienvenido ${result.user.nombre}!`);
      console.log('=== REDIRIGIENDO A /dashboard ===');
      navigate('/dashboard');
    } else {
      error(result.message || 'Error al iniciar sesión');
      setErrors({ general: result.message });
      setLoading(false);
    }
  };

  return (
    <section className="section-dark" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={10}>
            <div className="cta-box" style={{ maxWidth: '650px', margin: '0 auto' }}>
              <div className="text-center mb-4">
                <img src="/img/ecopuntos.png" alt="EcoPuntos" style={{ width: '200px', maxWidth: '100%' }} />
                <h2 className="section-title mt-4 mb-2">Iniciar Sesión</h2>
                <p className="text-white-50 fs-5">Ingresa a tu cuenta EcoPuntos</p>
              </div>

              {errors.general && (
                <Alert variant="danger" className="mb-3 fadeIn">
                  {errors.general}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="form-label-modern">
                    <FaEnvelope className="me-2" />
                    Correo Electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    className="form-control-modern"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
                    required
                    style={{ fontSize: '1.1rem', padding: '0.9rem 1.2rem' }}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-modern">
                    <FaLock className="me-2" />
                    Contraseña
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    className="form-control-modern"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    style={{ fontSize: '1.1rem', padding: '0.9rem 1.2rem' }}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn-modern w-100 mb-4"
                  disabled={loading}
                  style={{ fontSize: '1.2rem', padding: '0.9rem 0' }}
                >
                  {loading ? (
                    <>
                      <div className="spinner-modern me-2" style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}></div>
                      Iniciando...
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="me-2" />
                      Iniciar Sesión
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-white-50 mb-3">
                    ¿No tienes cuenta?{' '}
                    <Link to="/registro" className="text-gradient fw-bold" style={{ textDecoration: 'none' }}>
                      Regístrate aquí
                    </Link>
                  </p>
                  <Link to="/" className="text-white-50" style={{ textDecoration: 'none' }}>
                    Volver al inicio
                  </Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
