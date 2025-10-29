import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { clienteService } from '../services/clienteService';
import { useNotification } from '../context/NotificationContext';
import { FaMapMarkedAlt, FaUser, FaPhone, FaMapMarkerAlt, FaDirections } from 'react-icons/fa';
import '../css/home-modern.css';

const Mapa = () => {
  const { error } = useNotification();
  const [puntosAcopio, setPuntosAcopio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPunto, setSelectedPunto] = useState(null);

  useEffect(() => {
    loadPuntosAcopio();
  }, []);

  const loadPuntosAcopio = async () => {
    try {
      const data = await clienteService.getPuntosAcopio();
      setPuntosAcopio(data);
      if (data.length > 0) {
        setSelectedPunto(data[0]);
      }
    } catch (err) {
      error('Error al cargar los puntos de acopio');
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
        {/* Cabecera */}
        <Row className="mb-4">
          <Col xs={12}>
            <h1 className="section-title mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              <FaMapMarkedAlt className="me-2 me-md-3" />
              Puntos de Acopio
            </h1>
            <p className="text-white-50" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
              Encuentra el punto de reciclaje más cercano a ti
            </p>
          </Col>
        </Row>

        {puntosAcopio.length === 0 ? (
          <Alert variant="info" className="fadeIn">
            <Alert.Heading className="h5">No hay puntos de acopio disponibles</Alert.Heading>
            <p className="mb-0">
              Actualmente no hay puntos de acopio registrados. Pronto habrá más ubicaciones disponibles.
            </p>
          </Alert>
        ) : (
          <Row className="g-3">
            {/* Lista de puntos */}
            <Col xs={12} lg={4} className="mb-3 mb-lg-0">
              <div className="card-modern" style={{
                maxHeight: '70vh',
                overflowY: 'auto'
              }}>
                <div className="p-3 p-md-4" style={{ borderBottom: '2px solid var(--border-green)' }}>
                  <h5 className="text-white mb-0" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                    Puntos Disponibles ({puntosAcopio.length})
                  </h5>
                </div>
                <ListGroup variant="flush">
                  {puntosAcopio.map((punto) => (
                    <ListGroup.Item
                      key={punto.id_acopio}
                      action
                      active={selectedPunto?.id_acopio === punto.id_acopio}
                      onClick={() => setSelectedPunto(punto)}
                      style={{
                        background: selectedPunto?.id_acopio === punto.id_acopio 
                          ? 'rgba(0, 255, 0, 0.2)' 
                          : 'rgba(0, 0, 0, 0.5)',
                        border: 'none',
                        borderBottom: '1px solid var(--border-green)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        padding: 'clamp(0.75rem, 2vw, 1rem)'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start flex-wrap">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h6 className="text-white mb-1" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                            {punto.nombre_lugar}
                          </h6>
                          <p className="text-white-50 mb-1 small" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
                            <FaMapMarkerAlt className="me-1" />
                            {punto.direccion}
                          </p>
                          {punto.recolector && (
                            <p className="text-white-50 mb-0 small" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}>
                              <FaUser className="me-1" />
                              {punto.recolector.nombre} {punto.recolector.apellido}
                            </p>
                          )}
                        </div>
                        <Badge bg="success" className="ms-2 mt-1 mt-sm-0" style={{ fontSize: '0.75rem' }}>
                          Activo
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>

            {/* Detalles del punto seleccionado */}
            <Col xs={12} lg={8}>
              {selectedPunto ? (
                <Row className="g-3">
                  {/* Tarjeta de información */}
                  <Col xs={12}>
                    <div className="card-modern">
                      <div className="p-3 p-md-4">
                        <h3 className="text-gradient mb-3 mb-md-4" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>
                          {selectedPunto.nombre_lugar}
                        </h3>
                        
                        <Row className="g-3">
                          <Col xs={12} md={6}>
                            <div className="benefit-card p-3">
                              <h6 className="text-gradient mb-2" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                                <FaMapMarkerAlt className="me-2" />
                                Dirección
                              </h6>
                              <p className="text-white mb-0" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                                {selectedPunto.direccion}
                              </p>
                            </div>
                          </Col>

                          {selectedPunto.recolector && (
                            <Col xs={12} md={6}>
                              <div className="benefit-card p-3">
                                <h6 className="text-gradient mb-2" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                                  <FaUser className="me-2" />
                                  Recolector
                                </h6>
                                <p className="text-white mb-0" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                                  {selectedPunto.recolector.nombre} {selectedPunto.recolector.apellido}
                                </p>
                              </div>
                            </Col>
                          )}

                          {selectedPunto.ubicacion_gps && (
                            <Col xs={12}>
                              <Button
                                className="btn-modern w-100"
                                size="lg"
                                href={`https://www.google.com/maps?q=${selectedPunto.ubicacion_gps}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}
                              >
                                <FaDirections className="me-2" />
                                Cómo llegar (Google Maps)
                              </Button>
                            </Col>
                          )}
                        </Row>
                      </div>
                    </div>
                  </Col>

                  {/* Mapa embed (opcional) */}
                  {selectedPunto.ubicacion_gps && (
                    <Col xs={12}>
                      <div className="card-modern" style={{ 
                        height: 'clamp(300px, 50vh, 450px)',
                        overflow: 'hidden'
                      }}>
                        <iframe
                          title="Mapa del punto de acopio"
                          width="100%"
                          height="100%"
                          style={{ border: 0, borderRadius: '15px' }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://maps.google.com/maps?q=${selectedPunto.ubicacion_gps}&output=embed`}
                        ></iframe>
                      </div>
                    </Col>
                  )}
                </Row>
              ) : (
                <div className="card-modern">
                  <div className="text-center py-5 p-3 p-md-4">
                    <FaMapMarkedAlt size={60} className="text-white-50 mb-3" />
                    <h5 className="text-white" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                      Selecciona un punto de acopio
                    </h5>
                    <p className="text-white-50 mb-0" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                      Elige un punto de la lista para ver más detalles
                    </p>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        )}

        {/* Información adicional */}
        <Row className="mt-4">
          <Col xs={12}>
            <Alert variant="info" className="fadeIn">
              <Alert.Heading style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                ℹ️ Información sobre los puntos de acopio
              </Alert.Heading>
              <ul className="mb-0 ps-3" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
                <li>En estos puntos puedes entregar tus residuos reciclables y obtener códigos QR para ganar puntos</li>
                <li>También puedes recoger los premios que hayas canjeado en la tienda</li>
                <li>Cada punto está atendido por un recolector verificado de EcoPuntos</li>
              </ul>
            </Alert>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Mapa;
