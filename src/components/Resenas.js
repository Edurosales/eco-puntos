import React, { useState, useEffect, useCallback } from 'react';
import '.././App.css';
import '../css/main.css';
import '../css/inicio.css';
import '../css/campaña.css';
import '../css/IRL-3D.css';
import '../css/imagen.css';
import '../css/mapa.css';
import '../css/participa.css';
import '../css/cometarios.css';
import '../css/separte.css';
import '../css/contacta.css';

const Resenas = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  const comentarios = [
    { nombre: "María González", texto: "Excelente servicio, muy contenta con la atención recibida. Definitivamente recomiendo este lugar.", fecha: "15/03/2023" },
    { nombre: "Carlos Rodríguez", texto: "Productos de alta calidad y entrega rápida. Volveré a comprar sin duda.", fecha: "22/04/2023" },
    { nombre: "Ana Martínez", texto: "Muy buena relación calidad-precio. El envío llegó antes de lo esperado.", fecha: "05/05/2023" },
    { nombre: "Javier López", texto: "Atención al cliente excepcional. Resolvieron todas mis dudas rápidamente.", fecha: "18/05/2023" },
    { nombre: "Laura Sánchez", texto: "Me encantó la variedad de productos disponibles. Encontré justo lo que necesitaba.", fecha: "30/05/2023" },
    { nombre: "Pedro Ramírez", texto: "Buena experiencia en general, aunque el empaque podría mejorar un poco.", fecha: "12/06/2023" },
    { nombre: "Isabel Fernández", texto: "Muy satisfecha con mi compra. El producto superó mis expectativas.", fecha: "25/06/2023" },
    { nombre: "Miguel Torres", texto: "Rápido y eficiente. El proceso de compra fue muy sencillo e intuitivo.", fecha: "08/07/2023" },
    { nombre: "Elena Díaz", texto: "Recomiendo totalmente. La calidad es excelente y el precio muy competitivo.", fecha: "19/07/2023" },
    { nombre: "Roberto Vargas", texto: "Buen servicio postventa. Me ayudaron con una consulta después de la compra.", fecha: "02/08/2023" },
    { nombre: "Sofía Herrera", texto: "Entrega puntual y producto en perfectas condiciones. Muy contenta con la experiencia.", fecha: "14/08/2023" },
    { nombre: "David Morales", texto: "La página web es fácil de navegar y el proceso de pago muy seguro.", fecha: "27/08/2023" },
    { nombre: "Carmen Ruiz", texto: "Producto de buena calidad, aunque el tiempo de envío fue un poco largo.", fecha: "09/09/2023" },
    { nombre: "Fernando Castro", texto: "Excelente atención personalizada. Me sentí muy bien atendido en todo momento.", fecha: "22/09/2023" },
    { nombre: "Patricia Ortega", texto: "Volveré a comprar sin duda. La experiencia ha sido muy positiva en general.", fecha: "05/10/2023" }
  ];

  // Calcular slides según el tamaño de pantalla
  const calcularSlidesToShow = useCallback(() => {
    const width = window.innerWidth;
    if (width < 577) {
      return 1; // Móvil: 1 comentario por fila
    } else if (width < 992) {
      return 2; // Tablet: 2 comentarios por fila
    } else {
      return 3; // Desktop: 3 comentarios por fila
    }
  }, []);

  // Obtener iniciales del nombre
  const obtenerIniciales = (nombre) => {
    return nombre.split(' ').map(palabra => palabra[0]).join('').toUpperCase();
  };

  // Total de slides
  const totalSlides = Math.ceil(comentarios.length / slidesToShow);

  // Avanzar al siguiente slide automáticamente
  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Cambiar a un slide específico
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Manejar redimensionamiento de ventana
  const handleResize = useCallback(() => {
    const newSlidesToShow = calcularSlidesToShow();
    if (newSlidesToShow !== slidesToShow) {
      setSlidesToShow(newSlidesToShow);
      // Ajustar currentSlide si es necesario
      const newTotalSlides = Math.ceil(comentarios.length / newSlidesToShow);
      setCurrentSlide(prev => Math.min(prev, newTotalSlides - 1));
    }
  }, [calcularSlidesToShow, slidesToShow, comentarios.length]);

  // Manejar gestos táctiles
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const diff = touchStartY - endY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide(); // Deslizar hacia arriba
      } else {
        setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides); // Deslizar hacia abajo
      }
    }
  };

  const [touchStartY, setTouchStartY] = useState(0);

  useEffect(() => {
    // Inicializar slides según el tamaño de pantalla
    setSlidesToShow(calcularSlidesToShow());

    // Configurar event listener para redimensionamiento
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calcularSlidesToShow, handleResize]);

  useEffect(() => {
    // Auto-play automático en bucle cada 4 segundos
    const interval = setInterval(nextSlide, 4000);
    
    return () => {
      clearInterval(interval);
    };
  }, [nextSlide]);

  // Renderizar comentarios en filas
  const renderComentarios = () => {
    const rows = [];
    
    for (let i = 0; i < comentarios.length; i += slidesToShow) {
      const rowComentarios = [];
      
      for (let j = 0; j < slidesToShow; j++) {
        if (i + j < comentarios.length) {
          const comentario = comentarios[i + j];
          rowComentarios.push(
            <div key={i + j} className="comentario">
              <div className="comentario-header">
                <div className="comentario-imagen">
                  {obtenerIniciales(comentario.nombre)}
                </div>
                <div className="comentario-nombre">{comentario.nombre}</div>
              </div>
              <div className="comentario-texto">{comentario.texto}</div>
              <div className="comentario-fecha">{comentario.fecha}</div>
            </div>
          );
        }
      }
      
      rows.push(
        <div key={i} className="comentario-fila">
          {rowComentarios}
        </div>
      );
    }
    
    return rows;
  };

  // Calcular transformación para el track
  const slideHeight = 200; // Ajusta según tu CSS
  const trackStyle = {
    transform: `translateY(-${currentSlide * slideHeight}px)`,
    transition: 'transform 0.5s ease-in-out'
  };

  return (
    <div className="Resenas">
      <div className="header">
        <h1>Reseñas y opiniones de nuestros usuarios</h1>
      </div>
      
      <div 
        className="comentarios-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          id="comentariosTrack" 
          className="comentarios-track"
          style={trackStyle}
        >
          {renderComentarios()}
        </div>
      </div>
      
      <div className="indicadores">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`indicador ${index === currentSlide ? 'activo' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Resenas;