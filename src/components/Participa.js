import React from 'react';
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

const Participa = () => {
  return (
    <section className="Participa" id="Participa">
      <div className="Beneficios">
        <div className="header">
          <h1>Como te beneficias si aportas al medio ambiente</h1>
        </div>
        <p className="intro">
          Aparte de impulsar la causa de la colaboración con el reciclaje tambien queremos otrogar
          un incentivo para que esto haga a que los usuarios quieran seguir colaborando y tambien disfruten de 
          sus labores al reciblar
        </p>
        <div className="beneficios-container">
          <div className="beneficio-card">
            <img src="/img/botellas.jpg" alt="botellas" />
            <div className="beneficio-content">
              <h5>Acumula reciclos</h5>
              <p>Por cada envase depositado en los contenedores o en las máquinas obtendrás 1 moneda virtual</p>
            </div>
          </div>
          
          <div className="beneficio-card">
            <img src="/img/puntos.png" alt="puntos" />
            <div className="beneficio-content">
              <h5>Consigue premios</h5>
              <p>Canjea tus puntos por participar en sorteos o si lo prefieres, donalos a proyectos sociales y medio ambientales</p>
            </div>
          </div>
        </div>
      </div>

      <div className="canjeaP">
        <div className="imagen-container">
          <img src="/Img/canjea.png" alt="canjea" />
        </div>
        
        <div className="canjeaP-content">
          <h1 className="titulo-principal">¿Cómo gano puntos?</h1>
          <p className="descripcion">Es muy sencillo, para poder participar ganando puntos sigue los siguiente pasos:</p>
          
          <ul className="pasos-lista">
            <li className="paso-item">Haz una foto del contenido a depositar tus envases</li>
            <li className="paso-item">Deposita tus envases en el contenedor y consigue puntos</li>
            <li className="paso-item">Canjea tus RECICLOS por participar en sorteos, o si lo prefieres donalos a proyectos sociales y medio ambientales</li>
          </ul>
        </div>
      </div>

      <div className="premios">
        <div className="imagen-container-premios">
          <img src="/Img/premios.jpg" alt="premios" />
        </div>
        
        <div className="premios-content">
          <h1 className="titulo-premios">¿Qué premios puedes conseguir?</h1>
          <p className="descripcion-premios">
            Hacemos sorteos y puedes participar con nuestros puntos acumulados para acceder y llevarte los muchos premios
            que ofrecemos como incentivos a tu buena acción
          </p>
        </div>
      </div>
    </section>
  );
};

export default Participa;