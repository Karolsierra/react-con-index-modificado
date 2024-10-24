import React, { useEffect, useState } from "react";
import logo from "../../static/img/Logo de Bienestar.png";
import perfil from "../../static/img/perfil.png";
import calendario from "../../static/img/calendario.png";
import informes from "../../static/img/informes.png";
import programaciones from "../../static/img/programaciones.png";
import usuarios from "../../static/img/usuarios.png";
import cerrar_sesion from "../../static/img/cerrarSesion.png";
import { Link } from "react-router-dom";
import { getPerfil } from "../../api/api"; // Asegúrate de ajustar la ruta según tu estructura de directorios

function NavbarAdmin() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const id_Usuario = localStorage.getItem('id_Usuario');
        if (!id_Usuario) {
          setError('Usuario no autenticado');
          setLoading(false);
          return;
        }

        const data = await getPerfil(id_Usuario);
        // Asumiendo que el nombre del usuario se puede obtener de varias propiedades
        const nombre = data.nombre_Usua || data.nombre_Admin || data.nombre_Instruc || data.nombre_Capac || '';
        setNombreUsuario(nombre);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="body-navbarAdmin">
      <header className="header-nav-admin">
        <img
          src={logo}
          className="logo-navadmin-bienestar"
          alt="logo-bienestar"
        />
        <nav className="nav-admin">
          <ul className="ul-navadmin">
            <li className="li-navadmin">
              <Link
                to="/perfilAdmin"
                className="enlaceIcono-navadmin"
                title="Perfil"
              >
                <img src={perfil} alt="Perfil" className="icono" />
                <span className="icono-text">Perfil</span>
              </Link>
            </li>
            <li className="li-navadmin">
              <Link
                to="/CalendarioAdmin"
                className="enlaceIcono-navadmin"
                title="Ver calendario"
              >
                <img src={calendario} alt="Calendario" className="icono" />
                <span className="icono-text">Calendario</span>
              </Link>
            </li>
            <li className="li-navadmin">
              <Link
                to="/informes"
                className="enlaceIcono-navadmin"
                title="Informes"
              >
                <img src={informes} alt="Informes" className="icono" />
                <span className="icono-text">Informes</span>
              </Link>
            </li>
            <li className="li-navadmin">
              <Link
                to="/programacionAdmin"
                className="enlaceIcono-navadmin"
                title="Programaciones"
              >
                <img src={programaciones} alt="Programaciones" className="icono" />
                <span className="icono-text">Programaciones</span>
              </Link>
            </li>
            <li className="li-navadmin">
              <Link
                to="/usuarios"
                className="enlaceIcono-navadmin"
                title="Usuarios"
              >
                <img src={usuarios} alt="Usuarios" className="icono" />
                <span className="icono-text">Usuarios</span>
              </Link>
            </li>
          </ul>
        </nav>
          <div className="cerrarSesion">
            <Link
              to="/"
              className="cerrarSesion-navadmin" 
              title="Cerrar sesión"
            >
              <img src={cerrar_sesion} className="icono" alt="cerrar-sesion"/>
              <span className="icono-text">{nombreUsuario}</span>
            </Link>
          </div>
      </header>
    </div>
  );
}

export default NavbarAdmin;
