import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2"; // Para alertas
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getProgramaciones,
  createProgramacion,
  updateProgramacion,
  deleteProgramacion,
  getTalleres,
  getCapacitadores,
  getFichas,
} from "../api/api";
import "../calendario.css";

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    id: null,
    sede: null,
    descripcion: "",
    date: "",
    startTime: "",
    endTime: "",
    taller: null,
    capacitador: null,
    ficha: [],
    ambiente: "",
    allDay: false,
  });

  const [sede] = useState([
    { value: "SEDE 52", label: "SEDE 52" },
    { value: "SEDE 64", label: "SEDE 64" },
    { value: "SEDE FONTIBON", label: "SEDE FONTIBON" },
  ]);

  const [talleres, setTalleres] = useState([]);
  const [capacitadores, setCapacitadores] = useState([]);
  const [fichas, setFichas] = useState([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const [talleresData, capacitadoresData, fichasData] = await Promise.all(
          [getTalleres(), getCapacitadores(), getFichas()]
        );
        setTalleres(
          talleresData.map((taller) => ({
            value: taller.id_Taller,
            label: taller.nombre_Taller,
          }))
        );
        setCapacitadores(
          capacitadoresData.map((capacitador) => ({
            value: capacitador.id_Capac,
            label: `${capacitador.nombre_Capac} ${capacitador.apellidos_Capac}`,
          }))
        );
        setFichas(
          fichasData.map((ficha) => ({
            value: ficha.numero_Ficha,
            label: ficha.numero_Ficha.toString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const programaciones = await getProgramaciones();
      if (programaciones && typeof programaciones === "object") {
        const eventosMapeados = Object.values(programaciones).map(
          (event, index) => ({
            id: `${event.id_procaptall}`, // Combina numero_FichaFK e índice para generar un id único
            start: `${event.fecha_procaptall}T${event.horaInicio_procaptall}`,
            end: `${event.fecha_procaptall}T${event.horaFin_procaptall}`,
            title: event.descripcion_procaptall,
            extendedProps: {
              sede: event.sede_procaptall,
              ambiente: event.ambiente_procaptall,
              taller: event.nombre_Taller || "",
              capacitador: event.p_nombreCapacitador || "",
              ficha: event.numero_FichaFK ? [event.numero_FichaFK] : [],
              descripcion: event.descripcion_procaptall || "",
            },
          })
        );
  
        // Reemplaza los eventos anteriores con los nuevos
        setEvents(eventosMapeados);
      }
    } catch (error) {
      console.error("Error loading events", error);
    }
  };  


  const validateEvent = () => {
    const start = new Date(`${newEvent.date}T${newEvent.startTime}`);
    const end = new Date(`${newEvent.date}T${newEvent.endTime}`);

    if (end <= start) {
      Swal.fire(
        "Error",
        "La hora de inicio no puede ser posterior a la hora de fin.",
        "error"
      );
      return false;
    }

    const currentEventId = isEditMode ? selectedEvent.id : null;

    const isOccupied = (extendedPropsKey, value) => {
      return events.some((event) => {
        const isSameValue = event.extendedProps[extendedPropsKey] === value;
        const isSameDate = event.start.includes(newEvent.date);
        const isNotCurrentEvent = event.id !== currentEventId;

        const existingStart = new Date(event.start);
        const existingEnd = new Date(event.end);

        const isTimeOverlap = start < existingEnd && end > existingStart;

        return isSameValue && isSameDate && isNotCurrentEvent && isTimeOverlap;
      });
    };

    if (isOccupied("capacitador", newEvent.capacitador?.value)) {
      Swal.fire(
        "Error",
        "El capacitador ya tiene un taller asignado en este horario.",
        "error"
      );
      return false;
    }

    if (isOccupied("ambiente", newEvent.ambiente)) {
      Swal.fire(
        "Error",
        "El ambiente ya está ocupado en este horario.",
        "error"
      );
      return false;
    }

    if (isOccupied("ficha", newEvent.ficha?.value)) {
      Swal.fire("Error", "La ficha ya está ocupada en este horario.", "error");
      return false;
    }

    return true;
  };

  const handleDateClick = (info) => {
    setNewEvent({
      id: null,
      sede: null,
      descripcion: "",
      date: info.dateStr,
      startTime: "",
      endTime: "",
      taller: null,
      capacitador: null,
      ficha: [],
      ambiente: "",
      allDay: false,
    });
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const eventProps = info.event.extendedProps;

    setSelectedEvent(info.event);

    setNewEvent({
      id: info.event.id,
      sede: sede.find((s) => s.value === eventProps.sede) || null,
      descripcion: eventProps.descripcion || "",
      date: info.event.startStr.split("T")[0] || "",
      startTime: info.event.startStr.split("T")[1] || "",
      endTime: info.event.endStr.split("T")[1] || "",
      taller: talleres.find((t) => t.label === eventProps.taller) || null,
      capacitador:
        capacitadores.find((c) => c.label === eventProps.capacitador) || null,
      ficha: Array.isArray(eventProps.ficha)
        ? fichas.filter((f) => eventProps.ficha.includes(f.value))
        : [],
      ambiente: eventProps.ambiente || "",
      allDay: info.event.allDay || false,
    });

    setIsEditMode(true);
    setShowModal(true);
  };

  const handleEventSubmit = async () => {
    // Validación del evento
    if (!validateEvent()) return;

    const start = `${newEvent.date}T${newEvent.startTime}`;
    const end = newEvent.endTime
      ? `${newEvent.date}T${newEvent.endTime}`
      : null;

    const event = {
      sede_procaptall: newEvent.sede?.value || "",
      descripcion_procaptall: newEvent.descripcion || "",
      ambiente_procaptall: newEvent.ambiente || "",
      fecha_procaptall: newEvent.date,
      horaInicio_procaptall: newEvent.startTime,
      horaFin_procaptall: newEvent.endTime,
      nombreTaller: newEvent.taller?.label || "",
      nombreCapacitador:
        capacitadores.find((cap) => cap.value === newEvent.capacitador?.value)
          ?.label || "",
      numero_FichaFK: Array.isArray(newEvent.ficha)
        ? newEvent.ficha.map((f) => f.value).join(", ")
        : "",
    };

    console.log("Evento a actualizar:", event);
    console.log("Valor de selectedEvent antes de actualizar:", selectedEvent);

    // Validación de campo número de ficha
    if (!event.numero_FichaFK) {
      Swal.fire("Error", "El campo número de ficha es obligatorio.", "error");
      return;
    }

    try {
      if (isEditMode) {
        console.log("Modo de edición activado.");
        if (!selectedEvent || !selectedEvent.id) {
          throw new Error("ID del evento no disponible para la actualización.");
        }

        console.log("ID del evento a actualizar:", selectedEvent.id);
        await updateProgramacion(selectedEvent.id, event);

        setEvents((prev) =>
          prev.map((e) =>
            e.id_procaptall === selectedEvent.id
              ? { ...e, ...event }
              : e
          )
        );
        Swal.fire(
          "Éxito",
          "El evento ha sido actualizado correctamente.",
          "success"
        );
      } else {
        const newEventResponse = await createProgramacion(event);
        const newEventData = {
          id_procaptall: newEventResponse.id, // Asegúrate de que este ID es el correcto para un nuevo evento
          start: start,
          end: end,
          title: event.descripcion_procaptall,
          extendedProps: {
            sede: event.sede_procaptall,
            ambiente: event.ambiente_procaptall,
            taller: event.nombreTaller,
            capacitador: event.nombreCapacitador,
            ficha: event.numero_FichaFK,
            descripcion: event.descripcion_procaptall,
          },
        };

        setEvents((prev) => [...prev, newEventData]);
        Swal.fire(
          "Éxito",
          "El evento ha sido creado correctamente.",
          "success"
        );
      }

      await loadEvents();
      setShowModal(false);
    } catch (error) {
      console.error("Error al guardar el evento", error);
      Swal.fire(
        "Error",
        `Hubo un error al guardar la programación: ${error.message}`,
        "error"
      );
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await deleteProgramacion(selectedEvent.id);

        // Refresca el calendario para ver los cambios
        await loadEvents();

        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        setShowModal(false);
      } catch (error) {
        console.error("Error deleting event", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => {
      const updatedEvent = { ...prev, [name]: value };
      console.log(updatedEvent); // Verifica el estado
      return updatedEvent;
    });
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setNewEvent((prev) => {
      const updatedEvent = { ...prev, [actionMeta.name]: selectedOption };
      console.log(updatedEvent); // Verifica el estado
      return updatedEvent;
    });
  };

  return (
    <>
      <div className="calendar-container-pct">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="es"
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          editable={true}
          eventContent={(eventInfo) => (
            <p>{`${eventInfo.event.extendedProps.sede}`}</p>
          )}
        />
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        className="my-custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Editar Programación" : "Agregar Programación"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="eventSede">
                  <Form.Label>Sede</Form.Label>
                  <Select
                    name="sede"
                    options={sede}
                    value={newEvent.sede}
                    onChange={handleSelectChange}
                    placeholder="Selecciona la sede"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="eventAmbiente">
                  <Form.Label>Ambiente</Form.Label>
                  <Form.Control
                    type="text"
                    name="ambiente"
                    value={newEvent.ambiente}
                    onChange={handleInputChange}
                    placeholder="Ingrese el ambiente"
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <Form.Group controlId="eventDescripcion">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={newEvent.descripcion}
                    onChange={handleInputChange}
                    style={{ width: "100%" }}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="eventDate">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="eventStartTime">
                  <Form.Label>Hora de Inicio</Form.Label>
                  <Form.Control
                    type="text"
                    name="startTime"
                    value={newEvent.startTime}
                    onChange={handleInputChange}
                    placeholder="HH:mm:ss"
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="eventEndTime">
                  <Form.Label>Hora de Fin</Form.Label>
                  <Form.Control
                    type="text"
                    name="endTime"
                    value={newEvent.endTime}
                    onChange={handleInputChange}
                    placeholder="HH:mm:ss"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="eventTaller">
                  <Form.Label>Taller</Form.Label>
                  <Select
                    name="taller"
                    options={talleres}
                    value={newEvent.taller}
                    onChange={handleSelectChange}
                    placeholder="Selecciona el taller"
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="eventCapacitador">
                  <Form.Label>Capacitador</Form.Label>
                  <Select
                    name="capacitador"
                    options={capacitadores}
                    value={newEvent.capacitador}
                    onChange={handleSelectChange}
                    placeholder="Selecciona el capacitador"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group controlId="eventFicha">
                  <Form.Label>Ficha</Form.Label>
                  <Select
                    name="ficha"
                    options={fichas}
                    value={newEvent.ficha}
                    onChange={handleSelectChange}
                    placeholder="Selecciona la ficha"
                    isMulti
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {isEditMode && (
            <Button variant="danger" onClick={handleDeleteEvent}>
              Eliminar
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEventSubmit}>
            {isEditMode ? "Guardar Cambios" : "Crear Programación"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Calendario;
