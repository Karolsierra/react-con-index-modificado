import React, { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Insertar from "../static/img/enlaceInsertar.png";
import { createFicha } from "../api/api";
import {
  updateFicha,
  deleteFicha,
  postTaller,
  consultarTallerPorNombre,
} from "../api/api";
import Calendariopct from "../components/Calendariopct";

const ProgramacionAdmin1 = () => {
  const [coordinacion, setCoordinacion] = useState("");
  const [ficha, setFicha] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false); 
  const [fichaConsultar, setFichaConsultar] = useState('');
  const [fichaInsertar, setFichaInsertar] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [finTrimestre, setFinTrimestre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleLoginClick = () => {
    setShowCalendar(true); // Mostrar el calendario cuando se presiona "Iniciar sesión"
  };

  const handleCloseModal = () => {
    setShowCalendar(false); // Cerrar el calendario cuando se presiona "Volver" o se hace clic fuera del modal
  };

  const handleGuardar = () => {
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "El horario se ha guardado correctamente.",
      confirmButtonText: "Aceptar",
    });
  };

  const handleEliminar = () => {
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "El horario se ha eliminado correctamente.",
      confirmButtonText: "Aceptar",
    });
  };

/*   
const handleBusca = () => {
    if (coordinacion && ficha) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa ambos campos antes de buscar.",
      });
    }
  }; 
*/

  const toggleDropdown = (e) => {
    const dropdown = e.currentTarget.nextElementSibling;
    const arrow = e.currentTarget.querySelector(".arrow");
    const isVisible = dropdown.style.display === "block";

    document
      .querySelectorAll(".dropdown-content")
      .forEach((content) => (content.style.display = "none"));
    document
      .querySelectorAll(".arrow")
      .forEach((a) => a.classList.remove("down"));

    if (!isVisible) {
      dropdown.style.display = "block";
      arrow.classList.add("down");
    }
  };

  const handleAddFicha = () => {
    Swal.fire({
      title: "Agregar Ficha",
      html: `
                <div style="display: flex; flex-direction: column;">
                    <label>Coordinación</label>
                    <input type="text" id="coordinacionAdd" class="swal2-input" placeholder="Ingrese la coordinación">
                    <label>Ficha</label>
                    <input type="text" id="fichaAdd" class="swal2-input" placeholder="Ingrese el número de ficha">
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button id="guardarFichaBtn" class="swal2-confirm swal2-styled">Guardar</button>
                    <button id="cancelarFichaBtn" class="swal2-cancel swal2-styled" style="margin-left: 10px;">Cancelar</button>
                </div>
            `,
      showConfirmButton: false,
      didOpen: () => {
        document
          .getElementById("guardarFichaBtn")
          .addEventListener("click", async () => {
            const coordinacion =
              document.getElementById("coordinacionAdd").value;
            const numeroFicha = document.getElementById("fichaAdd").value;

            if (!coordinacion || !numeroFicha) {
              Swal.fire(
                "Error",
                "Por favor complete todos los campos.",
                "error"
              );
              return;
            }

            try {
              const result = await createFicha(numeroFicha, coordinacion);
              Swal.fire("Guardado", result.message, "success");
            } catch (error) {
              Swal.fire("Error", error.message, "error");
            }
          });

        document
          .getElementById("cancelarFichaBtn")
          .addEventListener("click", () => {
            Swal.close(); // Close the current modal
          });
      },
    });
  };

  const handleConsultFicha = () => {
    Swal.fire({
      title: "Consultar Ficha",
      html: `
                <div style="display: flex; flex-direction: column;">
                    <label>Coordinación</label>
                    <input type="text" id="coordinacionConsult" class="swal2-input" placeholder="Ingrese la coordinación">
                    <label>Ficha</label>
                    <input type="text" id="fichaConsult" class="swal2-input" placeholder="Ingrese el número de ficha">
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button id="actualizarBtn" class="swal2-confirm swal2-styled">Actualizar</button>
                    <button id="eliminarBtn" class="swal2-confirm swal2-styled" style="margin-left: 10px;">Eliminar</button>
                </div>
            `,
      showConfirmButton: false,
      didOpen: () => {
        document
          .getElementById("actualizarBtn")
          .addEventListener("click", async () => {
            const coordinacion = document.getElementById(
              "coordinacionConsult"
            ).value;
            const numeroFicha = document.getElementById("fichaConsult").value;

            if (!coordinacion || !numeroFicha) {
              Swal.fire(
                "Error",
                "Por favor complete todos los campos.",
                "error"
              );
              return;
            }

            try {
              // Llama a la API para obtener la ficha
              const response = await fetch(
                `http://localhost:7777/api/ficha/${numeroFicha}`
              );
              const ficha = await response.json();

              if (response.ok) {
                // Mostrar datos en la ventana de actualización
                Swal.fire({
                  title: "Actualizar Ficha",
                  html: `
                                    <div style="display: flex; flex-direction: column;">
                                        <label>Coordinación</label>
                                        <input type="text" id="coordinacionUpdate" class="swal2-input" value="${ficha.cordinacion_Ficha}" placeholder="Ingrese la coordinación">
                                        <label>Ficha</label>
                                        <input type="text" id="fichaNumeroUpdate" class="swal2-input" value="${ficha.numero_Ficha}" placeholder="Ingrese el número de ficha" readonly>
                                    </div>
                                    <div style="margin-top: 20px; text-align: center;">
                                        <button id="guardarUpdateBtn" class="swal2-confirm swal2-styled">Guardar</button>
                                        <button id="cancelarUpdateBtn" class="swal2-cancel swal2-styled" style="margin-left: 10px;">Cancelar</button>
                                    </div>
                                `,
                  showConfirmButton: false,
                  didOpen: () => {
                    document
                      .getElementById("guardarUpdateBtn")
                      .addEventListener("click", async () => {
                        const updatedCoordinacion =
                          document.getElementById("coordinacionUpdate").value;

                        try {
                          // Llama a la API para actualizar la ficha
                          await updateFicha(numeroFicha, {
                            cordinacion_Ficha: updatedCoordinacion,
                          });
                          Swal.fire(
                            "Guardado",
                            "Se ha guardado exitosamente",
                            "success"
                          );
                        } catch (error) {
                          Swal.fire("Error", error.message, "error");
                        }
                      });

                    document
                      .getElementById("cancelarUpdateBtn")
                      .addEventListener("click", () => {
                        Swal.close();
                      });
                  },
                });
              } else {
                Swal.fire("Error", ficha.message, "error");
              }
            } catch (error) {
              Swal.fire("Error", "Error de conexión al servidor", "error");
            }
          });

        document.getElementById("eliminarBtn").addEventListener("click", () => {
          const numeroFicha = document.getElementById("fichaConsult").value;

          Swal.fire({
            title: "Eliminar Ficha",
            text: "¿Estás seguro de que deseas eliminar esta ficha?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                // Llama a la API para eliminar la ficha
                await deleteFicha(numeroFicha);
                Swal.fire("Eliminado", "La ficha ha sido eliminada", "success");
              } catch (error) {
                Swal.fire("Error", error.message, "error");
              }
            }
          });
        });
      },
    });
  };

  const handleAddTaller = () => {
    Swal.fire({
      title: "Agregar Taller",
      html: `
                <div style="display: flex; flex-direction: column;">
                    <label>Tipo de Taller</label>
                    <input type="text" id="tipoTaller" class="swal2-input" placeholder="Ingrese el tipo de taller">
                    <label>Nombre del Taller</label>
                    <input type="text" id="nombreTaller" class="swal2-input" placeholder="Ingrese el nombre del taller">
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button id="guardarTallerBtn" class="swal2-confirm swal2-styled">Guardar</button>
                    <button id="cancelarTallerBtn" class="swal2-cancel swal2-styled" style="margin-left: 10px;">Cancelar</button>
                </div>
            `,
      showConfirmButton: false,
      didOpen: () => {
        document
          .getElementById("guardarTallerBtn")
          .addEventListener("click", async () => {
            const tipoTaller = document.getElementById("tipoTaller").value;
            const nombreTaller = document.getElementById("nombreTaller").value;

            try {
              await postTaller({
                tipo_Taller: tipoTaller,
                nombre_Taller: nombreTaller,
              });
              Swal.fire(
                "Guardado",
                "El taller ha sido guardado exitosamente",
                "success"
              );
              Swal.close(); // Cerrar el modal después de guardar
            } catch (error) {
              Swal.fire("Error", error.message, "error");
            }
          });

        document
          .getElementById("cancelarTallerBtn")
          .addEventListener("click", () => {
            Swal.close(); // Cerrar el modal
          });
      },
    });
  };

  const handleConsultTaller = () => {
    Swal.fire({
      title: "Consultar Taller",
      html: `
                <div style="display: flex; flex-direction: column;">
                    <label>Nombre del Taller</label>
                    <input type="text" id="nombreTallerConsult" class="swal2-input" placeholder="Ingrese el nombre del taller">
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button id="consultarTallerBtn" class="swal2-confirm swal2-styled">Consultar</button>
                </div>
            `,
      showConfirmButton: false,
      didOpen: () => {
        document
          .getElementById("consultarTallerBtn")
          .addEventListener("click", async () => {
            const nombreTaller = document.getElementById(
              "nombreTallerConsult"
            ).value;

            if (nombreTaller) {
              try {
                const taller = await consultarTallerPorNombre(nombreTaller);
                Swal.fire({
                  title: "Taller Encontrado",
                  text: JSON.stringify(taller, null, 2), // Formateo para mejor legibilidad
                  icon: "info",
                  confirmButtonText: "Cerrar",
                });
              } catch (error) {
                Swal.fire(
                  "Error",
                  error.message || "Error al consultar el taller",
                  "error"
                );
              }
            } else {
              Swal.fire(
                "Advertencia",
                "Por favor, ingresa el nombre del taller",
                "warning"
              );
            }
          });
      },
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Establecer la imagen en estado
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgregarHorario = () => {
    // Lógica para guardar el horario
    if (finTrimestre && fichaInsertar && imagePreview) {
      // Aquí puedes enviar los datos a tu backend o guardarlos en el estado
      Swal.fire({
        icon: "success",
        title: "Horario agregado",
        text: "El horario se ha agregado exitosamente.",
      });
      // Reiniciar los campos si es necesario
      setFinTrimestre("");
      setFichaInsertar("");
      setImagePreview(null);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos.",
      });
    }
  };

  const handleBuscar = () => {
    const horarioEncontrado = horarios.find(
      (horario) =>
        horario.ficha === fichaConsultar &&
        horario.coordinacion === coordinacion
    );

    if (horarioEncontrado) {
      setHorarioConsultado(horarioEncontrado);
      setShowInfo(true);
    } else {
      setShowInfo(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se encontró el horario para la ficha ingresada.",
      });
    }
  };

  // Estado para almacenar los horarios
  const [horarios, setHorarios] = useState([]);
  const [horarioConsultado, setHorarioConsultado] = useState(null); // Para almacenar el horario consultado

  return (
    <div className="contenedor-principal">
      <div className="cuadros-insertar">
        <div className="cuadro-programacion">
          <label
            className="cuadro-label"
            htmlFor="file-upload1"
            onClick={(e) => e.stopPropagation()}
          >
            <img className="icono-cuadro" src={Insertar} alt="insertar" />
            <p className="text-programacion-agregar">Inserta el horario</p>
          </label>
          <input
            type="file"
            id="file-upload1"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <br />
          <hr />
          <br />
          <div className="campo-programacion">
            <label className="label-form-programacion">Fin de trimestre:</label>
            <input
              type="date"
              className="input-form-programacion"
              value={finTrimestre}
              onChange={(e) => setFinTrimestre(e.target.value)}
            />
          </div>
          <div className="campo-programacion">
            <label className="label-form-programacion">Ficha:</label>
            <input
              type="text"
              className="input-form-programacion-ficha"
              placeholder="Número de ficha"
              value={fichaInsertar}
              onChange={(e) => setFichaInsertar(e.target.value)}
            />
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img
                src={imagePreview}
                alt="Vista previa"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </div>
          )}

          <button className="agregar-horario" onClick={handleAgregarHorario}>
            Agregar este horario
          </button>
        </div>

        <div className="dropdown-container">
          <div className="dropdown" onClick={toggleDropdown}>
            <span>Ficha</span>
            <span className="arrow">&#9660;</span>
          </div>
          <div className="dropdown-content">
            <button onClick={handleAddFicha}>Agregar Ficha</button>
            <button onClick={handleConsultFicha}>Consultar Ficha</button>
          </div>
        </div>
        <div className="dropdown-container">
          <div className="dropdown" onClick={toggleDropdown}>
            <span>Taller</span>
            <span className="arrow">&#9660;</span>
          </div>
          <div className="dropdown-content">
            <button onClick={handleAddTaller}>Agregar Taller</button>
            <button onClick={handleConsultTaller}>Consultar Taller</button>
          </div>
        </div>
      </div>
      <div className="container-form-programacion">
        <h2 className="titulo-programacion">Consulta el horario</h2>
        <div className="buscador-programacion">
          <form>
            <div className="form-busqueda-programacion">
              <div className="campo-programacion">
                <label
                  className="label-form-programacion"
                  htmlFor="coordinacionBusqueda"
                >
                  Coordinación:
                </label>
                <select
                  className="select-form-programacion"
                  id="coordinacionBusqueda"
                  name="coordinacionBusqueda"
                  value={coordinacion}
                  onChange={(e) => setCoordinacion(e.target.value)}
                >
                  <option value="">Seleccione la coordinación</option>
                  <option value="teleinformatica">Teleinformática</option>
                  <option value="mercadeo">Mercadeo</option>
                  <option value="logistica">Logística</option>
                </select>
              </div>
              <div className="campo-programacion">
                <label
                  className="label-form-programacion"
                  htmlFor="fichaBusqueda"
                >
                  Ficha:
                </label>
                <input
                  className="input-form-programacion-ficha"
                  type="text"
                  id="fichaBusqueda"
                  name="fichaBusqueda"
                  placeholder="Ingrese el número de ficha"
                  value={ficha}
                  onChange={(e) => setFicha(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="campo-programacion">
                <button
                  type="button"
                  id="buscarButton"
                  className="buscar-programacion"
                  onClick={handleBuscar}
                >
                  Buscar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {showInfo && (
        <div id="infoDisplay" className="info-display">
          <div className="info-item">
            <label>Coordinación:</label>{" "}
            <input type="text" className="espaciado" id="infoCoordinacion" />
          </div>
          <div className="info-item">
            <label>Ficha:</label> <input className="espaciado" id="infoFicha" />
          </div>
          <div className="info-box">{/* Space for further content */}</div>
          <div className="info-buttons">
            <button
              className="buton-horario-guardar"
              id="guardarButton"
              onClick={handleGuardar}
            >
              Guardar
            </button>
          </div>
          <div className="info-buttons">
            <button
              className="buton-horario-eliminar"
              id="eliminarButton"
              onClick={handleEliminar}
            >
              Eliminar
            </button>
          </div>
          <div className="info-buttons-agregarProgramacion">
            <button
              className="agregarProgramacion"
              id="agregarProgramacion"
              onClick={handleLoginClick}
            >
              Agregar programación
            </button>
            {showCalendar && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  zIndex: 1000,
                }}
                onClick={handleCloseModal} // Cerrar modal al hacer clic fuera
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
                    minWidth: "45%",
                    // Ajusta el tamaño del modal según lo que necesites
                    position: "relative",
                  }}
                  onClick={(e) => e.stopPropagation()} // Evitar que el clic en el modal cierre el modal
                >
                  {/* Botón para cerrar el modal */}
                  <button
                    onClick={handleCloseModal}
                    style={{
                      position: "absolute",
                      top: "23px",
                      right: "200px",
                      backgroundColor: "#218838",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "7px 10px",
                      cursor: "pointer",
                      zIndex: "9999",
                      margin: "auto",
                    }}
                  >
                    Volver
                  </button>

                  {/* Calendario */}
                  <Calendariopct />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramacionAdmin1;
