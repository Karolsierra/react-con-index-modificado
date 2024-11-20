import React from "react";
import becas from "../static/img/becas.jpg";
import discapacidad from "../static/img/discapacidad.webp";
import transporte from "../static/img/transporte.jpeg";

function Iniciosection5() {
  return (
    <div>
      <section className="blog container-index">
        <h2 className="titulo-tipoh2">Programas de Apoyo Financiero</h2>
        <p className="txt-p">
          Bienestar al Aprendiz ofrece una amplia gama de programas de apoyo
          financiero diseñados para asistir a los estudiantes en la cobertura de
          diversos gastos relacionados con su educación y necesidades
          personales. Entre estos programas se encuentran:
        </p>
        <div className="blog-content row">
          {/* Tarjeta para Becas Académicas */}
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm">
              <div className="card-img-container" style={{ position: "relative" }}>
                <img
                  src={becas}
                  alt="becas"
                  className="card-img-top imagen-index"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.25rem",
                    borderTopRightRadius: "0.25rem",
                  }}
                />
                <div className="card-img-overlay">
                  <h3 className="titulo-tipoh3">Becas Académicas</h3>
                </div>
              </div>
              <div className="card-body">
                <p className="txt-p">
                  Estas becas están destinadas a cubrir parcial o totalmente
                  los costos de matrícula y materiales educativos. Se otorgan a
                  estudiantes con un alto rendimiento académico, necesidad
                  económica comprobada o méritos especiales que cumplen con los
                  requisitos establecidos para cada beca. Estas becas buscan
                  facilitar el acceso a la educación y reducir la carga
                  financiera de los estudiantes.
                </p>
              </div>
            </div>
          </div>
          {/* Tarjeta para Ayudas Económicas */}
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm">
              <div className="card-img-container" style={{ position: "relative" }}>
                <img
                  src={transporte}
                  alt="transporte"
                  className="card-img-top imagen-index"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.25rem",
                    borderTopRightRadius: "0.25rem",
                  }}
                />
                <div className="card-img-overlay">
                  <h3 className="titulo-tipoh3">Ayudas Económicas</h3>
                </div>
              </div>
              <div className="card-body">
                <p className="txt-p">
                  Este tipo de apoyo incluye subsidios para gastos relacionados
                  con el transporte, alojamiento, y adquisición de materiales
                  didácticos. Estas ayudas están dirigidas a estudiantes que
                  enfrentan dificultades económicas significativas y necesitan
                  asistencia para cubrir gastos adicionales que podrían afectar
                  su desempeño académico.
                </p>
              </div>
            </div>
          </div>
          {/* Tarjeta para Programas Especiales */}
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm">
              <div className="card-img-container" style={{ position: "relative" }}>
                <img
                  src={discapacidad}
                  alt="discapacidad"
                  className="card-img-top imagen-index"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "0.25rem",
                    borderTopRightRadius: "0.25rem",
                  }}
                />
                <div className="card-img-overlay">
                  <h3 className="titulo-tipoh3">Programas Especiales</h3>
                </div>
              </div>
              <div className="card-body">
                <p className="txt-p">
                  Además de las becas y ayudas generales, Bienestar al Aprendiz
                  ofrece programas diseñados para apoyar a grupos específicos
                  de estudiantes. Esto incluye ayudas para estudiantes con
                  discapacidades, que necesitan ajustes especiales para su
                  educación, y programas para aquellos que participan en
                  proyectos comunitarios, promoviendo el desarrollo de
                  habilidades y el compromiso social.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Iniciosection5;
