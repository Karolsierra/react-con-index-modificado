const API_BASE_URL = "http://localhost:7777/api"; // Cambia esto a la URL de tu backend

// Obtener todas las programaciones

export const getProgramaciones = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/programacion`);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Datos obtenidos de la API:", data); // Verifica la respuesta
    return data;
  } catch (error) {
    console.error(`Error al obtener las programaciones: ${error.message}`);
    throw error;
  }
};

// Obtener una programación por ID
export const getProgramacion = async (id) => {
  const response = await fetch(`${API_BASE_URL}/programacion/${id}`);
  return response.json();
};

// Obtener programaciones por sede
export const getProgramacionesPorSede = async (sede) => {
  const response = await fetch(`${API_BASE_URL}/programaciones/${sede}`);
  return response.json();
};

// Crear una nueva programación
export const createProgramacion = async (programacionData) => {
  const response = await fetch(`${API_BASE_URL}/programacion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(programacionData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear la programación");
  }

  return response.json();
};

// Actualizar una programación existente
export const updateProgramacion = async (id, programacion) => {
  try {
    const response = await fetch(`${API_BASE_URL}/programacion/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(programacion),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al actualizar la programación"
      );
    }

    return await response.json(); // Retorna los datos actualizados
  } catch (error) {
    console.error("Error en la actualización:", error.message);
    throw error; // Propaga el error hacia el controlador o el componente llamador
  }
};

// Eliminar una programación
export const deleteProgramacion = async (id) => {
  const response = await fetch(`${API_BASE_URL}/programacion/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

// Talleres
export const getTalleres = async () => {
  const response = await fetch(`${API_BASE_URL}/taller`);
  return response.json();
};

export const getTaller = async (id) => {
  const response = await fetch(`${API_BASE_URL}/taller/${id}`);
  return response.json();
};

export const consultarTallerPorNombre = async (nombreTaller) => {
  try {
    const response = await fetch(`${API_BASE_URL}/taller/${nombreTaller}`);

    if (!response.ok) {
      throw new Error("Taller no encontrado");
    }

    return await response.json();
  } catch (error) {
    throw error; // Propaga el error
  }
};

export const postTaller = async (tallerData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/taller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tallerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error desconocido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al agregar el taller:", error);
    throw error;
  }
};

export const putTaller = async (id, taller) => {
  const response = await fetch(`${API_BASE_URL}/taller/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taller),
  });
  return response.json();
};

export const deleteTaller = async (id) => {
  await fetch(`${API_BASE_URL}/taller/${id}`, {
    method: "DELETE",
  });
};

// Fichas
export const getFichas = async () => {
  const response = await fetch(`${API_BASE_URL}/ficha`);
  return response.json();
};

export const getFicha = async (id) => {
  const response = await fetch(`${API_BASE_URL}/ficha/${id}`);
  return response.json();
};

export const createFicha = async (numero_Ficha, cordinacion_Ficha) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ficha`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numero_Ficha,
        cordinacion_Ficha,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error desconocido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la conexión a la API:", error);
    throw error;
  }
};

export const updateFicha = async (numero_Ficha, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ficha/${numero_Ficha}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error desconocido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la conexión a la API:", error);
    throw error;
  }
};

export const deleteFicha = async (numero_Ficha) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ficha/${numero_Ficha}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error desconocido");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la conexión a la API:", error);
    throw error;
  }
};

// Capacitadores
export const getCapacitadores = async () => {
  const response = await fetch(`${API_BASE_URL}/capacitador`);
  return response.json();
};

export const getCapacitador = async (id) => {
  const response = await fetch(`${API_BASE_URL}/capacitador/${id}`);
  return response.json();
};

export const postCapacitador = async (capacitador) => {
  const response = await fetch(`${API_BASE_URL}/capacitador`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(capacitador),
  });
  return response.json();
};

