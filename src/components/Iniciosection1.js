import React from "react";
import actividades from "../static/img/actividades.png";
import asesoria_psicologica from "../static/img/asesoria_psicologica.png";
import estudio from "../static/img/estudio.png";

function Iniciosection1() {
  return (
    <div>
      <section className="support-programs-container">
        <div className="support-programs">
          <h2 className="support-title">Los diferentes servicios</h2>

          <div className="support-cards">
            {/* Tarjeta Asesoría Psicológica */}
            <div className="support-card">
              <img
                className="support-image"
                src={asesoria_psicologica}
                alt="Asesoría Psicológica"
              />
              <div className="card-content">
                <h3 className="card-title">Asesoría Psicológica</h3>
                <p className="card-text">
                El servicio de asesoría psicológica del SENA brinda apoyo emocional
                y mental a los estudiantes, ofreciendo un espacio confidencial para tratar 
                problemas como estrés, ansiedad y depresión. Los estudiantes pueden acceder a
                sesiones individuales con psicólogos y participar en talleres para mejorar el manejo del estrés y el bienestar emocional.
                </p>
              </div>
            </div>

            {/* Tarjeta Actividades Recreativas */}
            <div className="support-card">
              <img className="support-image" src={actividades} alt="Actividades Recreativas" />
              <div className="card-content">
                <h3 className="card-title">Actividades Recreativas</h3>
                <p className="card-text">
                Las actividades recreativas del SENA promueven el desarrollo integral de los 
                estudiantes fuera del ámbito académico. Incluyen eventos deportivos, culturales y 
                recreativos que fomentan la participación, el trabajo en equipo y el bienestar físico y 
                mental, ayudando a los estudiantes a integrarse y disfrutar de una experiencia educativa más equilibrada.
                </p>
              </div>
            </div>

            {/* Tarjeta Apoyo Académico */}
            <div className="support-card">
              <img className="support-image" src={estudio} alt="Apoyo Académico" />
              <div className="card-content">
                <h3 className="card-title">Apoyo Académico</h3>
                <p className="card-text">
                El apoyo académico del SENA ayuda a mejorar el rendimiento de los estudiantes mediante tutorías
                 personalizadas, talleres de técnicas de estudio y asesoría en la planificación del tiempo. 
                 También ofrece materiales educativos y acceso a plataformas de aprendizaje para superar 
                 dificultades académicas y optimizar habilidades de estudio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Iniciosection1;
