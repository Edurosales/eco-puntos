import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { publicService } from '../services/clienteService';
import '../css/home-modern.css';

const Reciclaje = () => {
  const [departamento, setDepartamento] = useState('');
  const [provincia, setProvincia] = useState('');
  const [distrito, setDistrito] = useState('');
  const [puntosAcopio, setPuntosAcopio] = useState([]);
  const [puntosFiltrados, setPuntosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPuntosAcopio();
  }, []);

  const loadPuntosAcopio = async () => {
    try {
      const data = await publicService.getPuntosAcopioPublico();
      setPuntosAcopio(data);
      setPuntosFiltrados(data);
    } catch (error) {
      console.error('Error al cargar puntos de acopio:', error);
      setPuntosAcopio([]);
      setPuntosFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    let filtrados = [...puntosAcopio];

    if (departamento) {
      filtrados = filtrados.filter(p => 
        p.departamento?.toLowerCase() === departamento.toLowerCase()
      );
    }

    if (provincia) {
      filtrados = filtrados.filter(p => 
        p.provincia?.toLowerCase() === provincia.toLowerCase()
      );
    }

    if (distrito) {
      filtrados = filtrados.filter(p => 
        p.distrito?.toLowerCase() === distrito.toLowerCase()
      );
    }

    setPuntosFiltrados(filtrados);
  };

  // Obtener listas únicas de departamentos, provincias y distritos
  const departamentos = [...new Set(puntosAcopio.map(p => p.departamento).filter(Boolean))];
  const provincias = departamento 
    ? [...new Set(puntosAcopio.filter(p => p.departamento === departamento).map(p => p.provincia).filter(Boolean))]
    : [];
  const distritos = provincia
    ? [...new Set(puntosAcopio.filter(p => p.provincia === provincia).map(p => p.distrito).filter(Boolean))]
    : [];

  // Generar URL del mapa con todos los marcadores
  const getMapUrl = () => {
    if (puntosFiltrados.length === 0) return null;
    
    // Si hay un solo punto, centrar en él
    if (puntosFiltrados.length === 1) {
      return `https://maps.google.com/maps?q=${puntosFiltrados[0].ubicacion_gps}&output=embed&z=15`;
    }
    
    // Si hay múltiples puntos, usar el centro de Perú por defecto
    return `https://maps.google.com/maps?q=-12.046374,-77.042793&output=embed&z=12`;
  };

  const sedes = [
    "PCR Santa Clara", "PCR Ceres Medio", "PCR Vitarte", "PCR Huaycan",
    "PCR Puruchuco", "PCR Gloria", "PCR Las AMERICAS", "PCR Horacio"
  ];

  const aliados = [
    "biotu.jpg", "tagline.avif", "ecocargas.png", "yourcompany.jpg",
    "redonsella.jpg", "biotu.jpg", "newbalance.png", "company.jpg", "levi's.png"
  ];

  return (
    <>
      {/* Sección 3R */}
      <section className="section-dark section-spacer">
        <Container>
          <h2 className="section-title">Tenemos Presentes las 3R del Cambio</h2>
          <p className="section-subtitle">
            En conjunto, estas tres acciones conocidas como la regla de las "3R" tienen como objetivo 
            disminuir la generación de basura y el impacto ambiental de las actividades humanas, 
            promoviendo un consumo más responsable y una gestión más sostenible de los recursos.
          </p>
          
          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="card-modern text-center fadeIn">
                <img src="/img/Reduce.png" alt="Reduce" className="img-fluid mb-3" style={{ maxHeight: '150px' }} />
                <h3 className="text-gradient fs-4 fw-bold mb-3">Reduce</h3>
                <p className="text-white-50">
                  Consumir menos y de manera más consciente para generar menos residuos, 
                  por ejemplo, evitando productos de un solo uso o comprando solo lo necesario.
                </p>
              </div>
            </Col>
            
            <Col lg={4} md={6}>
              <div className="card-modern text-center fadeIn">
                <img src="/img/Reutilización.png" alt="Reutiliza" className="img-fluid mb-3" style={{ maxHeight: '150px' }} />
                <h3 className="text-gradient fs-4 fw-bold mb-3">Reutiliza</h3>
                <p className="text-white-50">
                  Darle una segunda vida a un objeto, encontrando nuevos usos para él en lugar de tirarlo, 
                  como usar frascos de vidrio para guardar alimentos o transformar ropa vieja en trapos de limpieza.
                </p>
              </div>
            </Col>
            
            <Col lg={4} md={6}>
              <div className="card-modern text-center fadeIn">
                <img src="/img/recicla.png" alt="Recicla" className="img-fluid mb-3" style={{ maxHeight: '150px' }} />
                <h3 className="text-gradient fs-4 fw-bold mb-3">Recicla</h3>
                <p className="text-white-50">
                  Transformar materiales de desecho en nuevas materias primas para la creación de productos nuevos, 
                  separando correctamente los residuos para que puedan ser procesados en la industria.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección Mapa */}
      <section className="map-section section-spacer" id="Reciclaje">
        <Container>
          <h2 className="section-title">Ubica Nuestras Instalaciones de Reciclaje</h2>
          <p className="section-subtitle">
            Tenemos {puntosAcopio.length} punto{puntosAcopio.length !== 1 ? 's' : ''} localizado{puntosAcopio.length !== 1 ? 's' : ''} para que puedan depositar sus elementos acumulados en reciclaje 
            y así ayudar con su aporte a la sociedad.
          </p>
          
          {/* Filtros */}
          <div className="filter-container mb-4">
            <Form>
              <Row className="g-3">
                <Col md={3}>
                  <Form.Label className="form-label-modern">
                    <i className="fas fa-map-marked-alt me-2"></i>
                    Departamento
                  </Form.Label>
                  <Form.Select 
                    className="form-control-modern"
                    value={departamento}
                    onChange={(e) => {
                      setDepartamento(e.target.value);
                      setProvincia('');
                      setDistrito('');
                    }}
                  >
                    <option value="">Todos</option>
                    {departamentos.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </Form.Select>
                </Col>
                
                <Col md={3}>
                  <Form.Label className="form-label-modern">
                    <i className="fas fa-map me-2"></i>
                    Provincia
                  </Form.Label>
                  <Form.Select 
                    className="form-control-modern"
                    value={provincia}
                    onChange={(e) => {
                      setProvincia(e.target.value);
                      setDistrito('');
                    }}
                    disabled={!departamento}
                  >
                    <option value="">Todas</option>
                    {provincias.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </Form.Select>
                </Col>
                
                <Col md={3}>
                  <Form.Label className="form-label-modern">
                    <i className="fas fa-map-pin me-2"></i>
                    Distrito
                  </Form.Label>
                  <Form.Select 
                    className="form-control-modern"
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                    disabled={!provincia}
                  >
                    <option value="">Todos</option>
                    {distritos.map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </Form.Select>
                </Col>
                
                <Col md={3} className="d-flex align-items-end">
                  <Button 
                    className="btn-modern w-100"
                    onClick={handleBuscar}
                  >
                    <i className="fas fa-search me-2"></i>
                    Buscar
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          
          {/* Mapa */}
          <div className="map-container">
            {loading ? (
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="spinner-modern"></div>
              </div>
            ) : getMapUrl() ? (
              <iframe
                title="Mapa de puntos de reciclaje"
                src={getMapUrl()}
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100">
                <p className="text-white-50">No hay puntos de acopio disponibles</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Sección Centrales */}
      <section className="section-dark section-spacer">
        <Container>
          <h2 className="section-title">Contáctanos con lugares en partes centralizadas</h2>
          <Row className="g-4">
            {sedes.map((sede, index) => (
              <Col key={index} lg={3} md={4} sm={6}>
                <div className="card-modern text-center">
                  <img src="/img/estadoR.webp" alt="Estado R" className="img-fluid rounded mb-3" />
                  <h5 className="text-white fw-semibold">{sede}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Sección Aliados */}
      <section className="section-dark section-spacer pb-5">
        <Container>
          <h2 className="section-title">Conoce a nuestros aliados</h2>
          <p className="section-subtitle">
            Tenemos convenios con marcas importantes en el rubro industrial que también 
            buscan familiarizarse con la innovación y la sostenibilidad para mejorar sus empresas. 
            Así, forjamos alianzas y aumentamos el incentivo para reciclar.
          </p>
          
          <Row className="g-4 align-items-center justify-content-center">
            {aliados.map((aliado, index) => (
              <Col key={index} lg={2} md={3} sm={4} xs={6}>
                <div className="benefit-card text-center p-3">
                  <img 
                    src={`/img/${aliado}`} 
                    alt={aliado.split('.')[0]} 
                    className="img-fluid"
                    style={{ maxHeight: '80px', objectFit: 'contain' }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Reciclaje;