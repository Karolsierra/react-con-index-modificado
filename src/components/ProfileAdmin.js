import React, { useEffect, useState } from "react";
import { getPerfil } from "../api/api.js"; // Ajusta la ruta según tu estructura de directorios

function ProfileAdmin() {
  const [perfil, setPerfil] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const id_Usuario = localStorage.getItem('id_Usuario');
        console.log('ID de usuario obtenido del localStorage:', id_Usuario);
        if (!id_Usuario) {
          setError('Usuario no autenticado');
          setLoading(false);
          return;
        }
        console.log("Fetching perfil for user ID:", id_Usuario);
        const data = await getPerfil(id_Usuario);
        console.log("Perfil data received:", data);
        setPerfil(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  },[]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="body-profile-admin">
      <div className="title-container">
        <h2 className="section-title-profile-admin">Información del Perfil</h2>
      </div>
      <main className="container-profile-admin">
        <div className="profile-admin-container">
          <form className="form-perfil-admin" id="formulario" method="post">
            <div className="form-group-perfilAdmin">
              <label className="label-form-profile-admin" htmlFor="nombre">
                Nombre:
              </label>
              <input
                className="input-form-profile-admin"
                type="text"
                id="nombre"
                name="nombre"
                value={perfil.nombre_Usua || '' || perfil.nombre_Admin || '' || perfil.nombre_Instruc  || '' || perfil.nombre_Capac}
                readOnly
              />
            </div>
            <div className="form-group-perfilAdmin">
              <label className="label-form-profile-admin" htmlFor="apellido">
                Apellido:
              </label>
              <input
                className="input-form-profile-admin"
                type="text"
                id="apellido"
                name="apellido"
                value={perfil.apellido_Usua || '' || perfil.apellido_Admin || '' || perfil.apellido_Instruc  || '' || perfil.apellidos_Capac}
                readOnly
              />
            </div>
            <div className="form-group-perfilAdmin">
              <label className="label-form-profile-admin" htmlFor="correo">
                Correo institucional:
              </label>
              <input
                className="input-form-profile-admin"
                type="email"
                id="correo"
                name="correo"
                value={perfil.correo_Usua || ''}
                readOnly
              />
            </div>
            <div className="form-group-perfilAdmin">
              <label className="label-form-profile-admin" htmlFor="clave">
                Clave:
              </label>
              <input
                className="input-form-profile-admin"
                type="password"
                id="clave"
                name="clave"
                value={perfil.clave_Usua || ''}
                readOnly
              />
            </div>
            <div className="form-group-perfilAdmin">
              <label className="label-form-profile-admin" htmlFor="genero">
                Género:
              </label>
              <input
                className="select-form-profile-admin"
                id="genero"
                name="genero"
                disabled
                value={perfil.genero_Usua || '' || perfil.genero_Admin || '' || perfil.genero_Instruc  || '' || perfil.genero_Capac}
                readOnly
              />
            </div>
            <div className="form-group-perfilAdmin">
              <label className="label-form-profile-admin" htmlFor="rol">
                Rol:
              </label>
              <input
                className="select-form-profile-admin"
                id="rol"
                name="rol"
                disabled
                value={perfil.nombre_Rol}
              />
            </div>
            <div className="form-group-perfilAdmin">
              <label className="label-form-profile-admin" htmlFor="tipo_documento">
                Tipo de documento:
              </label>
              <input
                className="select-form-profile-admin"
                id="tipo_documento"
                name="tipo_documento"
                disabled
                value={perfil.tipodoc_Usua || '' || perfil.tipodoc_Admin || '' || perfil.tipodoc_Instruc  || '' || perfil.tipodoc_Capac}
              />
            </div>
            <div className="form-group-perfilAdmin">
              <label className="label-form-profile-admin" htmlFor="documento">
                Número de documento:
              </label>
              <input
                className="input-form-profile-admin"
                type="number"
                id="documento"
                name="documento"
                value={perfil.documento_Usua || '' || perfil.documento_Admin || '' || perfil.documento_Instruc  || '' || perfil.documento_Capac}
                readOnly
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ProfileAdmin;