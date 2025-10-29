import React, { useState } from 'react';
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

const Contacto = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="contactar">
      <section className="Contacto" id="Contacto">
        <div className="contenido-superior">
          <div className="columna-izquierda">
            <img src="/img/ecopuntos.png" alt="contaceco" />
            <p>
              Puedes contactar a través de nuestras redes sociales para mayor información e indagar 
              de nuestro trabajo y incorporarte, estaremos atentos a su contacto
            </p>
            <div className="formulario-contacto">
              <input 
                type="text" 
                placeholder="Escribe tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button>Enviar</button>
            </div>
          </div>
          
          <div className="columna-derecha">
            <div className="info-columna">
              <p>WelC PAIM</p>
              <ul>
                <li>Llamadas</li>
                <li>Contactos</li>
                <li>Empresariales</li>
              </ul>
            </div>
            
            <div className="info-columna">
              <p>Rigthets</p>
              <ul>
                <li>Curriculum</li>
                <li>Archivos</li>
                <li>Videos</li>
                <li>Imagenes</li>
                <li>Referencias</li>
              </ul>
            </div>
            
            <div className="info-columna">
              <p>Printing To</p>
              <ul>
                <li><div className="icono">📞</div> +51 987 654 321</li>
                <li><div className="icono">✉</div> ecopuntoscorpotation@gmail.com</li>
                <li><div className="icono">📍</div> Dirección: Calle La Colmena, Ave. Las Flores</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="contenido-inferior">
          <p>Nuestras redes</p>
          <div className="redes-sociales">
            <div className="icono">f</div>
            <div className="icono">@</div>
            <div className="icono">✔</div>
            <div className="icono">in</div>
          </div>
          <p>© 2025 - Plataforma Eco Puntos - Ingeniería Web</p>
        </div>
      </section>
    </div>
  );
};

export default Contacto;