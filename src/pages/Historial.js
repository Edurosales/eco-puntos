import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, ButtonGroup, Spinner, Alert } from 'react-bootstrap';
import { clienteService } from '../services/clienteService';
import { useNotification } from '../context/NotificationContext';
import { FaHistory, FaArrowUp, FaArrowDown, FaRecycle, FaGift } from 'react-icons/fa';
import '../css/home-modern.css';

const Historial = () => {
  const { error } = useNotification();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState(null); // null = todos, 'ganado', 'canjeado'

  useEffect(() => {
    loadHistorial();
  }, [filtro]);

  const loadHistorial = async () => {
    setLoading(true);
    try {
      const data = await clienteService.getMiHistorial(filtro);
      setHistorial(data);
    } catch (err) {
      error('Error al cargar el historial');
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

  return (
    <section className="section-dark" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '50px' }}>
      <Container>
        {/* Cabecera */}
        <Row className="mb-4">
          <Col xs={12}>
            <h1 className="section-title mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              <FaHistory className="me-2 me-md-3" />
              Mi Historial
            </h1>
            <p className="text-white-50" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
              Revisa todas tus transacciones de puntos
            </p>
          </Col>
        </Row>

        {/* Filtros */}
        <Row className="mb-4">
          <Col xs={12} className="d-flex justify-content-center">
            <ButtonGroup style={{ width: '100%', maxWidth: '700px' }} className="flex-wrap flex-sm-nowrap">
              <Button
                className={filtro === null ? 'btn-modern' : 'btn-outline-modern'}
                onClick={() => setFiltro(null)}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)', padding: 'clamp(0.4rem, 1vw, 0.75rem) clamp(0.5rem, 2vw, 1rem)' }}
              >
                Todos
              </Button>
              <Button
                className={filtro === 'ganado' ? 'btn-modern' : 'btn-outline-modern'}
                onClick={() => setFiltro('ganado')}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)', padding: 'clamp(0.4rem, 1vw, 0.75rem) clamp(0.5rem, 2vw, 1rem)' }}
              >
                <FaArrowUp className="me-1 me-sm-2" />
                <span className="d-none d-sm-inline">Puntos </span>Ganados
              </Button>
              <Button
                className={filtro === 'canjeado' ? 'btn-modern' : 'btn-outline-modern'}
                onClick={() => setFiltro('canjeado')}
                style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)', padding: 'clamp(0.4rem, 1vw, 0.75rem) clamp(0.5rem, 2vw, 1rem)' }}
              >
                <FaArrowDown className="me-1 me-sm-2" />
                <span className="d-none d-sm-inline">Puntos </span>Canjeados
              </Button>
            </ButtonGroup>
          </Col>
        </Row>

        {/* Tabla de historial */}
        <Row className="justify-content-center">
          <Col xs={12}>
            <div className="card-modern">
              <div className="p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-modern mx-auto" style={{ width: '40px', height: '40px' }}></div>
                  </div>
                ) : historial.length === 0 ? (
                  <Alert variant="info" className="m-3 m-md-4 fadeIn">
                    <Alert.Heading style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>
                      No hay transacciones
                    </Alert.Heading>
                    <p className="mb-0" style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                      {filtro === 'ganado' && 'Aún no has ganado puntos. ¡Empieza a reciclar!'}
                      {filtro === 'canjeado' && 'Aún no has canjeado puntos. ¡Visita la tienda!'}
                      {filtro === null && 'No tienes transacciones registradas aún.'}
                    </p>
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table hover variant="dark" className="mb-0">
                      <thead style={{
                        background: 'rgba(0, 255, 0, 0.15)',
                        position: 'sticky',
                        top: 0,
                        borderBottom: '2px solid var(--border-green)',
                        fontSize: 'clamp(0.75rem, 2vw, 0.95rem)'
                      }}>
                        <tr>
                          <th className="d-none d-md-table-cell">Fecha</th>
                          <th>Tipo</th>
                          <th>Detalles</th>
                          <th className="d-none d-lg-table-cell">Punto de Acopio</th>
                          <th className="text-center">Puntos</th>
                          <th className="text-center d-none d-sm-table-cell">Estado</th>
                        </tr>
                      </thead>
                      <tbody style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
                        {historial.map((trans) => (
                          <tr key={trans.id_transaccion}>
                            <td className="text-white-50 d-none d-md-table-cell" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)' }}>
                              {formatFecha(trans.created_at)}
                            </td>
                            <td>
                              {trans.tipo === 'ganado' ? (
                                <Badge bg="success" className="p-2" style={{ background: 'var(--primary-green)', color: '#000', fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)' }}>
                                  <FaRecycle className="me-1" />
                                  <span className="d-none d-sm-inline">Reciclaje</span>
                                </Badge>
                              ) : (
                                <Badge bg="warning" className="p-2" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)' }}>
                                  <FaGift className="me-1" />
                                  <span className="d-none d-sm-inline">Canje</span>
                                </Badge>
                              )}
                            </td>
                            <td className="text-white">
                              {trans.tipo === 'ganado' ? (
                                <>
                                  <strong style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
                                    {trans.tipo_residuo}
                                  </strong>
                                  <br />
                                  <small className="text-white-50" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>
                                    {trans.cantidad_kg} kg
                                  </small>
                                </>
                              ) : (
                                <>
                                  <strong style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
                                    {trans.articulo_tienda?.nombre || 'Artículo'}
                                  </strong>
                                  <br />
                                  <small className="text-white-50 d-none d-sm-inline" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)' }}>
                                    {trans.articulo_tienda?.descripcion}
                                  </small>
                                </>
                              )}
                            </td>
                            <td className="text-white-50 d-none d-lg-table-cell" style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)' }}>
                              {trans.punto_acopio ? (
                                <>
                                  <div>{trans.punto_acopio.nombre_lugar}</div>
                                  <small>{trans.punto_acopio.direccion}</small>
                                </>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td className="text-center">
                              <strong style={{
                                color: trans.tipo === 'ganado' ? 'var(--primary-green)' : '#fa709a',
                                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
                              }}>
                                {trans.tipo === 'ganado' ? '+' : '-'}{Math.abs(trans.puntos)}
                              </strong>
                            </td>
                            <td className="text-center d-none d-sm-table-cell">
                              {trans.status === 'completada' && (
                                <Badge bg="success" style={{ background: 'var(--primary-green)', color: '#000', fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>
                                  Completada
                                </Badge>
                              )}
                              {trans.status === 'pendiente_recojo' && (
                                <Badge bg="warning" text="dark" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>
                                  Pendiente
                                </Badge>
                              )}
                              {trans.status === 'entregada' && (
                                <Badge bg="info" style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)' }}>
                                  Entregada
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Estadísticas resumidas */}
        {!loading && historial.length > 0 && (
          <Row className="mt-4 justify-content-center">
            <Col xs={12}>
              <Row className="g-3">
                <Col xs={12} sm={6}>
                  <div className="benefit-card text-center p-3 p-md-4">
                    <h6 className="text-white-50 mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
                      Total de transacciones mostradas
                    </h6>
                    <h3 className="text-gradient mb-0" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                      {historial.length}
                    </h3>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div className="benefit-card text-center p-3 p-md-4">
                    <h6 className="text-white-50 mb-2" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
                      Puntos en estas transacciones
                    </h6>
                    <h3 className="text-gradient mb-0" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
                      {historial.reduce((sum, trans) => sum + Math.abs(trans.puntos), 0)} pts
                    </h3>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default Historial;