export const putCapacitador = async (id, capacitador) => {
  const response = await fetch(`${API_BASE_URL}/capacitador/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(capacitador),
  });
  return response.json();
};

// Función para obtener el perfil del usuario
export const getPerfil = async (id_Usuario) => {
  try {
    const response = await fetch(`${API_BASE_URL}/perfil/${id_Usuario}`);

    if (!response.ok) {
      throw new Error("Error al obtener el perfil");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el perfil:", error.message);
    throw error; // Re-lanzar el error para que el componente pueda manejarlo
  }
};

let idUsuarioGlobal = null;

export const getbuscarUsuario = async (
  tipoDocumento,
  numeroDocumento,
  nombre
) => {
  try {
    const url = new URL(
      `${API_BASE_URL}/usuario/tipoDoc/${tipoDocumento}/documento/${numeroDocumento}/nombre/${
        nombre || ""
      }`
    );

    console.log("Generated URL:", url.toString());

    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Error al buscar el usuario: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data received:", data);

    // Verificar si `data` es un array o un objeto indexado
    if (data && data[0] && typeof data[0].id_Usuario !== "undefined") {
      idUsuarioGlobal = data[0].id_Usuario; // Accede a data[0] para obtener el ID
      console.log("ID del usuario asignado:", idUsuarioGlobal);
    } else {
      console.error(
        "No se encontró el campo 'id_Usuario' en los datos recibidos."
      );
      idUsuarioGlobal = null; // Asegúrate de que sea null si no se encuentra el ID
    }

    return data;
  } catch (error) {
    console.error("Error al buscar el usuario:", error.message);
    throw error;
  }
};

// Función para obtener el ID del usuario global
export const getIdUsuarioGlobal = () => {
  console.log("Valor de idUsuarioGlobal en la llamada:", idUsuarioGlobal);
  return idUsuarioGlobal;
};

// API para actualizar un usuario existente
export const updateUsuario = async (id_Usuario, usuario) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuario/${id_Usuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      throw new Error(`Error en la actualización: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar el usuario:", error.message);
    throw error;
  }
};

export const login = async (correo_Usua, clave_Usua) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST", // Usar el método POST
      headers: {
        "Content-Type": "application/json", // Definir el tipo de contenido
      },
      body: JSON.stringify({
        correo_Usua, // Enviar los datos como JSON
        clave_Usua,
      }),
    });

    if (!response.ok) {
      throw new Error("Error de autenticación"); // Manejar el error si el login falla
    }

    const data = await response.json(); // Obtener la respuesta en formato JSON

    // Verificar si hay un usuario y token en la respuesta
    if (data && data.user && data.token) {
      // Guarda el token en localStorage
      localStorage.setItem("token", data.token);

      // Guarda el id_Usuario en localStorage
      localStorage.setItem("id_Usuario", data.user.id);

      // Puedes también almacenar más información del usuario si lo necesitas
      localStorage.setItem("nombre_Usuario", data.user.nombre); // Ejemplo: guardar el nombre
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Error de conexión");
  }
};

export const getProgramacionesPorFichaYCoordinacion = async (
  ficha,
  coordinacion
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/programacion/ficha/${ficha}/cordinacion/${coordinacion}`
    );
    if (!response.ok) {
      throw new Error("Error en la respuesta de la API");
    }
    return response.json();
  } catch (error) {
    console.error("Error al obtener las programaciones:", error);
    throw error;
  }
};

// Función para registrar un nuevo usuario
export const registerUsuario = async (usuarioData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/usuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData),
    });
    if (!response.ok) {
      // Manejar errores de respuesta
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al registrar usuario");
    }

    const data = await response.json();
    return data; // Retorna la respuesta exitosa
  } catch (error) {
    console.error("Error en registerUsuario:", error.message);
    throw error; // Vuelve a lanzar el error para manejarlo más arriba si es necesario
  }
};

export const uploadUsuariosExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/usuarios/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Usuarios cargados desde Excel:", data);
    return data;
  } catch (error) {
    console.error(`Error al cargar usuarios desde Excel: ${error.message}`);
    throw error;
  }
};
