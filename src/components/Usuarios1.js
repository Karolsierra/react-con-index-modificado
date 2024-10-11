import React, { useState } from "react";
import Swal from "sweetalert2";
import { utils, writeFile } from "xlsx";
import { getbuscarUsuario } from "../api/api"; // Asegúrate de que la ruta a tu archivo api.js es correcta
import { updateUsuario } from "../api/api";
import { getIdUsuarioGlobal } from "../api/api"; // Asegúrate de que la ruta sea correcta
import { registerUsuario } from "../api/api";
import { uploadUsuariosExcel } from "../api/api";
import { Link } from "react-router-dom";

function Usuarios1() {
  const [user, setUser] = useState(null);

  // Función para generar el archivo Excel

  const generarArchivoExcel = () => {
    try {
      // Example data in the correct format
      const data = [
        {
          correo: "ejemplo@sena.edu.co",
          rol: "Administrador",
          nombre: "Juan",
          apellido: "Pérez",
          "tipo documento": "CC",
          documento: "12345678",
          genero: "Masculino",
        },
        {
          correo: "ejemplo@sena.edu.co",
          rol: "Profesional",
          nombre: "Maria",
          apellido: "Gómez",
          "tipo documento": "CC",
          documento: "87654321",
          genero: "Femenino",
        },
      ];

      // Create a worksheet with the correct format
      const ws = utils.json_to_sheet(data);

      // Create a workbook and append the sheet
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Formato");

      // Generate Excel file for download
      writeFile(wb, "formato_usuarios.xlsx");

      console.log("Archivo Excel generado con éxito.");
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    }
  };

  const handleRegister = () => {
    Swal.fire({
      title: "Registrar Usuario",
      html: `
      <main class="registrar">
        <div class="registrar-container">
          <form class="form-registrar-usuario" id="registrar-form" action="#" method="post">
            <div class="form-group-usuarios">
              <label class="label-registrar-usuario" for="nombre">Nombre:</label>
              <input class="input-registrar-usuario" type="text" id="nombre" name="nombre" required>
            </div>
            <div class="form-group-usuarios">
              <label class="label-registrar-usuario" for="apellido">Apellido:</label>
              <input class="input-registrar-usuario" type="text" id="apellido" name="apellido" required>
            </div>
            <div class="form-group-usuarios">
              <label class="label-registrar-usuario" for="correo_Usua">Correo institucional:</label>
              <input class="input-registrar-usuario" type="email" id="correo_Usua" name="correo" required>
            </div>
            <div class="form-group-usuarios">
              <label class="label-registrar-usuario" for="tipoDocumento">Tipo de documento:</label>
              <select class="select-registrar-usuario" id="tipoDocumento" name="tipoDocumento" required>
                <option value="">Seleccione una opción</option>
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PEP">PEP</option>
                <option value="NIT">NIT</option>
              </select>
            </div>
            <div class="form-group-usuarios">
              <label class="label-registrar-usuario" for="documento_1">Número documento:</label>
              <input class="input-registrar-usuario" type="text" id="documento_1" name="documento" required>
            </div>
            <div class="form-group-usuarios">
              <label class="label-registrar-usuario" for="genero">Género:</label>
              <select class="select-registrar-usuario" id="genero" name="genero" required>
                <option value="">Seleccione una opción</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
            <div class="form-group-usuarios">
              <label class="label-registrar-usuario" for="id_Rol1FK">Rol:</label>
              <select class="select-registrar-usuario" id="id_Rol1FK" name="rol" required>
                <option value="">Seleccione una opción</option>
                <option value="1">Administrador</option>
                <option value="2">Instructor</option>
                <option value="3">Profesional</option>
              </select>
            </div>
          </form>
        </div>
      </main>
      `,
      showConfirmButton: true,
      confirmButtonText: "Guardar usuario",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      allowOutsideClick: false, // Evita cerrar al hacer clic fuera
      preConfirm: async () => {
        // Obtener los valores del formulario
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const correo = document.getElementById("correo_Usua").value.trim();
        const tipoDocumento = document.getElementById("tipoDocumento").value.trim();
        const documento = document.getElementById("documento_1").value.trim();
        const genero = document.getElementById("genero").value.trim();
        const rol = document.getElementById("id_Rol1FK").value.trim();
  
        // Expresiones regulares para validaciones
        const regexNombreApellido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const regexDocumento = /^\d+$/;
        const regexCorreo =
          /^[a-zA-Z0-9._%+-]+@(soy\.sena\.edu\.co|sena\.edu\.co|misena\.edu\.co)$/;
  
        // Validación de campos
        if (!regexNombreApellido.test(nombre)) {
          Swal.showValidationMessage(`El nombre solo puede contener letras y espacios.`);
          return;
        }
  
        if (!regexNombreApellido.test(apellido)) {
          Swal.showValidationMessage(`El apellido solo puede contener letras y espacios.`);
          return;
        }
  
        if (!regexDocumento.test(documento)) {
          Swal.showValidationMessage(`El número de documento solo puede contener números.`);
          return;
        }
  
        if (!regexCorreo.test(correo)) {
          Swal.showValidationMessage(`El correo debe ser institucional y terminar en soy.sena.edu.co, sena.edu.co o misena.edu.co.`);
          return;
        }
  
        const rolesValidos = ["1", "2", "3"];
        if (
          !nombre ||
          !apellido ||
          !correo ||
          !tipoDocumento ||
          !documento ||
          !genero ||
          !rol ||
          !rolesValidos.includes(rol)
        ) {
          Swal.showValidationMessage(`Por favor completa todos los campos correctamente.`);
          return;
        }
  
        const nuevoUsuario = {
          nombre,
          apellido,
          correo,
          tipoDocumento,
          documento,
          genero,
          rol,
        };
  
        try {
          const response = await registerUsuario(nuevoUsuario); // Enviar usuario a la API
          Swal.fire({
            icon: "success",
            title: "Usuario registrado",
            text: `El usuario ${nombre} ha sido registrado exitosamente.`,
          });
        } catch (error) {
          // Manejo de errores específicos
          let errorMessage;
          if (error.message.includes("correo")) {
            errorMessage = "El correo ya está en uso. Intenta con otro.";
          } else if (error.message.includes("documento")) {
            errorMessage = "El documento ya está en uso. Intenta con otro.";
          } else {
            errorMessage = `Hubo un problema al registrar el usuario: ${error.message}`;
          }
          Swal.showValidationMessage(errorMessage); // Muestra el mensaje de error
        }
      },
    });
  
    // Validaciones en tiempo real
    document.addEventListener("DOMContentLoaded", function () {
      const nombreInput = document.getElementById("nombre");
      const apellidoInput = document.getElementById("apellido");
      const documentoInput = document.getElementById("documento_1");
      const correoInput = document.getElementById("correo_Usua");
  
      // Validar entrada de nombre y apellido
      const validateTextInput = (input) => {
        input.addEventListener("input", function () {
          this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""); // Permitir solo letras y espacios
        });
  
        // Prevenir escritura de caracteres no permitidos
        input.addEventListener("keydown", function (event) {
          const invalidChars = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/;
          if (invalidChars.test(event.key) && event.key.length === 1) {
            event.preventDefault();
          }
        });
      };
  
      validateTextInput(nombreInput);
      validateTextInput(apellidoInput);
  
      // Validar entrada de documento
      documentoInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, ""); // Permitir solo números
      });
  
      documentoInput.addEventListener("keydown", function (event) {
        if (!/^\d$/.test(event.key) && event.key.length === 1) {
          event.preventDefault();
        }
      });
  
      // Validar el correo institucional al perder el foco
      correoInput.addEventListener("blur", function () {
        const value = this.value;
        const regexCorreo =
          /^[a-zA-Z0-9._%+-]+@(soy\.sena\.edu\.co|sena\.edu\.co|misena\.edu\.co)$/;
        if (!regexCorreo.test(value)) {
          this.setCustomValidity("El correo debe ser institucional.");
        } else {
          this.setCustomValidity(""); // Restablecer la validez si es correcto
        }
      });
    });
  };


  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const tipoDocumento = document.getElementById("tipo-documento").value;
      const numeroDocumento = document.getElementById("documento").value;
      const nombre = document.getElementById("nombre-busqueda").value;

      if (!tipoDocumento || !numeroDocumento) {
        Swal.fire({
          icon: "warning",
          title: "Campos incompletos",
          text: "Por favor completa el tipo y número de documento.",
        });
        return;
      }

      // Llamar a la API para buscar el usuario
      const response = await getbuscarUsuario(
        tipoDocumento,
        numeroDocumento,
        nombre
      );

      if (response && response[0]) {
        const user = response[0]; // Obtener los datos del usuario

        const searchFormContainer =
          document.querySelector(".buscador-usuarios");

        // Eliminar cualquier formulario existente
        const existingForm = document.querySelector(
          ".informacion-container-usuarios"
        );
        if (existingForm) {
          existingForm.remove();
        }

        // Crear nuevo formulario HTML con los datos del usuario
        const formHTML = `
          <div class="informacion-container-usuarios">
            <h2 class="titulo-info-usuarios">Información del usuario</h2>
            <form id="formulario" action="#" method="post">
              <div class="form-group">
                <div class="column-form-usuarios">
                  <label class="label-alert-form-usuarios" for="nombre-info">Nombre:</label>
                  <input class="input-alert-form-usuarios" type="text" id="nombre-info" name="nombre" value="${
                    user.nombre || ""
                  }" readonly>
                </div>
                <br>
                <div class="column-form-usuarios">
                  <label class="label-alert-form-usuarios" for="apellido-info">Apellido:</label>
                  <input class="input-alert-form-usuarios" type="text" id="apellido-info" name="apellido" value="${
                    user.apellido || ""
                  }" readonly>
                </div>
              </div>
              <div class="form-group">
                <div class="column-form-usuarios">
                  <label class="label-alert-form-usuarios" for="correo-info">Correo institucional:</label>
                  <input class="input-alert-form-usuarios" type="email" id="correo-info" name="correo" value="${
                    user.correo || ""
                  }" readonly>
                </div>
                <br>
                <div class="column-form-usuarios">
                  <label class="label-alert-form-usuarios" for="clave-info">Clave:</label>
                  <input class="input-alert-form-usuarios" type="password" id="clave-info" name="clave" value="${
                    user.clave || ""
                  }" readonly>
                </div>
              </div>
              <div class="form-group">
                <label class="label-alert-form-usuarios" for="genero-info">Género:</label>
                <select class="select-alert-form-usuarios" id="genero-info" name="genero" disabled>
                  <option value="">Seleccione una opción</option>
                  <option value="Masculino" ${
                    user.genero === "Masculino" ? "selected" : ""
                  }>Masculino</option>
                  <option value="Femenino" ${
                    user.genero === "Femenino" ? "selected" : ""
                  }>Femenino</option>
                </select>
              </div>
              <div class="form-group">
                <label class="label-alert-form-usuarios" for="rol-info">Rol:</label>
                <select class="select-alert-form-usuarios" id="rol-info" name="rol" disabled>
                  <option value="1" ${
                    user.id_Rol1FK === 1 ? "selected" : ""
                  }>Administrador</option>
                  <option value="2" ${
                    user.id_Rol1FK === 2 ? "selected" : ""
                  }>Instructor</option>
                  <option value="3" ${
                    user.id_Rol1FK === 3 ? "selected" : ""
                  }>Profesional</option>
                </select>
              </div>
              <div class="form-group">
                <label class="label-alert-form-usuarios" for="estado-info">Estado del usuario:</label>
                <select class="select-alert-form-usuarios" id="estado-info" name="estado" disabled>
                  <option value="1" ${
                    user.estado === 1 ? "selected" : ""
                  }>Activo</option>
                  <option value="0" ${
                    user.estado === 0 ? "selected" : ""
                  }>Inactivo</option>
                </select>
              </div>
              <div class="form-group">
                <div>
                  <button type="button" id="modificarButton" class="modificar-usuario">Modificar</button>
                </div>
              </div>
            </form>
          </div>
        `;

        searchFormContainer.insertAdjacentHTML("afterend", formHTML);

        // Añadir funcionalidad al botón "Modificar"
        document.getElementById("modificarButton").onclick = async function (
          event
        ) {
          event.preventDefault();

          const button = document.getElementById("modificarButton");

          if (button.textContent === "Modificar") {
            // Habilitar campos para edición
            document.getElementById("nombre-info").removeAttribute("readonly");
            document
              .getElementById("apellido-info")
              .removeAttribute("readonly");
            document.getElementById("correo-info").removeAttribute("readonly");
            document.getElementById("genero-info").removeAttribute("disabled");
            document.getElementById("rol-info").removeAttribute("disabled");
            document.getElementById("estado-info").removeAttribute("disabled");
            button.textContent = "Guardar";
          } else if (button.textContent === "Guardar") {
            const id_Usuario = getIdUsuarioGlobal();

            // Validar que el ID de usuario esté presente
            if (!id_Usuario) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se encontró el ID del usuario. Inténtalo de nuevo.",
              });
              return;
            }

            // Obtener los valores actualizados del formulario
            const nombre = document.getElementById("nombre-info").value;
            const apellido = document.getElementById("apellido-info").value;
            const correo_Usua = document.getElementById("correo-info").value;
            const clave_Usua = document.getElementById("clave-info").value;
            const genero = document.getElementById("genero-info").value;
            const id_Rol1FK = document.getElementById("rol-info").value;
            const estado = document.getElementById("estado-info").value;

            const usuarioActualizado = {
              nombre,
              apellido,
              correo_Usua,
              clave_Usua,
              genero,
              id_Rol1FK,
              estado,
            };

            try {
              // Llamar a la API para actualizar el usuario
              const response = await updateUsuario(
                id_Usuario,
                usuarioActualizado
              );

              if (response.message === "Usuario actualizado con éxito") {
                Swal.fire({
                  icon: "success",
                  title: "Éxito",
                  text: "El usuario ha sido actualizado correctamente.",
                });

                // Deshabilitar campos después de guardar
                document
                  .getElementById("nombre-info")
                  .setAttribute("readonly", true);
                document
                  .getElementById("apellido-info")
                  .setAttribute("readonly", true);
                document
                  .getElementById("correo-info")
                  .setAttribute("readonly", true);
                document
                  .getElementById("genero-info")
                  .setAttribute("disabled", true);
                document
                  .getElementById("rol-info")
                  .setAttribute("disabled", true);
                document
                  .getElementById("estado-info")
                  .setAttribute("disabled", true);
                button.textContent = "Modificar";
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: response.message,
                });
              }
            } catch (error) {
              console.error(error);
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al actualizar el usuario. Inténtalo de nuevo.",
              });
            }
          }
        };
      } else {
        Swal.fire({
          icon: "error",
          title: "Usuario no encontrado",
          text: "No se encontraron datos para este usuario.",
        });
      }
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Error al buscar",
        text: "Ocurrió un error durante la búsqueda. Inténtalo de nuevo.",
      });
    }
  };

  /*   const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "No se seleccionó archivo",
        text: "Por favor, selecciona un archivo Excel para cargar.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await registrarUsuariosDesdeExcel(formData);

      if (response.message === "Usuarios cargados con éxito") {
        Swal.fire({
          icon: "success",
          title: "Carga masiva exitosa",
          text: "Los usuarios se han cargado correctamente.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en la carga",
          text: "Hubo un problema al cargar los usuarios. Inténtalo de nuevo.",
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
  }; */

  const handleBulkRegister = () => {
    Swal.fire({
      title: '<h2 style="color: #5cb85c;">Cargar Usuarios desde Excel</h2>',
      html: `
        <div style="text-align: center; font-size: 1.1em; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <p style="color: #333;">Puedes cargar múltiples usuarios subiendo un archivo Excel con el formato adecuado.</p>
          <p><a href="#" id="downloadTemplate" class="link-cargar-usuarios">Descargar formato de Excel</a></p>
          <input type="file" id="excelFileInput" accept=".xlsx, .xls" 
            style="display: block; margin: 15px 0; padding: 10px; border: 2px solid #5cb85c; border-radius: 5px; width: 100%; box-sizing: border-box; font-size: 1rem;" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Cargar Usuarios",
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
        downloadLink.addEventListener("click", generarArchivoExcel);
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const file = result.value;

        try {
          const response = await uploadUsuariosExcel(file); // Llamada a la función para subir el archivo
          if (
            response.message ===
            "Usuarios cargados y correos enviados con éxito"
          ) {
            Swal.fire({
              icon: "success",
              title: "Carga exitosa",
              text: "Los usuarios se han cargado y se han enviado los correos exitosamente.",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error en la carga",
              text:
                response.message || "Ocurrió un error al cargar los usuarios.",
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

  // Renderizar condicionalmente el formulario con los datos del usuario
  return (
    <div>
      <h2 className="titulo-usuarios">¿Cuál usuario desea buscar?</h2>
      <div className="buscador-usuarios">
        <form onSubmit={handleSearch}>
          <div className="form-busqueda-usuarios">
            <div className="campo-usuarios">
              <label
                className="label-form-registrar-usuarios"
                htmlFor="tipo-documento"
              >
                Tipo de documento:
              </label>
              <select
                className="select-form-registrar-usuarios"
                id="tipo-documento"
                name="tipo-documento"
                required
              >
                <option value="">Seleccione un tipo de documento</option>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PEP">PEP</option>
                <option value="NIT">NIT</option>
              </select>
            </div>
            <div className="campo-usuarios">
              <label
                className="label-form-registrar-usuarios"
                htmlFor="documento"
              >
                Número de documento:
              </label>
              <input
                className="input-form-registrar-usuarios"
                type="text"
                id="documento"
                name="documento"
                required
              />
            </div>
            <div className="campo-usuarios">
              <label
                className="label-form-registrar-usuarios"
                htmlFor="nombre-busqueda"
              >
                Nombre (opcional):
              </label>
              <input
                className="input-form-registrar-usuarios"
                type="text"
                id="nombre-busqueda"
                name="nombre"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="campo-usuarios">
              <button
                type="submit"
                id="buscarButton"
                className="buscar-usuario"
              >
                Buscar
              </button>
            </div>
            <div className="campo-usuarios">
              <button
                type="button"
                id="registrar"
                className="registrar-usuario"
                onClick={handleRegister}
              >
                Registrar nuevo usuario
              </button>
            </div>
          </div>
          <div className="campo-usuarios">
            <Link
              href="#"
              id="bulkRegisterLink"
              className="link-cargar-usuarios"
              onClick={(e) => {
                e.preventDefault();
                handleBulkRegister();
              }}
            >
              Agregar más de un usuario
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Usuarios1;
