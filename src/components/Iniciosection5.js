import React from "react";
import becas from "../static/img/becas.jpg";
import discapacidad from "../static/img/discapacidad.webp";
import transporte from "../static/img/transporte.jpeg";


function InicioSection5() {
  return (
    <div className="support-programs-container">
      <section className="support-programs">
        <h2 className="support-title">Programas de Apoyo Financiero</h2>
        <p className="support-description">
          Bienestar al Aprendiz ofrece una amplia gama de programas de apoyo
          financiero diseñados para asistir a los estudiantes en la cobertura de
          diversos gastos relacionados con su educación y necesidades personales.
          Entre estos programas se encuentran:
        </p>
        <div className="support-cards">
          <div className="support-card">
            <img className="support-image" src={becas} alt="Becas Académicas" />
            <div className="card-content">
              <h3 className="card-title">Becas Académicas</h3>
              <p className="card-text">
                Estas becas están destinadas a cubrir parcial o totalmente los
                costos de matrícula y materiales educativos. Se otorgan a
                estudiantes con un alto rendimiento académico, necesidad económica
                comprobada o méritos especiales que cumplen con los requisitos
                establecidos para cada beca.
              </p>
            </div>
          </div>

          <div className="support-card">
            <img className="support-image" src={transporte} alt="Ayudas Económicas" />
            <div className="card-content">
              <h3 className="card-title">Ayudas Económicas</h3>
              <p className="card-text">
              Este tipo de apoyo incluye subsidios para cubrir gastos de transporte, alojamiento y materiales didácticos. Está dirigido a estudiantes que enfrentan dificultades económicas significativas, ayudándoles a continuar con sus estudios sin que los costos adicionales representen una barrera.
              </p>
            </div>
          </div>

          <div className="support-card">
            <img className="support-image" src={discapacidad} alt="Programas Especiales" />
            <div className="card-content">
              <h3 className="card-title">Programas Especiales</h3>
              <p className="card-text">
              Bienestar al Aprendiz ofrece programas pensados para apoyar a grupos específicos de estudiantes, como aquellos con discapacidades o los que participan en proyectos comunitarios. Estos programas buscan garantizar que todos los estudiantes tengan acceso a los recursos necesarios para su desarrollo académico y personal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InicioSection5;
