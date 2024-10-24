import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../static/img/Logo de Bienestar.png";
import perfil from "../../static/img/perfil.png";
import calendario from "../../static/img/calendario.png";
import programaciones from "../../static/img/programaciones.png";
import cerrar_sesion from "../../static/img/cerrarSesion.png";
import { getPerfil } from "../../api/api.js"; // Asegúrate de ajustar la ruta según tu estructura de directorios

function Navbarinscap() {
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
    <div className="body-navbarUsuario">
      <header className="header-navusuario">
        <img src={logo} className="logoBienestar-navUsuario" alt="logo" />
        <nav className="navbar-usuario">
          <ul className="ul-nav-usuario">
            <li className="li-navUsuario">
              <Link
                to="/calendariousua"
                title="Ver calendario"
                className="enlace-navUsuario"
              >
                <img src={calendario} alt="Calendario" className="icono" />
                Calendario
              </Link>
            </li>
            <li className="li-navUsuario">
              <Link 
                to="/profileUsua"
                className="enlace-navUsuario" 
                title="Perfil">
                <img src={perfil} alt="Perfil" className="icono" />
                Perfil
              </Link>
            </li>
            <li className="li-navUsuario">
              <Link 
                to="/programacionesUsua"
                className="enlace-navUsuario" 
                title="Programaciones">
                <img
                  src={programaciones}
                  alt="Programaciones"
                  className="icono"
                />
                Programaciones
              </Link>
            </li>
          </ul>
        </nav>
          <div className="cerrarSesion">
            <Link 
              to="/"
              className="enlaceCerrar-navUsuario" 
              title="Cerrar sesión">
              <img src={cerrar_sesion} className="icono" alt="cerrar_sesion" />
              {nombreUsuario}
            </Link>
          </div>
      </header>
    </div>
  );
}

export default Navbarinscap;
