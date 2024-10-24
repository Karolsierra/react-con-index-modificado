import React, { useState } from "react";
import { login } from "../api/api"; // Importa la función de login que realiza la solicitud al backend
import logo from "../../src/static/img/Logo de Bienestar.png";
import logonormal from "../../src/static/img/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login1() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [mostrarContraseña, setMostrarContraseña] = useState(false); // Estado para mostrar/ocultar contraseña

  // Expresión regular para validar un correo institucional específico
  const validarCorreo = (correo) => {
    // Verifica que el correo tenga el formato correcto y dominios aceptados (soy.sena.edu.co, misena.edu.co, sena.edu.co)
    const regex = /^[^\s@]+@(soy.sena.edu.co|misena.edu.co|sena.edu.co)$/; 
    if (!regex.test(correo)) return false; // Si el correo no pasa la validación, retorna false

    // Cuenta los puntos en la parte del dominio (después del @)
    const parteDominio = correo.split("@")[1]; // Separa la parte después del "@" (el dominio)
    const puntos = (parteDominio.match(/./g)  || []).length; // Cuenta los puntos en el dominio

    // Verifica que haya al menos dos puntos en el dominio (relevante para dominios tipo soy.sena.edu.co)
    return parteDominio.includes("sena.edu.co") || puntos >= 2;
  };

    // Función para validar el formulario antes de enviarlo
    const validarFormulario = () => {
      // Verifica que el correo sea válido
      if (!validarCorreo(correo)) {
        setError("Correo institucional inválido."); // Muestra un mensaje de error si el correo no es válido
      return false;
    }

    // Verifica que la contraseña tenga al menos 8 caracteres
    if (contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    // Si todo es válido, limpia cualquier error y devuelve true
    setError("");
    return true;
    };

    const handleSubmit = async (event) => {
      event.preventDefault(); // Evita la recarga de la página
      
      // Llama a la función de validación del formulario
      if (!validarFormulario()) {
          return; // Si la validación falla, detiene la ejecución
      }
  
      try {
          const data = await login(correo, contraseña); // Llama a la API con los valores del formulario
          console.log("Inicio de sesión exitoso:", data);
  
          // Guardar el token en el almacenamiento local
          localStorage.setItem("token", data.token);
  
          // Dependiendo del rol, redireccionar a diferentes páginas
          const rol = data.user.rol; // Acceder al rol dentro de "user"
          
          // Llama a la función login del contexto
          const userData = { name: data.user.name, rol: rol }; // Asegúrate de que data.user tiene el campo name
          login(userData);
  
          if (rol === 1) {
              window.location.href = "/perfilAdmin";
          } else if (rol === 2) {
              window.location.href = "/profileUsua";
          } else if (rol === 3) {
              window.location.href = "/profileUsua";
          } else {
              setError("Rol no reconocido. Contacte con el administrador.");
          }
      } catch (err) {
          console.error("Error de inicio de sesión:", err);
          setError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
      }
  };

  return (
    <div className="body-login">
      <div className="container-login">
        <header className="header-login">
          <div className="logo">
            <img src={logo} className="logobienestar" alt="Logo" />
          </div>
        </header>
        <div className="form-container-login">
          <form className="login-formulario" onSubmit={handleSubmit}>
            <img src={logonormal} className="logo2" alt="Logo" />
            <div className="mb-3">
              <label htmlFor="correo" className="formLogin-label">
                Correo:
              </label>
              <input
                type="email"
                className="form-control-login"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 password-container">
              <label htmlFor="contraseña" className="form-label">
                Contraseña:
              </label>
              <div className="input-container">
                <input
                  type={mostrarContraseña ? "text" : "password"}
                  className="form-control-login"
                  id="contraseña"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setMostrarContraseña(!mostrarContraseña)}
                >
                  {mostrarContraseña ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button className="botonLogin-inicio" type="submit">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login1;
