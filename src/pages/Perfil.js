import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { perfilService } from '../services/clienteService';
import { FaUser, FaEnvelope, FaIdCard, FaLock, FaSave } from 'react-icons/fa';
import '../css/home-modern.css';

const Perfil = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [perfilData, setPerfilData] = useState({
    nombre: '',
    apellido: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    password_actual: '',
    password_nuevo: '',
    password_nuevo_confirmation: ''
  });

  useEffect(() => {
    if (user) {
      setPerfilData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfilData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await perfilService.updatePerfil(perfilData);
      updateUser(response.user);
      success('Perfil actualizado exitosamente');
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al actualizar el perfil';
      error(mensaje);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.password_nuevo !== passwordData.password_nuevo_confirmation) {
      error('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.password_nuevo.length < 8) {
      error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await perfilService.cambiarPassword(
        passwordData.password_actual,
        passwordData.password_nuevo
      );
      success('Contraseña actualizada exitosamente');
      setPasswordData({
        password_actual: '',
        password_nuevo: '',
        password_nuevo_confirmation: ''
      });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cambiar la contraseña';
      error(mensaje);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-dark" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '50px' }}>
      <Container>
        <Row className="mb-4">
          <Col xs={12}>
            <h1 className="section-title mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              <FaUser className="me-2 me-md-3" />
              Mi Perfil
            </h1>
            <p className="text-white-50" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
              Administra tu información personal y configuración
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <div className="card-modern">
              <div className="p-3 p-md-4 p-lg-5">
                {/* Información básica del usuario */}
                <div className="text-center mb-4 p-3 p-md-4 benefit-card">
                  <div className="mb-3">
                    <div style={{
                      width: 'clamp(80px, 15vw, 120px)',
                      height: 'clamp(80px, 15vw, 120px)',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      color: '#000',
                      fontWeight: 'bold',
                      boxShadow: 'var(--shadow-glow)',
                      margin: '0 auto'
                    }}>
                      {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
                    </div>
                  </div>
                  <h4 className="text-white mb-2" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)' }}>
                    {user?.nombre} {user?.apellido}
                  </h4>
                  <p className="text-white-50 mb-2" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                    {user?.email}
                  </p>
                  <p className="text-white-50 mb-0" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                    <FaIdCard className="me-2" />
                    DNI: {user?.dni}
                  </p>
                </div>

                <Tabs
                  defaultActiveKey="perfil"
                  className="mb-4"
                  fill
                >
                  <Tab eventKey="perfil" title="Datos Personales">
                    <Form onSubmit={handleUpdatePerfil} className="mt-4">
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="form-label-modern">
                              <FaUser className="me-2" />
                              Nombre
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="nombre"
                              className="form-control-modern"
                              value={perfilData.nombre}
                              onChange={handlePerfilChange}
                              required
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="form-label-modern">
                              <FaUser className="me-2" />
                              Apellido
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="apellido"
                              className="form-control-modern"
                              value={perfilData.apellido}
                              onChange={handlePerfilChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label className="form-label-modern">
                          <FaEnvelope className="me-2" />
                          Correo Electrónico
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          className="form-control-modern"
                          value={perfilData.email}
                          onChange={handlePerfilChange}
                          required
                        />
                      </Form.Group>

                      <Alert variant="info" className="mb-4 fadeIn">
                        <small>
                          <strong>Nota:</strong> El DNI no se puede modificar. Si necesitas cambiarlo, contacta con soporte.
                        </small>
                      </Alert>

                      <Button
                        type="submit"
                        className="btn-modern w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-modern me-2" style={{ width: '18px', height: '18px', display: 'inline-block', verticalAlign: 'middle' }}></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </Form>
                  </Tab>

                  <Tab eventKey="seguridad" title="Seguridad">
                    <Form onSubmit={handleUpdatePassword} className="mt-4">
                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-modern">
                          <FaLock className="me-2" />
                          Contraseña Actual
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password_actual"
                          className="form-control-modern"
                          value={passwordData.password_actual}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="form-label-modern">
                          <FaLock className="me-2" />
                          Nueva Contraseña
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password_nuevo"
                          className="form-control-modern"
                          value={passwordData.password_nuevo}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          required
                          minLength={8}
                        />
                        <Form.Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                          Mínimo 8 caracteres
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="form-label-modern">
                          <FaLock className="me-2" />
                          Confirmar Nueva Contraseña
                        </Form.Label>
                        <Form.Control
                          type="password"
                          name="password_nuevo_confirmation"
                          className="form-control-modern"
                          value={passwordData.password_nuevo_confirmation}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          required
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="btn-modern w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-modern me-2" style={{ width: '18px', height: '18px', display: 'inline-block', verticalAlign: 'middle' }}></div>
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <FaSave className="me-2" />
                            Cambiar Contraseña
                          </>
                        )}
                      </Button>
                    </Form>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Perfil;
