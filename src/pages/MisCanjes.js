import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { clienteService } from '../services/clienteService';
import { useNotification } from '../context/NotificationContext';
import { FaGift, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

const MisCanjes = () => {
  const { error } = useNotification();
  const [canjes, setCanjes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCanjes();
  }, []);

  const loadCanjes = async () => {
    try {
      const data = await clienteService.getMisCanjes();
      setCanjes(data);
    } catch (err) {
      error('Error al cargar tus canjes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 20%, rgba(79, 172, 254, 0.15) 0%, rgba(0, 0, 0, 1) 60%)',
      paddingTop: '100px',
      paddingBottom: '50px'
    }}>
      <Container>
        {/* Cabecera */}
        <Row className="mb-4">
          <Col>
            <h1 className="text-white mb-2">
              <FaGift className="me-3" />
              Mis Canjes
            </h1>
            <p className="text-white-50">Revisa el estado de tus premios canjeados</p>
          </Col>
        </Row>

        {/* Lista de canjes */}
        {canjes.length === 0 ? (
          <Alert variant="info">
            <Alert.Heading className="d-flex align-items-center">
              <FaGift className="me-2" />
              No tienes canjes pendientes
            </Alert.Heading>
            <p className="mb-0">
              Aún no has canjeado ningún premio. ¡Visita la tienda y elige tus recompensas!
            </p>
          </Alert>
        ) : (
          <Row className="g-4">
            {canjes.map((canje) => (
              <Col key={canje.id_transaccion} md={6} lg={4}>
                <Card className="h-100 shadow-sm" style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(79, 172, 254, 0.3)',
                  borderRadius: '15px'
                }}>
                  {canje.articulo_tienda?.imagen_url && (
                    <Card.Img
                      variant="top"
                      src={canje.articulo_tienda.imagen_url}
                      alt={canje.articulo_tienda.nombre}
                      style={{
                        height: '200px',
                        objectFit: 'cover',
                        borderTopLeftRadius: '15px',
                        borderTopRightRadius: '15px'
                      }}
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-3">
                      {canje.status === 'pendiente_recojo' && (
                        <Badge bg="warning" text="dark" className="p-2">
                          <FaClock className="me-1" />
                          Pendiente de Recojo
                        </Badge>
                      )}
                      {canje.status === 'entregada' && (
                        <Badge bg="success" className="p-2">
                          <FaCheckCircle className="me-1" />
                          Entregada
                        </Badge>
                      )}
                    </div>

                    <h5 className="text-white mb-2">
                      {canje.articulo_tienda?.nombre || 'Premio'}
                    </h5>
                    
                    <p className="text-white-50 mb-3 flex-grow-1">
                      {canje.articulo_tienda?.descripcion}
                    </p>

                    <div className="mb-3">
                      <small className="text-white-50">Canjeado el:</small>
                      <div className="text-white">
                        {formatFecha(canje.created_at)}
                      </div>
                    </div>

                    <div className="mb-3">
                      <small className="text-white-50">Puntos utilizados:</small>
                      <div className="text-primary fw-bold fs-5">
                        {Math.abs(canje.puntos)} puntos
                      </div>
                    </div>

                    {canje.punto_acopio && (
                      <div className="p-3 mt-auto" style={{
                        background: 'rgba(79, 172, 254, 0.1)',
                        borderRadius: '10px',
                        border: '1px solid rgba(79, 172, 254, 0.3)'
                      }}>
                        <div className="d-flex align-items-start mb-2">
                          <FaMapMarkerAlt className="text-primary mt-1 me-2" />
                          <div>
                            <h6 className="text-white mb-1">Punto de Recojo:</h6>
                            <p className="text-white-50 mb-1 small">
                              {canje.punto_acopio.nombre_lugar}
                            </p>
                            <p className="text-white-50 mb-0 small">
                              📍 {canje.punto_acopio.direccion}
                            </p>
                          </div>
                        </div>
                        
                        {canje.punto_acopio.ubicacion_gps && canje.status === 'pendiente_recojo' && (
                          <a
                            href={`https://www.google.com/maps?q=${canje.punto_acopio.ubicacion_gps}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary w-100 mt-2"
                          >
                            Ver en Google Maps
                          </a>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Información adicional */}
        {canjes.length > 0 && (
          <Row className="mt-4">
            <Col>
              <Alert variant="info">
                <Alert.Heading className="h6">
                  💡 Información importante
                </Alert.Heading>
                <ul className="mb-0 ps-3">
                  <li>Recoge tu premio en el punto de acopio seleccionado durante el horario de atención</li>
                  <li>Presenta tu DNI registrado en EcoPuntos para retirar tu premio</li>
                  <li>Los premios tienen un plazo de 30 días para ser recogidos</li>
                </ul>
              </Alert>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default MisCanjes;
