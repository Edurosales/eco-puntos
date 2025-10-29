import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaUserPlus } from 'react-icons/fa';
import '../css/home-modern.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
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

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    const result = await register(formData);

    console.log('=== RESULTADO REGISTRO ===');
    console.log('Success:', result.success);
    console.log('User completo:', result.user);

    if (result.success) {
      success(`¡Bienvenido ${result.user.nombre}! Tu cuenta ha sido creada.`);
      console.log('=== REDIRIGIENDO A /dashboard ===');
      navigate('/dashboard');
    } else {
      error(result.message || 'Error al registrarse');
      setErrors(result.errors || { general: result.message });
      setLoading(false);
    }
  };

  return (
    <section className="section-dark" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '50px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <div className="cta-box" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div className="text-center mb-4">
                <img src="/img/ecopuntos.png" alt="EcoPuntos" style={{ width: '200px', maxWidth: '100%' }} />
                <h2 className="section-title mt-4 mb-2">Crear Cuenta</h2>
                <p className="text-white-50 fs-5">Únete a la comunidad EcoPuntos</p>
              </div>

              {errors.general && (
                <Alert variant="danger" className="mb-3 fadeIn">
                  {errors.general}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-modern">
                        <FaUser className="me-2" />
                        Nombre
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        className="form-control-modern"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        required
                        isInvalid={!!errors.nombre}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-modern">
                        <FaUser className="me-2" />
                        Apellido
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="apellido"
                        className="form-control-modern"
                        value={formData.apellido}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                        required
                        isInvalid={!!errors.apellido}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.apellido}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-modern">
                        <FaIdCard className="me-2" />
                        DNI
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="dni"
                        className="form-control-modern"
                        value={formData.dni}
                        onChange={handleChange}
                        placeholder="12345678"
                        required
                        maxLength={8}
                        isInvalid={!!errors.dni}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dni}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-modern">
                        <FaEnvelope className="me-2" />
                        Email
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        className="form-control-modern"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tucorreo@ejemplo.com"
                        required
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
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
                        minLength={8}
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-modern">
                        <FaLock className="me-2" />
                        Confirmar Contraseña
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password_confirmation"
                        className="form-control-modern"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                        isInvalid={!!errors.password_confirmation}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password_confirmation}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  className="btn-modern w-100 mb-4"
                  disabled={loading}
                  style={{ fontSize: '1.2rem', padding: '0.9rem 0' }}
                >
                  {loading ? (
                    <>
                      <div className="spinner-modern me-2" style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}></div>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="me-2" />
                      Crear Cuenta
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-white-50 mb-3">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-gradient fw-bold" style={{ textDecoration: 'none' }}>
                      Inicia sesión aquí
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

export default Registro;
