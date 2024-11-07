import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getProgramacionesPorFicha, getFichas } from "../api/api";

function Calendariomain() {
  const [fichas, setFichas] = useState([]); // Guardará las fichas obtenidas de la API
  const [filteredFichas, setFilteredFichas] = useState([]);
  const [selectedFicha, setSelectedFicha] = useState(""); // Almacena la ficha seleccionada
  const [coordinacion, setCoordinacion] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = "http://localhost:7777/api";
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const generateDaysArray = (year, month, events) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const event = events.find(e => e.fecha === dateStr);
      daysArray.push({
        day: i,
        dateStr: dateStr,
        hasEvent: !!event,
      });
    }

    return daysArray;
  };

  const handleDayClick = (dateStr) => {
    const dailyEvents = events.filter(e => e.fecha === dateStr);
    if (dailyEvents.length > 0) {
      const eventDetails = dailyEvents.map(e => 
        `<div style="text-align: left;">
          <strong>Taller:</strong> ${e.nombre_Taller}<br>
          <strong>Capacitador:</strong> ${e.nombre_Capacitador}<br>
          <strong>Descripción:</strong> ${e.descripcion_procaptall}<br>
          <strong>Sede:</strong> ${e.sede_procaptall}<br>
          <strong>Ambiente:</strong> ${e.ambiente_procaptall}<br>
          <strong>Fecha:</strong> ${e.fecha}<br>
          <strong>Hora Inicio:</strong> ${e.horaInicio_procaptall}<br>
          <strong>Hora Fin:</strong> ${e.horaFin_procaptall}
        </div>`).join('<hr/>');

      Swal.fire({
        title: `Programación para ${dateStr}`,
        html: eventDetails,
        confirmButtonText: 'Cerrar',
      });
    } else {
      Swal.fire({
        title: 'Sin Programación',
        text: 'No hay eventos programados para este día.',
        icon: 'info',
        confirmButtonText: 'Cerrar',
      });
    }
  };


  useEffect(() => {
    const fetchFichas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ficha`); // Cambia esto por la URL de tu API
        const data = await response.json();
        setFichas(data);
        setFilteredFichas(data); // Inicializa el estado con todas las fichas
      } catch (error) {
        console.error("Error al obtener fichas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFichas();
  }, []);

  const handleFichaChange = (event) => {
    const searchText = event.target.value;
    setSelectedFicha(searchText); // Permite escribir el texto libre
    const filteredFichas = fichas.filter((ficha) =>
      ficha.numero_Ficha.toString().includes(searchText) // Filtrar por numero_Ficha
    );
    setFilteredFichas(filteredFichas); // Actualiza las fichas filtradas
  };

  const handleFichaSelect = (ficha) => {
    setSelectedFicha(ficha.numero_Ficha); // Establece el valor de la ficha seleccionada
    setCoordinacion(ficha.cordinacion_Ficha);
    setEspecialidad(ficha.especialidad_Ficha);
    setFilteredFichas([]); // Oculta las opciones una vez seleccionada
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const ficha = selectedFicha; // La ficha seleccionada
  
    try {
        const response = await getProgramacionesPorFicha(ficha); // Obtener las programaciones
        console.log("datos de la API:", response);
        // Usar un Set para eliminar duplicados basados en la fecha y el nombre del taller
        const uniqueEvents = [];
        const seen = new Set();
  
        response.forEach(item => {
            // Asegurarse de que los datos estén bien definidos antes de acceder a las propiedades
            if (item && item.fecha_procaptall) {
                Object.values(item).forEach(event => {
                    // Verificar que la fecha y nombre del taller estén presentes
                    if (item && item.fecha_procaptall) {
                    const formattedDate = new Date(item.fecha_procaptall).toISOString().split('T')[0]; // Formato 'yyyy-mm-dd'

                    if (event.fecha_procaptall && event.nombre_Taller) {
                        const key = `${event.fecha_procaptall}-${event.nombre_Taller}`;
                        
                        if (!seen.has(key)) {
                            seen.add(key);
                            uniqueEvents.push({
                                sede_procaptall: event.sede_procaptall,
                                descripcion_procaptall: event.descripcion_procaptall,
                                ambiente_procaptall: event.ambiente_procaptall,
                                fecha: formattedDate,
                                horaInicio_procaptall: event.horaInicio_procaptall,
                                horaFin_procaptall: event.horaFin_procaptall,
                                numero_FichaFK: event.numero_FichaFK,
                                nombre_Taller: event.nombre_Taller,
                                nombre_Capacitador: event.nombre_Capacitador,
                                nombre_Instructor: event.nombre_Instructor,
                            });
                        }
                    }
              }});
            }
        });
  
        console.log("Eventos únicos mapeados:", uniqueEvents);
        setEvents(uniqueEvents);
  
        const daysArray = generateDaysArray(currentYear, currentMonth, uniqueEvents);
        setDaysInMonth(daysArray);
        setCalendarVisible(true); // Mostrar el calendario
  
    } catch (error) {
        console.error("Error al obtener programaciones:", error);
        Swal.fire({
            title: "Error",
            text: "No se pudo obtener la programación.",
            icon: "error",
            confirmButtonText: "Cerrar",
        });
    }
};

  

  return (
    <main>
      <div className="form-container-calendariousua">
        <h2 className="Titulo-calendariousua">
          Seleccione Ficha y Coordinación
        </h2>
        <form id="selection-form" onSubmit={handleSubmit}>
          <label className="label-ficha-calendariousua" htmlFor="ficha">
            Ficha:
          </label>
          <input
            className="input-calendariousua"
            type="text"
            id="ficha"
            name="ficha"
            value={selectedFicha} // Vincula el valor con selectedFicha
            onChange={handleFichaChange} // Permite editar el valor
            autoComplete="off"
            placeholder="Escriba para buscar ficha..."
            required
          />
          <ul className="ficha-dropdown">
            {filteredFichas.length > 0 &&
              filteredFichas.map((ficha) => (
                <li key={ficha.numero_Ficha} onClick={() => handleFichaSelect(ficha)}>
                  {ficha.numero_Ficha}
                </li>
              ))}
          </ul>

          <label className="label-ficha-calendariousua" htmlFor="coordinacion">
            Coordinación:
          </label>
          <input
            className="input-calendariousua"
            type="text"
            id="coordinacion"
            name="coordinacion"
            value={coordinacion}
            readOnly
          />

          <label className="label-ficha-calendariousua" htmlFor="especialidad">
            Especialidad:
          </label>
          <input
            className="input-calendariousua"
            type="text"
            id="especialidad"
            name="especialidad"
            value={especialidad}
            readOnly
          />

          <button className="boton-calendarioUsuario" type="submit">
            Mostrar Calendario
          </button>
        </form>
      </div>
      {calendarVisible && (
        <div className="calendar-container">
          <div className="calendar-grid">
            {daysInMonth.map(day => (
              <div
                key={day.dateStr}
                className={`calendar-day ${day.hasEvent ? 'event' : ''}`}
                onClick={() => handleDayClick(day.dateStr)}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default Calendariomain;
