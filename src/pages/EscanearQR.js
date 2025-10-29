import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { clienteService } from '../services/clienteService';
import { FaQrcode, FaCheckCircle, FaCoins, FaCamera, FaKeyboard } from 'react-icons/fa';
import { Html5Qrcode } from 'html5-qrcode';
import '../css/home-modern.css';

const EscanearQR = () => {
  const { user, updateUser } = useAuth();
  const { success, error } = useNotification();
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [activeTab, setActiveTab] = useState('manual');
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [lastScannedCode, setLastScannedCode] = useState('');
  const html5QrCodeRef = useRef(null);

  // Cargar cámaras disponibles
  useEffect(() => {
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        setCameras(devices);
        setSelectedCamera(devices[0].id);
      }
    }).catch(err => {
      console.error('Error al obtener cámaras:', err);
    });

    return () => {
      stopScanning();
    };
    // eslint-disable-next-line
  }, []);

  const startScanning = async () => {
    if (!selectedCamera) {
      error('No se detectó ninguna cámara');
      return;
    }

    try {
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      
      await html5QrCodeRef.current.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // QR escaneado exitosamente - evitar duplicados
          const upperCode = decodedText.toUpperCase();
          if (upperCode === lastScannedCode) {
            return; // Ignorar si es el mismo código
          }
          
          console.log('QR escaneado:', upperCode);
          setLastScannedCode(upperCode);
          setCodigo(upperCode);
          stopScanning();
          setActiveTab('manual');
          // NO mostrar notificación aquí, se mostrará al reclamar
        },
        (errorMessage) => {
          // Error al escanear (normal mientras busca)
        }
      );
      
      setScanning(true);
    } catch (err) {
      console.error('Error al iniciar scanner:', err);
      error('No se pudo acceder a la cámara. Verifica los permisos.');
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current && scanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        setScanning(false);
      } catch (err) {
        console.error('Error al detener scanner:', err);
      }
    }
  };

  const handleTabChange = (tab) => {
    setLastScannedCode(''); // Reset del último código escaneado
    if (tab === 'camera') {
      setActiveTab(tab);
      setTimeout(() => startScanning(), 100);
    } else {
      stopScanning();
      setActiveTab(tab);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      error('Por favor ingresa un código QR');
      return;
    }

    setLoading(true);

    try {
      const data = await clienteService.reclamarPuntos(codigo.trim().toUpperCase());
      setResultado(data);
      setShowModal(true);
      
      // Actualizar puntos del usuario con el total actualizado del backend
      if (user && data.nuevos_puntos_totales !== undefined) {
        updateUser({ puntos: data.nuevos_puntos_totales });
      }
      
      // Solo UNA notificación de éxito
      success(`¡Felicidades! Ganaste ${data.puntos_ganados} puntos. Total: ${data.nuevos_puntos_totales}`);
      setCodigo('');
      setLastScannedCode(''); // Limpiar para permitir escanear de nuevo
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al reclamar puntos';
      error(mensaje);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setResultado(null);
  };

  return (
    <section className="section-dark" style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '50px' }}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} xl={8}>
            <div className="cta-box">
              <div className="text-center mb-4">
                <FaQrcode size={50} className="text-gradient mb-3" style={{ fontSize: 'clamp(40px, 8vw, 60px)' }} />
                <h2 className="section-title mb-2" style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>
                  Escanear Código QR
                </h2>
                <p className="text-white-50" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
                  Usa la cámara o ingresa el código manualmente
                </p>
              </div>

              <Alert variant="info" className="mb-4 fadeIn">
                <Alert.Heading style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                  📱 ¿Cómo funciona?
                </Alert.Heading>
                <ol className="mb-0 ps-3" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
                  <li>Entrega tus residuos reciclables a un recolector autorizado</li>
                  <li>El recolector te generará un código QR único</li>
                  <li>Escanea el QR con la cámara o ingresa el código manualmente</li>
                  <li>¡Recibe tus puntos al instante!</li>
                </ol>
              </Alert>

              <Tabs
                activeKey={activeTab}
                onSelect={handleTabChange}
                className="mb-4"
                fill
              >
                <Tab 
                  eventKey="manual" 
                  title={
                    <span style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                      <FaKeyboard className="me-2" />
                      <span className="d-none d-sm-inline">Ingresar </span>Código
                    </span>
                  }
                >
                  <div className="p-2 p-md-3">
                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-4">
                        <Form.Label className="form-label-modern" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                          Código QR
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={codigo}
                          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                          placeholder="Ej: PELO273718"
                          className="form-control-modern text-center"
                          style={{ fontSize: '1.5rem', letterSpacing: '3px', fontWeight: 'bold', textTransform: 'uppercase' }}
                          maxLength={20}
                        />
                        <Form.Text className="text-white-50">
                          El código generalmente tiene 10 caracteres (Ej: PELO273718)
                        </Form.Text>
                      </Form.Group>

                      <Button
                        type="submit"
                        className="btn-modern w-100"
                        disabled={loading || !codigo.trim()}
                        style={{ fontSize: '1.2rem', padding: '0.9rem 0' }}
                      >
                        {loading ? (
                          <>
                            <div className="spinner-modern me-2" style={{ width: '18px', height: '18px', display: 'inline-block', verticalAlign: 'middle' }}></div>
                            Reclamando...
                          </>
                        ) : (
                          <>
                            <FaCoins className="me-2" />
                            Reclamar Puntos
                          </>
                        )}
                      </Button>
                    </Form>
                  </div>
                </Tab>

                <Tab 
                  eventKey="camera" 
                  title={
                    <span>
                      <FaCamera className="me-2" />
                      Usar Cámara
                    </span>
                  }
                >
                  <div className="p-4">
                    {cameras.length > 0 && (
                      <Form.Group className="mb-4">
                        <Form.Label className="form-label-modern">
                          Seleccionar Cámara
                        </Form.Label>
                        <Form.Select
                          value={selectedCamera || ''}
                          onChange={(e) => setSelectedCamera(e.target.value)}
                          className="form-control-modern"
                        >
                          {cameras.map((camera, index) => (
                            <option key={camera.id} value={camera.id}>
                              {camera.label || `Cámara ${index + 1}`}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    )}

                    <div 
                      id="qr-reader" 
                      style={{ 
                        width: '100%',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid var(--border-green)'
                      }}
                    ></div>

                    {!scanning && cameras.length > 0 && (
                      <Button
                        onClick={startScanning}
                        className="btn-modern w-100 mt-3"
                      >
                        <FaCamera className="me-2" />
                        Iniciar Cámara
                      </Button>
                    )}

                    {scanning && (
                      <Button
                        onClick={stopScanning}
                        variant="danger"
                        className="w-100 mt-3"
                      >
                        Detener Cámara
                      </Button>
                    )}

                    {cameras.length === 0 && (
                      <Alert variant="warning" className="mt-4">
                        No se detectaron cámaras. Usa la opción "Ingresar Código" para continuar.
                      </Alert>
                    )}
                  </div>
                </Tab>
              </Tabs>

              <div className="benefit-card text-center p-4">
                <h5 className="text-white mb-2">Tus puntos actuales:</h5>
                <h2 className="text-gradient mb-0" style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>
                  <FaCoins className="me-2" />
                  {user?.puntos || 0} puntos
                </h2>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal de éxito */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Body className="text-center p-5" style={{
          background: 'linear-gradient(135deg, var(--primary-green) 0%, var(--secondary-green) 100%)',
          color: 'white',
          borderRadius: '15px'
        }}>
          <FaCheckCircle size={80} className="mb-3" style={{ color: '#4ade80' }} />
          <h2 className="mb-3" style={{ fontSize: '2.2rem' }}>¡Puntos Reclamados!</h2>
          
          {resultado && (
            <>
              <div className="mb-3 p-3" style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '10px'
              }}>
                <h3 className="mb-2" style={{ fontSize: '1.8rem' }}>
                  <FaCoins className="me-2" />
                  +{resultado.puntos_ganados} puntos
                </h3>
                <p className="mb-0" style={{ fontSize: '1.1rem' }}>
                  Material: <strong>{resultado.tipo_residuo || 'Reciclable'}</strong>
                </p>
              </div>

              <p className="mb-3" style={{ fontSize: '1.2rem' }}>
                Ahora tienes <strong>{resultado.nuevos_puntos_totales}</strong> puntos totales
              </p>
            </>
          )}

          <Button
            variant="light"
            size="lg"
            onClick={handleCloseModal}
            style={{
              fontWeight: 'bold',
              padding: '12px 35px',
              fontSize: '1.2rem',
              borderRadius: '10px'
            }}
          >
            ¡Genial!
          </Button>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default EscanearQR;
