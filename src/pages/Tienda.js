import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { generalService, clienteService } from '../services/clienteService';
import { FaStore, FaCoins, FaShoppingCart, FaMapMarkerAlt } from 'react-icons/fa';
import '../css/home-modern.css';

const Tienda = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotification();
  const [articulos, setArticulos] = useState([]);
  const [puntosAcopio, setPuntosAcopio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [selectedPuntoAcopio, setSelectedPuntoAcopio] = useState('');
  const [canjeando, setCanjeando] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [articulosData, puntosData] = await Promise.all([
        generalService.getArticulos(),
        clienteService.getPuntosAcopio()
      ]);
      setArticulos(articulosData);
      setPuntosAcopio(puntosData);
    } catch (err) {
      error('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCanjear = (articulo) => {
    if ((user?.puntos || 0) < articulo.puntos_requeridos) {
      error('No tienes suficientes puntos para este artículo');
      return;
    }
    setSelectedArticulo(articulo);
    setShowModal(true);
  };

  const handleConfirmarCanje = async () => {
    if (!selectedPuntoAcopio) {
      error('Por favor selecciona un punto de acopio para recoger tu premio');
      return;
    }

    setCanjeando(true);

    try {
      const data = await clienteService.canjearPuntos(
        selectedArticulo.id_articulo,
        selectedPuntoAcopio
      );
      
      success(`¡Canje exitoso! Puedes recoger tu premio en el punto de acopio seleccionado`);
      
      // Actualizar puntos del usuario
      if (user && selectedArticulo) {
        updateUser({ puntos: (user.puntos || 0) - selectedArticulo.puntos_requeridos });
      }
      
      setShowModal(false);
      setSelectedArticulo(null);
      setSelectedPuntoAcopio('');
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al canjear puntos';
      error(mensaje);
      console.error(err);
    } finally {
      setCanjeando(false);
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
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div>
                <h1 className="section-title mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                  <FaStore className="me-2 me-md-3" />
                  Tienda de Premios
                </h1>
                <p className="text-white-50" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
                  Canjea tus puntos por increíbles premios
                </p>
              </div>
              <div className="benefit-card text-center p-3" style={{ minWidth: 'clamp(150px, 30vw, 200px)' }}>
                <p className="text-white-50 mb-1" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
                  Tus Puntos
                </p>
                <h3 className="text-gradient mb-0" style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)' }}>
                  <FaCoins className="me-2" />
                  {user?.puntos || 0}
                </h3>
              </div>
            </div>
          </Col>
        </Row>

        {/* Catálogo de artículos */}
        {articulos.length === 0 ? (
          <Alert variant="info" className="fadeIn">
            <Alert.Heading style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
              No hay artículos disponibles
            </Alert.Heading>
            <p className="mb-0" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
              Pronto habrán nuevos premios para canjear. ¡Sigue reciclando!
            </p>
          </Alert>
        ) : (
          <Row className="g-3 g-md-4">
            {articulos.map((articulo) => {
              const puedesCanjear = (user?.puntos || 0) >= articulo.puntos_requeridos;
              
              return (
                <Col key={articulo.id_articulo} xs={12} sm={6} md={6} lg={4} xl={3}>
                  <div className="card-modern h-100" style={{
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {articulo.imagen_url && (
                      <img
                        src={articulo.imagen_url}
                        alt={articulo.nombre}
                        style={{ 
                          width: '100%', 
                          height: 'clamp(150px, 30vw, 200px)', 
                          objectFit: 'cover', 
                          borderRadius: '15px 15px 0 0' 
                        }}
                      />
                    )}
                    <div className="p-3 d-flex flex-column" style={{ flex: 1 }}>
                      <div className="mb-2">
                        {articulo.stock > 0 ? (
                          <Badge bg="success" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)' }}>
                            En Stock ({articulo.stock})
                          </Badge>
                        ) : (
                          <Badge bg="danger" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)' }}>
                            Agotado
                          </Badge>
                        )}
                      </div>
                      <h5 className="text-white mb-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                        {articulo.nombre}
                      </h5>
                      <p className="text-white-50 flex-grow-1" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                        {articulo.descripcion}
                      </p>
                      <div className="mt-3">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <Badge className="p-2" style={{ 
                            background: 'var(--primary-green)', 
                            color: '#000',
                            fontSize: 'clamp(0.85rem, 2vw, 1rem)'
                          }}>
                            <FaCoins className="me-1" />
                            {articulo.puntos_requeridos} pts
                          </Badge>
                        </div>
                        <Button
                          className={puedesCanjear ? 'btn-modern w-100' : 'w-100'}
                          variant={puedesCanjear ? '' : 'secondary'}
                          onClick={() => handleCanjear(articulo)}
                          disabled={!puedesCanjear || articulo.stock === 0}
                        >
                          {articulo.stock === 0 ? 'Agotado' : puedesCanjear ? (
                            <>
                              <FaShoppingCart className="me-2" />
                              Canjear
                            </>
                          ) : (
                            `Necesitas ${articulo.puntos_requeridos - (user?.puntos || 0)} pts más`
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      {/* Modal de confirmación de canje */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          borderBottom: '2px solid var(--border-green)'
        }}>
          <Modal.Title>Confirmar Canje</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white'
        }}>
          {selectedArticulo && (
            <>
              <div className="text-center mb-3">
                {selectedArticulo.imagen_url && (
                  <img
                    src={selectedArticulo.imagen_url}
                    alt={selectedArticulo.nombre}
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px' }}
                  />
                )}
                <h5 className="mt-3">{selectedArticulo.nombre}</h5>
                <p className="text-white-50">{selectedArticulo.descripcion}</p>
              </div>

              <Alert variant="info" className="fadeIn">
                <strong>Costo:</strong> {selectedArticulo.puntos_requeridos} puntos<br />
                <strong>Tu saldo después:</strong> {(user?.puntos || 0) - selectedArticulo.puntos_requeridos} puntos
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label className="form-label-modern">
                  <FaMapMarkerAlt className="me-2" />
                  Selecciona dónde recoger tu premio:
                </Form.Label>
                <Form.Select
                  value={selectedPuntoAcopio}
                  onChange={(e) => setSelectedPuntoAcopio(e.target.value)}
                  className="form-control-modern"
                >
                  <option value="">-- Selecciona un punto de acopio --</option>
                  {puntosAcopio.map((punto) => (
                    <option key={punto.id_acopio} value={punto.id_acopio}>
                      {punto.nombre_lugar} - {punto.direccion}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-white-50">
                  Deberás recoger tu premio en el punto de acopio seleccionado
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{
          background: 'rgba(0, 0, 0, 0.9)',
          borderTop: '2px solid var(--border-green)'
        }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            className="btn-modern"
            onClick={handleConfirmarCanje}
            disabled={!selectedPuntoAcopio || canjeando}
          >
            {canjeando ? (
              <>
                <div className="spinner-modern me-2" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' }}></div>
                Canjeando...
              </>
            ) : 'Confirmar Canje'}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Tienda;
