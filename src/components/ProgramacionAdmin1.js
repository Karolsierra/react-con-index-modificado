import React, { useState } from "react";
import Swal from "sweetalert2";
import "select2";
import Loader from "../components/Loader";
import "select2/dist/css/select2.min.css";
import { utils, writeFile } from "xlsx";
import Insertar from "../static/img/enlaceInsertar.png";
import { createFicha } from "../api/api";
import {
  updateFicha,
  deleteFicha,
  postTaller,
  uploadFichasExcel,
  getFichas,
  putTaller,
  getTiposDeTalleres,
  deleteTaller,
  getTalleres,
  uploadTalleresExcel,
  cargarImagenHorario,
} from "../api/api";
import Calendariopct from "../components/Calendariopct";

const ProgramacionAdmin1 = () => {
  const [coordinacion, setCoordinacion] = useState("");
  const [ficha, setFicha] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [fichaConsultar, setFichaConsultar] = useState("");
  const [fichaInsertar, setFichaInsertar] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [finTrimestre, setFinTrimestre] = useState("");
  const [mensaje, setMensaje] = useState("");

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

  const handleBuscar = () => {
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

  let fichas = [];

  //AQUI EMPIEZAN LAS FUNCIONES DE LA GESTION DE FICHAS

  const handleAddFicha = () => {
    const opcionesCoordinacion = [
      "Tele-informatica",
      "Logistica",
      "Mercadeo",
      "Salud Ocupacional",
      "Ambiental",
    ];

    Swal.fire({
      title: "Agregar Ficha",
      html: `
          <div style="display: flex; flex-direction: column;">
              <label>Coordinación</label>
              <input type="text" id="coordinacionAdd" class="swal2-input" placeholder="Ingrese la coordinación" list="coordinacionOptions" autocomplete="off">
              <div id="coordinacionError" style="color: red; font-size: 12px;"></div>
              <datalist id="coordinacionOptions">
                  ${opcionesCoordinacion
                    .map((opcion) => `<option value="${opcion}"></option>`)
                    .join("")}
              </datalist>
              <label>Ficha</label>
              <input type="number" id="fichaAdd" class="swal2-input" placeholder="Ingrese el número de ficha" autocomplete="off" required>
              <div id="fichaError" style="color: red; font-size: 12px;"></div>
              <label>Especialidad</label>
              <input type="text" id="especialidadAdd" class="swal2-input" placeholder="Ingrese la especialidad" required>
              <div id="especialidadError" style="color: red; font-size: 12px;"></div>
          </div>
          <div style="margin-top: 20px; text-align: center;">
              <button id="guardarFichaBtn" class="swal2-confirm swal2-styled">Guardar</button>
              <button id="cancelarFichaBtn" class="swal2-cancel swal2-styled" style="margin-left: 10px;">Cancelar</button>
          </div>
      `,
      showConfirmButton: false,
      didOpen: () => {
        // Referencias a los elementos de error
        const coordinacionError = document.getElementById("coordinacionError");
        const fichaError = document.getElementById("fichaError");
        const especialidadError = document.getElementById("especialidadError");

        // Evento para mostrar opciones al escribir
        const coordinacionInput = document.getElementById("coordinacionAdd");
        coordinacionInput.addEventListener("input", () => {
          // Mostrar el datalist al empezar a escribir
          const inputVal = coordinacionInput.value.trim().toLowerCase();
          const options = document.getElementById(
            "coordinacionOptions"
          ).options;

          Array.from(options).forEach((option) => {
            const isMatch = option.value.toLowerCase().includes(inputVal);
            option.style.display = isMatch ? "block" : "none"; // Mostrar/ocultar según coincidencias
          });

          // Validar "Coordinación" en tiempo real
          if (/\d/.test(coordinacionInput.value)) {
            coordinacionError.textContent =
              "La Coordinación no puede contener números.";
          } else {
            coordinacionError.textContent = ""; // Limpiar el mensaje si es válido
          }
        });

        const fichaInput = document.getElementById("fichaAdd");
        fichaInput.addEventListener("input", () => {
          // Validar "Ficha" en tiempo real
          const numeroFicha = parseInt(fichaInput.value, 10);
          if (isNaN(numeroFicha) || numeroFicha <= 0) {
            fichaError.textContent =
              "El número de ficha debe ser un número positivo.";
          } else {
            fichaError.textContent = ""; // Limpiar el mensaje si es válido
          }
        });

        const especialidadInput = document.getElementById("especialidadAdd");
        especialidadInput.addEventListener("input", () => {
          // Validar "Especialidad" en tiempo real
          if (/\d/.test(especialidadInput.value)) {
            especialidadError.textContent =
              "La Especialidad no puede contener números.";
          } else {
            especialidadError.textContent = ""; // Limpiar el mensaje si es válido
          }
        });

        document
          .getElementById("guardarFichaBtn")
          .addEventListener("click", async () => {
            const coordinacion = coordinacionInput.value;
            const numeroFicha = parseInt(fichaInput.value, 10); // Convertir a número
            const especialidad = especialidadInput.value;

            // Validar que todos los campos estén completos
            if (!coordinacion || isNaN(numeroFicha) || !especialidad) {
              Swal.fire(
                "Error",
                "Por favor complete todos los campos.",
                "error"
              );
              return; // No cerrar el modal
            }

            // Validar que "Coordinación" y "Especialidad" no contengan números
            if (/\d/.test(coordinacion) || /\d/.test(especialidad)) {
              Swal.fire(
                "Error",
                "La Coordinación y la Especialidad no pueden contener números.",
                "error"
              );
              return; // No cerrar el modal
            }

            // Validar que "Ficha" sea un número positivo
            if (numeroFicha <= 0) {
              Swal.fire(
                "Error",
                "El número de ficha debe ser un número positivo.",
                "error"
              );
              return; // No cerrar el modal
            }

            Swal.showLoading();

            try {
              // Llamar a la función createFicha con los datos necesarios
              const result = await createFicha(
                numeroFicha,
                coordinacion,
                especialidad // Se pasa también la especialidad
              );
              Swal.fire("Guardado", result.message, "success");
            } catch (error) {
              Swal.fire("Error", error.message, "error");
            }
          });
        document
          .getElementById("cancelarFichaBtn")
          .addEventListener("click", () => {
            Swal.close(); // Cerrar el modal actual
          });
      },
    });
  };

  const handleRegisterExcelFicha = () => {
    Swal.fire({
      title: '<h2 style="color: #5cb85c;">Cargar Fichas desde Excel</h2>',
      html: `
        <div style="text-align: center; font-size: 1.1em; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <p style="color: #333;">Puedes cargar múltiples fichas subiendo un archivo Excel con el formato adecuado.</p>
          <p><a href="#" id="downloadTemplate" class="link-cargar-usuarios">Descargar formato de Excel</a></p>
          <input type="file" id="excelFileInput" accept=".xlsx, .xls" 
            style="display: block; margin: 15px 0; padding: 10px; border: 2px solid #5cb85c; border-radius: 5px; width: 100%; box-sizing: border-box; font-size: 1rem;" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Cargar fichas",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "campo-usuarios registrar-usuario", // Aplica el estilo de tus botones
        cancelButton: "campo-usuarios buscar-usuario",
      },
      preConfirm: () => {
        const fileInput = document.getElementById("excelFileInput");
        const file = fileInput.files[0];
        if (!file) {
          Swal.showValidationMessage("Por favor, selecciona un archivo Excel.");
        }
        return file;
      },
      didOpen: () => {
        // Agregar evento para descargar el formato de Excel
        const downloadLink = document.getElementById("downloadTemplate");
        downloadLink.addEventListener("click", generarArchivoExcelFicha);
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const file = result.value;
        Swal.showLoading();
        try {
          const response = await uploadFichasExcel(file); // Llamada a la función para subir el archivo
          if (response.message === "Fichas cargadas con éxito") {
            Swal.fire({
              icon: "success",
              title: "Carga exitosa",
              text: "Las fichas se han cargado exitosamente.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error en la carga",
              text:
                response.message || "Ocurrió un error al cargar las fichas.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al subir el archivo. Inténtalo de nuevo.",
          });
          console.error(error);
        }
      }
    });
  };

  const generarArchivoExcelFicha = () => {
    try {
      // Datos adaptados desde el archivo proporcionado
      const data = [
        {
          Ficha: "6565414",
          Coordinación: "Tele-informatica",
          Especialidad: "adso",
        },
        { Ficha: "5441655", Coordinación: "Logistica", Especialidad: "lgtc" },
        { Ficha: "3325232", Coordinación: "Mercadeo", Especialidad: "adsi" },
      ];

      // Crear una hoja de trabajo con el formato correcto
      const ws = utils.json_to_sheet(data);

      // Crear un libro y añadir la hoja
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Ficha_Coordinación");

      // Descargar el archivo Excel generado
      writeFile(wb, "fichas_formato.xlsx");

      console.log("Archivo Excel generado con éxito.");
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  // Función para normalizar cadenas y eliminar tildes
  const normalizeString = (str) => {
    return str
      .toLowerCase() // Convierte a minúsculas
      .replace(/[-\s]/g, "") // Elimina espacios y guiones
      .normalize("NFD") // Descompone caracteres acentuados
      .replace(/[\u0300-\u036f]/g, ""); // Elimina las marcas de acento
  };

  // Función para consultar las fichas
  const handleConsultFicha = async () => {
    try {
      // Llamada a la API para obtener todas las fichas
      fichas = await getFichas();

      // Mostrar el modal
      Swal.fire({
        title: "Consultar Fichas",
        html: `
        <div style="margin-bottom: 10px;">
          <label for="fichaInput" style="font-weight: bold;">Buscar Ficha:</label>
          <input id="fichaInput" type="text" placeholder="Escriba una ficha" style="width: 100%; padding: 8px; border-radius: 4px;" autocomplete="off">
        </div>
        <div id="fichaList" style="max-height: 150px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;"></div>
        <button id="btn-buscar" style="margin-top: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Buscar</button>
        <div id="fichaDetails" style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 15px;"></div>
      `,
        showConfirmButton: false,
        didOpen: () => {
          const fichaInput = document.getElementById("fichaInput");
          const fichaList = document.getElementById("fichaList");

          // Filtrar fichas en tiempo real
          fichaInput.addEventListener("input", () => {
            const inputVal = fichaInput.value.trim().toLowerCase();
            fichaList.innerHTML = ""; // Limpiar la lista previa

            if (inputVal) {
              const filteredFichas = fichas.filter((ficha) =>
                ficha.numero_Ficha.toString().toLowerCase().includes(inputVal)
              );

              filteredFichas.forEach((ficha) => {
                const listItem = document.createElement("div");
                listItem.textContent = `${ficha.numero_Ficha} - ${ficha.cordinacion_Ficha}`;
                listItem.style.padding = "8px";
                listItem.style.cursor = "pointer";
                listItem.style.borderBottom = "1px solid #ccc";

                // Seleccionar la ficha al hacer clic
                listItem.addEventListener("click", () => {
                  fichaInput.value = ficha.numero_Ficha; // Actualiza el campo de entrada
                  fichaList.innerHTML = ""; // Limpiar la lista
                });

                fichaList.appendChild(listItem);
              });
            }
          });

          // Agregar event listener al botón "Buscar"
          document
            .getElementById("btn-buscar")
            .addEventListener("click", function () {
              const selectedFichaId = fichaInput.value.trim();
              const selectedFicha = fichas.find(
                (ficha) => ficha.numero_Ficha.toString() === selectedFichaId
              );

              if (selectedFicha) {
                displayFichaDetails(selectedFicha);
              } else {
                document.getElementById("fichaDetails").innerHTML =
                  "No se encontró ninguna ficha.";
              }
            });
        },
      });
    } catch (error) {
      Swal.fire("Error", "Error al cargar las fichas", "error");
    }
  };

  // Función para renderizar la lista de fichas
  const renderFichas = () => {
    if (!fichas || fichas.length === 0) {
      return <div>No hay fichas disponibles.</div>;
    }
    return fichas.map((ficha) => (
      <div key={ficha.numero_Ficha} className="ficha-card">
        <h4>Ficha: {ficha.numero_Ficha}</h4>
        <p>Coordinación: {ficha.cordinacion_Ficha}</p>
        <p>Especialidad: {ficha.especialidad_Ficha}</p>
        <button onClick={() => displayFichaDetails(ficha)}>Ver Detalles</button>
      </div>
    ));
  };

  // Función para mostrar los detalles de la ficha seleccionada
  const displayFichaDetails = (ficha) => {
    // Obtener todas las coordinaciones únicas
    const uniqueCoordinaciones = [
      ...new Set(fichas.map((f) => f.cordinacion_Ficha)),
    ];

    // Normalizar las coordinaciones para agruparlas
    const normalizedCoordinaciones = {};
    uniqueCoordinaciones.forEach((coord) => {
      const normalizedCoord = normalizeString(coord);
      if (!normalizedCoordinaciones[normalizedCoord]) {
        normalizedCoordinaciones[normalizedCoord] = coord; // Guardar la versión original
      }
    });

    // Convertir a un array de opciones únicas
    const finalCoordinaciones = Object.values(normalizedCoordinaciones);

    document.getElementById("fichaDetails").innerHTML = `
    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
      <h3>Detalles de la Ficha ${ficha.numero_Ficha}</h3>
      <label>Coordinación: </label>
      <input type="text" id="cordinacionInput" placeholder="Escriba coordinación" value="${ficha.cordinacion_Ficha}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;" autocomplete="off" disabled>
      <div id="coordinacionList" style="max-height: 150px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;"></div>
      <label>Especialidad: </label>
      <input type="text" id="especialidadInput" value="${ficha.especialidad_Ficha}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;" disabled>
      <button id="btn-edit" class="btn-edit" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Actualizar</button>
      <button id="btn-delete" class="btn-delete" style="background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Eliminar</button>
    </div>`;

    const coordinacionInput = document.getElementById("cordinacionInput");
    const especialidadInput = document.getElementById("especialidadInput");
    const coordinacionList = document.getElementById("coordinacionList");

    // Mapeo de coordinaciones
    const coordinacionMap = {};
    finalCoordinaciones.forEach((coord) => {
      coordinacionMap[normalizeString(coord)] = coord;
    });

    coordinacionInput.addEventListener("input", () => {
      const inputVal = coordinacionInput.value.trim().toLowerCase();
      coordinacionList.innerHTML = ""; // Limpiar la lista previa

      if (inputVal) {
        const filteredCoordinaciones = finalCoordinaciones.filter((coord) =>
          normalizeString(coord).includes(normalizeString(inputVal))
        );

        const uniqueFilteredCoordinaciones = new Set(filteredCoordinaciones);

        uniqueFilteredCoordinaciones.forEach((coord) => {
          const listItem = document.createElement("div");
          listItem.textContent = coord;
          listItem.style.padding = "8px";
          listItem.style.cursor = "pointer";
          listItem.style.borderBottom = "1px solid #ccc";

          // Seleccionar la coordinación al hacer clic
          listItem.addEventListener("click", () => {
            coordinacionInput.value = coord; // Actualiza el campo de entrada
            coordinacionList.innerHTML = ""; // Limpiar la lista
          });

          coordinacionList.appendChild(listItem);
        });
      }
    });

    // Agregar funcionalidad para el botón de editar (Actualizar)
    document.getElementById("btn-edit").addEventListener("click", async () => {
      // Habilitar campos
      coordinacionInput.disabled = false;
      especialidadInput.disabled = false;

      const editButton = document.getElementById("btn-edit");
      editButton.textContent = "Guardar";

      const deleteButton = document.getElementById("btn-delete");
      deleteButton.textContent = "Cancelar";

      // Cambiar la acción del botón de cancelar
      deleteButton.onclick = () => {
        coordinacionInput.disabled = true;
        especialidadInput.disabled = true;
        editButton.textContent = "Actualizar";
        deleteButton.textContent = "Eliminar";

        // Restablecer los valores originales
        coordinacionInput.value = ficha.cordinacion_Ficha;
        especialidadInput.value = ficha.especialidad_Ficha;
      };

      // Cambiar la acción del botón guardar
      editButton.onclick = async () => {
        const nuevaCoordinacion = coordinacionInput.value;
        const nuevaEspecialidad = especialidadInput.value;

        // Normaliza las entradas
        const normalizedCoordinacion = normalizeString(nuevaCoordinacion);
        const normalizedEspecialidad = normalizeString(nuevaEspecialidad);

        // Validación
        if (!/^[a-zA-Z\s-]+$/.test(normalizedCoordinacion)) {
          alert("La coordinación solo puede contener letras y espacios.");
          return;
        }
        if (!/^[a-zA-Z\s-]+$/.test(normalizedEspecialidad)) {
          alert("La especialidad solo puede contener letras y espacios.");
          return;
        }

        await handleUpdateFicha(ficha.numero_Ficha, {
          cordinacion_Ficha: nuevaCoordinacion,
          especialidad_Ficha: nuevaEspecialidad,
        });

        // Actualizar la lista de fichas sin necesidad de recargar
        const updatedFichas = await getFichas(); // Asegúrate de tener esta función
        renderFichas(updatedFichas); // Asegúrate de tener una función para renderizar la lista actualizada

        // Deshabilitar campos después de guardar
        coordinacionInput.disabled = true;
        especialidadInput.disabled = true;
        editButton.textContent = "Actualizar";
        deleteButton.textContent = "Eliminar";
      };
    });

    // Agregar funcionalidad para el botón de eliminar
    document
      .getElementById("btn-delete")
      .addEventListener("click", async () => {
        // Confirmar la eliminación
        const confirmDelete = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Si eliminas esta ficha, no podrás deshacer esta acción.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (confirmDelete.isConfirmed) {
          try {
            // Intentar eliminar la ficha
            const result = await handleDeleteFicha(ficha.numero_Ficha);

            if (result.success) {
              // Si la eliminación fue exitosa
              await Swal.fire(
                "Eliminada",
                "La ficha ha sido eliminada correctamente.",
                "success"
              );

              // Actualizar la lista de fichas sin necesidad de recargar
              const updatedFichas = await getFichas();
              renderFichas(updatedFichas);
            } else {
              // Si el backend devuelve un mensaje de error, mostrarlo
              await Swal.fire(
                "No se puede eliminar",
                result.message ||
                  `No puedes eliminar esta ficha porque está asociada a programaciones.`,
                "error"
              );
            }
          } catch (error) {
            // Mostrar alerta en caso de error en el proceso
            await Swal.fire(
              "Error",
              "No puedes eliminar esta ficha porque está asociada a programaciones.",
              "error"
            );
            console.error("Error al eliminar la ficha:", error);
          }
        }
      });
  };

  const handleUpdateFicha = async (numero_Ficha, updateData) => {
    try {
      // Llama a la API para actualizar la ficha
      const updatedFicha = await updateFicha(numero_Ficha, updateData);
      console.log("Ficha actualizada con éxito", updatedFicha);
      // Aquí puedes actualizar el estado local o mostrar un mensaje al usuario
    } catch (error) {
      console.error("Error al actualizar la ficha:", error.message);
    }
  };

  const handleDeleteFicha = async (numero_Ficha) => {
    try {
      // Llama a la API para eliminar la ficha
      const response = await deleteFicha(numero_Ficha);
      console.log("Ficha eliminada con éxito", response);
      // Aquí puedes actualizar el estado local o mostrar un mensaje al usuario
    } catch (error) {
      console.error("Error al eliminar la ficha:", error.message);
    }
  };

  //AQUI TERMINAN LAS FUNCIONES DE GESTION DE FICHAS

  //AQUI EMPIEZAN LAS FUNCIONES DE GESTION DE TALLERES

  const handleAddTaller = () => {
    const opcionesTipoTaller = ["Deportes", "Salud", "Psicologia"];

    Swal.fire({
      title: "Agregar Taller",
      html: `
              <div style="display: flex; flex-direction: column;">
                  <label>Tipo de Taller</label>
                  <input type="text" id="tipoTaller" class="swal2-input" placeholder="Ingrese el tipo de taller" list="opcionesTipoTaller" autocomplete="off">
                  <div id="tipoTallerError" style="color: red; font-size: 12px;"></div>
                  <datalist id="opcionesTipoTaller">
                    ${opcionesTipoTaller
                      .map((opcion) => `<option value="${opcion}"></option>`)
                      .join("")}
                  </datalist>
                  <label>Nombre del Taller</label>
                  <input type="text" id="nombreTaller" class="swal2-input" placeholder="Ingrese el nombre del taller" autocomplete="off" >
              </div>
              <div style="margin-top: 20px; text-align: center;">
                  <button id="guardarTallerBtn" class="swal2-confirm swal2-styled">Guardar</button>
                  <button id="cancelarTallerBtn" class="swal2-cancel swal2-styled" style="margin-left: 10px;">Cancelar</button>
              </div>
          `,
      showConfirmButton: false,
      didOpen: () => {
        const tipoTallerInput = document.getElementById("tipoTaller");
        const tipoTallerError = document.getElementById("tipoTallerError");

        // Validación en tiempo real para el tipo de taller
        tipoTallerInput.addEventListener("input", () => {
          if (/\d/.test(tipoTallerInput.value)) {
            tipoTallerError.textContent =
              "El Tipo de Taller no puede contener números.";
          } else {
            tipoTallerError.textContent = ""; // Limpiar el mensaje si es válido
          }
        });

        document
          .getElementById("guardarTallerBtn")
          .addEventListener("click", async () => {
            const tipoTaller = tipoTallerInput.value;
            const nombreTaller = document.getElementById("nombreTaller").value;

            // Verificar que no haya errores antes de proceder
            if (tipoTallerError.textContent) {
              Swal.fire("Error", tipoTallerError.textContent, "error");
              return;
            }

            Swal.showLoading();
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

  const handleRegisterExcelTaller = () => {
    Swal.fire({
      title: '<h2 style="color: #5cb85c;">Cargar Talleres desde Excel</h2>',
      html: `
        <div style="text-align: center; font-size: 1.1em; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <p style="color: #333;">Puedes cargar múltiples talleres subiendo un archivo Excel con el formato adecuado.</p>
          <p><a href="#" id="downloadTemplate" class="link-cargar-usuarios">Descargar formato de Excel</a></p>
          <input type="file" id="excelFileInput" accept=".xlsx, .xls" 
            style="display: block; margin: 15px 0; padding: 10px; border: 2px solid #5cb85c; border-radius: 5px; width: 100%; box-sizing: border-box; font-size: 1rem;" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Cargar talleres",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "campo-usuarios registrar-usuario", // Aplica el estilo de tus botones
        cancelButton: "campo-usuarios buscar-usuario",
      },
      preConfirm: () => {
        const fileInput = document.getElementById("excelFileInput");
        const file = fileInput.files[0];
        if (!file) {
          Swal.showValidationMessage("Por favor, selecciona un archivo Excel.");
        }
        return file;
      },
      didOpen: () => {
        // Agregar evento para descargar el formato de Excel
        const downloadLink = document.getElementById("downloadTemplate");
        downloadLink.addEventListener("click", generarArchivoExcelTaller);
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const file = result.value;

        try {
          const response = await uploadTalleresExcel(file); // Llamada a la función para subir el archivo
          if (response.message === "Talleres cargados con éxito") {
            Swal.fire({
              icon: "success",
              title: "Carga exitosa",
              text: "Los talleres se han cargado exitosamente.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error en la carga",
              text:
                response.message || "Ocurrió un error al cargar los talleres.",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al subir el archivo. Inténtalo de nuevo.",
          });
          console.error(error);
        }
      }
    });
  };

  const generarArchivoExcelTaller = () => {
    try {
      // Datos adaptados desde el archivo proporcionado
      const data = [
        { Taller: "Fotografía", "Tipo de Taller": "Artístico" },
        { Taller: "Meditación", "Tipo de Taller": "Mental" },
        { Taller: "Yoga", "Tipo de Taller": "Físico" },
      ];

      // Crear una hoja de trabajo con el formato correcto
      const ws = utils.json_to_sheet(data);

      // Crear un libro y añadir la hoja
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Talleres");

      // Descargar el archivo Excel generado
      writeFile(wb, "talleres_formato.xlsx");

      console.log("Archivo Excel generado con éxito.");
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  // Función para normalizar cadenas y eliminar tildes
  const normalizeTallerString = (str) => {
    return str
      .toLowerCase() // Convierte a minúsculas
      .normalize("NFD") // Descompone caracteres acentuados
      .replace(/[\u0300-\u036f]/g, ""); // Elimina las marcas de acento
  };

  // Función para consultar los talleres
  const handleConsultTaller = async () => {
    try {
      // Llamada a la API para obtener todos los talleres
      const talleres = await getTalleres();

      // Mostrar el modal
      Swal.fire({
        title: "Consultar Talleres",
        html: `
      <div style="margin-bottom: 10px;">
        <label for="tallerInput" style="font-weight: bold;">Buscar Taller:</label>
        <input id="tallerInput" type="text" placeholder="Escriba tipo o nombre del taller" style="width: 100%; padding: 8px; border-radius: 4px;" autocomplete="off">
      </div>
      <div id="tallerList" style="max-height: 150px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;"></div>
      <button id="btn-buscar" style="margin-top: 10px; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Buscar</button>
      <div id="tallerDetails" style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 15px;"></div>
    `,
        showConfirmButton: false,
        didOpen: () => {
          const tallerInput = document.getElementById("tallerInput");
          const tallerList = document.getElementById("tallerList");

          // Filtrar talleres en tiempo real
          tallerInput.addEventListener("input", () => {
            const inputVal = normalizeTallerString(tallerInput.value.trim());
            tallerList.innerHTML = ""; // Limpiar la lista previa

            if (inputVal) {
              const filteredTalleres = talleres.filter(
                (taller) =>
                  normalizeTallerString(taller.tipo_Taller).includes(
                    inputVal
                  ) ||
                  normalizeTallerString(taller.nombre_Taller).includes(inputVal)
              );

              filteredTalleres.forEach((taller) => {
                const listItem = document.createElement("div");
                listItem.textContent = `${taller.tipo_Taller} - ${taller.nombre_Taller}`;
                listItem.style.padding = "8px";
                listItem.style.cursor = "pointer";
                listItem.style.borderBottom = "1px solid #ccc";

                // Seleccionar el taller al hacer clic
                listItem.addEventListener("click", () => {
                  tallerInput.value = taller.nombre_Taller; // Actualiza el campo de entrada
                  tallerList.innerHTML = ""; // Limpiar la lista
                });

                tallerList.appendChild(listItem);
              });
            }
          });

          // Agregar event listener al botón "Buscar"
          document
            .getElementById("btn-buscar")
            .addEventListener("click", function () {
              const selectedTallerName = tallerInput.value.trim();
              const selectedTaller = talleres.find(
                (taller) =>
                  normalizeTallerString(taller.nombre_Taller) ===
                  normalizeTallerString(selectedTallerName)
              );

              if (selectedTaller) {
                displayTallerDetails(selectedTaller);
              } else {
                document.getElementById("tallerDetails").innerHTML =
                  "No se encontró ningún taller.";
              }
            });
        },
      });
    } catch (error) {
      Swal.fire("Error", "Error al cargar los talleres", "error");
    }
  };

  // Función para mostrar los detalles del taller seleccionado
  const displayTallerDetails = (taller) => {
    document.getElementById("tallerDetails").innerHTML = `
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
    <h3>Detalles del Taller ${taller.nombre_Taller}</h3>
    <label>Tipo de Taller: </label>
    <input type="text" id="tipoTallerInput" placeholder="Escriba tipo de taller" value="${taller.tipo_Taller}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;" autocomplete="off">
    <div id="tipoTallerList" style="max-height: 150px; overflow-y: auto; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;"></div>
    <label>Nombre del Taller: </label>
    <input type="text" id="nombreTallerInput" value="${taller.nombre_Taller}" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;" disabled>
    <button id="btn-edit" class="btn-edit" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Actualizar</button>
    <button id="btn-delete" class="btn-delete" style="background-color: #f44336; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">Eliminar</button>
  </div>`;

    const tipoTallerInput = document.getElementById("tipoTallerInput");
    const nombreTallerInput = document.getElementById("nombreTallerInput");
    const tipoTallerList = document.getElementById("tipoTallerList");

    // Función para normalizar cadenas
    const normalizeTallerString = (str) => {
      if (typeof str !== "string") return ""; // Asegúrate de que str sea una cadena
      return str.toLowerCase().trim();
    };

    // Agregar funcionalidad de búsqueda para el campo de tipo de taller
    tipoTallerInput.addEventListener("input", async () => {
      const inputVal = normalizeTallerString(tipoTallerInput.value.trim());
      tipoTallerList.innerHTML = ""; // Limpiar la lista previa

      if (inputVal) {
        // Llamar a la API para obtener los tipos de taller existentes
        const tiposDeTalleres = await getTiposDeTalleres(); // Asegúrate de tener esta función

        const filteredTipos = tiposDeTalleres.filter((tipo) =>
          normalizeTallerString(tipo.tipo_Taller).includes(inputVal)
        );

        filteredTipos.forEach((tipo) => {
          const listItem = document.createElement("div");
          listItem.textContent = tipo.tipo_Taller; // Asegúrate de que esto sea el nombre correcto
          listItem.style.padding = "8px";
          listItem.style.cursor = "pointer";
          listItem.style.borderBottom = "1px solid #ccc";

          // Seleccionar el tipo de taller al hacer clic
          listItem.addEventListener("click", () => {
            tipoTallerInput.value = tipo.tipo_Taller; // Actualiza el campo de entrada
            tipoTallerList.innerHTML = ""; // Limpiar la lista
          });

          tipoTallerList.appendChild(listItem);
        });
      }
    });

    // Agregar funcionalidad para el botón de editar (Actualizar)
    document.getElementById("btn-edit").addEventListener("click", async () => {
      // Habilitar campos
      tipoTallerInput.disabled = false;
      nombreTallerInput.disabled = false;

      const editButton = document.getElementById("btn-edit");
      editButton.textContent = "Guardar";

      const deleteButton = document.getElementById("btn-delete");
      deleteButton.textContent = "Cancelar";

      // Cambiar la acción del botón de cancelar
      deleteButton.onclick = () => {
        tipoTallerInput.disabled = true;
        nombreTallerInput.disabled = true;
        editButton.textContent = "Actualizar";
        deleteButton.textContent = "Eliminar";

        // Restablecer los valores originales
        tipoTallerInput.value = taller.tipo_Taller;
        nombreTallerInput.value = taller.nombre_Taller;
      };

      // Cambiar la acción del botón guardar
      editButton.onclick = async () => {
        const nuevoTipoTaller = tipoTallerInput.value;
        const nuevoNombreTaller = nombreTallerInput.value;

        // Validación
        if (!/^[a-zA-Z\s]+$/.test(nuevoTipoTaller)) {
          alert("El tipo de taller no puede contener números.");
          return;
        }

        await handleUpdateTaller(taller.id, {
          tipo_Taller: nuevoTipoTaller,
          nombre_Taller: nuevoNombreTaller,
        });

        // Actualizar la lista de talleres sin necesidad de recargar
        const updatedTalleres = await getTalleres(); // Asegúrate de tener esta función
        renderTalleres(updatedTalleres); // Asegúrate de tener una función para renderizar la lista actualizada

        // Deshabilitar campos después de guardar
        tipoTallerInput.disabled = true;
        nombreTallerInput.disabled = true;
        editButton.textContent = "Actualizar";
        deleteButton.textContent = "Eliminar";
      };
    });

    // Agregar funcionalidad para el botón de eliminar
    document
      .getElementById("btn-delete")
      .addEventListener("click", async () => {
        // Confirmar la eliminación
        const confirmDelete = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Si eliminas este taller, no podrás deshacer esta acción.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (confirmDelete.isConfirmed) {
          try {
            // Intentar eliminar el taller
            await handleDeleteTaller(taller.id);
            await Swal.fire(
              "Eliminado",
              "El taller ha sido eliminado correctamente.",
              "success"
            );

            // Actualizar la lista de talleres sin necesidad de recargar
            const updatedTalleres = await getTalleres();
            renderTalleres(updatedTalleres);
          } catch (error) {
            await Swal.fire("Error", "No se pudo eliminar el taller.", "error");
            console.error("Error al eliminar el taller:", error);
          }
        }
      });
  };

  // Función para renderizar la lista de talleres
  const renderTalleres = (talleres) => {
    if (!talleres || talleres.length === 0) {
      return <div>No hay talleres disponibles.</div>;
    }
    return talleres.map((taller) => (
      <div key={taller.id} className="taller-card">
        <h4>Tipo: {taller.tipo_Taller}</h4>
        <p>Nombre: {taller.nombre_Taller}</p>
        <button onClick={() => displayTallerDetails(taller)}>
          Ver Detalles
        </button>
      </div>
    ));
  };

  // Función para manejar la actualización de un taller
  const handleUpdateTaller = async (id, updateData) => {
    try {
      // Llama a la API para actualizar el taller
      const updatedTaller = await putTaller(id, updateData);
      console.log("Taller actualizado con éxito", updatedTaller);
      // Aquí puedes actualizar el estado local o mostrar un mensaje al usuario
    } catch (error) {
      console.error("Error al actualizar el taller:", error.message);
    }
  };

  // Función para manejar la eliminación de un taller
  const handleDeleteTaller = async (id) => {
    try {
      // Llama a la API para eliminar el taller
      await deleteTaller(id);
      console.log("Taller eliminado con éxito");
      // Aquí puedes actualizar el estado local o mostrar un mensaje al usuario
    } catch (error) {
      console.error("Error al eliminar el taller:", error.message);
    }
  };

  //AQUI TERMINAN LAS FUNCIONES DE GESTION DE TALLERES

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

  const handleAgregarHorario = async () => {
    // Lógica para guardar el horario
    if (finTrimestre && fichaInsertar && imagePreview) {
      try {
        const imagenFile = document.getElementById("file-upload1").files[0]; // Obtener el archivo de imagen
        const response = await cargarImagenHorario(
          finTrimestre,
          fichaInsertar,
          imagenFile
        );

        // Aquí puedes manejar la respuesta si es necesario
        Swal.fire({
          icon: "success",
          title: "Horario agregado",
          text: "El horario se ha agregado exitosamente.",
        });

        // Reiniciar los campos si es necesario
        setFinTrimestre("");
        setFichaInsertar("");
        setImagePreview(null);
      } catch (error) {
        console.error("Error al crear horario:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo agregar el horario. Intente de nuevo.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos.",
      });
    }
  };

  /*   const handleBuscar = () => {
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
  }; */

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
            <button onClick={handleRegisterExcelFicha}>
              Agregar Fichas (xlsx)
            </button>
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
            <button onClick={handleRegisterExcelTaller}>
              Agregar Talleres (xlsx)
            </button>
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
            <label>Coordinación:</label>
            <input type="text" className="espaciado" id="infoCoordinacion" />
          </div>
          <div className="info-item">
            <label>Ficha:</label>
            <input className="espaciado" id="infoFicha" />
          </div>
          <div className="image-preview">
            {/* Aquí se mostrará la imagen cargada */}
            <img src="ruta/de/tu/imagen.jpg" alt="Vista previa" />
          </div>
          <div className="info-buttons">
            <button
              className="buton-horario-guardar"
              id="guardarButton"
              onClick={handleGuardar}
            >
              Guardar
            </button>
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
