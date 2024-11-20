import React from "react";
import actividades from "../static/img/actividades.png";
import asesoria_psicologica from "../static/img/asesoria_psicologica.png";
import estudio from "../static/img/estudio.png";

function Iniciosection1() {
  return (
    <div className="inicio-container">
      <h2 className="inicio-titulo">Los diferentes servicios</h2>

      <div className="inicio-cards-container">
        <div className="inicio-card">
          <h3 className="inicio-card-titulo">Asesoría Psicológica</h3>
          <img
            className="inicio-card-imagen"
            src={asesoria_psicologica}
            alt="Asesoría Psicológica"
          />
          <p className="inicio-card-texto">
            El servicio de asesoría psicológica del SENA ofrece apoyo emocional y mental a los estudiantes.
            Proporciona un espacio confidencial para tratar problemas como el estrés académico, la ansiedad y la depresión.
          </p>
        </div>

        <div className="inicio-card">
          <h3 className="inicio-card-titulo">Actividades Recreativas</h3>
          <img
            className="inicio-card-imagen"
            src={asesoria_psicologica}
            alt="Actividades Recreativas"
          />
          <p className="inicio-card-texto">
          Las actividades recreativas en el SENA promueven el desarrollo integral de los estudiantes 
          fuera del ámbito académico, con eventos deportivos, culturales y recreativos fomentando el trabajo en equipo.
          </p>
        </div>

        <div className="inicio-card">
          <h3 className="inicio-card-titulo">Apoyo Académico</h3>
          <img
            className="inicio-card-imagen"
            src={estudio}
            alt="Apoyo Académico"
          />
          <p className="inicio-card-texto">
            El apoyo académico del SENA proporciona asistencia para mejorar el rendimiento educativo de los estudiantes.
            Ofrece tutorías personalizadas, talleres de técnicas de estudio y asesoría .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Iniciosection1;
