import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
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
    ficha: null,
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
        // Llamadas a la API para obtener los datos
        const [talleresData, capacitadoresData, fichasData] = await Promise.all(
          [getTalleres(), getCapacitadores(), getFichas()]
        );

        // Verificamos si los datos se están obteniendo correctamente
        console.log("Talleres data:", talleresData);
        console.log("Capacitadores data:", capacitadoresData);
        console.log("Fichas data:", fichasData);

        // Mapeamos los datos para usarlos en react-select
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
      setEvents(
        programaciones.map((event) => ({
          id: event.id,
          start: event.start,
          end: event.end,
          extendedProps: {
            sede: event.sede,
            descripcion: event.descripcion,
            taller: event.taller,
            capacitador: event.capacitador,
            ficha: event.ficha,
            ambiente: event.ambiente,
          },
        }))
      );
    } catch (error) {
      console.error("Error loading events", error);
    }
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
      ficha: null,
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
      sede: sede.find((sede) => sede.value === eventProps.sede) || null,
      descripcion: eventProps.descripcion || "",
      date: info.event.startStr.split("T")[0] || "",
      startTime: info.event.startStr.split("T")[1] || "",
      endTime: info.event.endStr ? info.event.endStr.split("T")[1] : "",
      taller:
        talleres.find((taller) => taller.value === eventProps.taller) || null,
      capacitador:
        capacitadores.find(
          (capacitador) => capacitador.value === eventProps.capacitador
        ) || null,
      ficha: fichas.find((ficha) => ficha.value === eventProps.ficha) || null,
      ambiente: eventProps.ambiente || "",
      allDay: info.event.allDay || false,
    });
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleEventSubmit = async () => {
    if (!newEvent.date || !newEvent.startTime) {
      alert(
        "Por favor complete los campos obligatorios: título, fecha y hora de inicio."
      );
      return;
    }

    const start = `${newEvent.date}T${newEvent.startTime}`;
    const end = newEvent.endTime
      ? `${newEvent.date}T${newEvent.endTime}`
      : null;

    const event = {
      id: newEvent.id || null,
      start,
      end,
      extendedProps: {
        sede: newEvent.sede ? newEvent.sede.value : "",
        descripcion: newEvent.descripcion || "",
        taller: newEvent.taller ? newEvent.taller.value : "",
        capacitador: newEvent.capacitador ? newEvent.capacitador.value : "",
        ficha: newEvent.ficha ? newEvent.ficha.value : "",
        ambiente: newEvent.ambiente || "",
      },
    };

    try {
      if (isEditMode) {
        await updateProgramacion(selectedEvent.id, event);
        setEvents(events.map((e) => (e.id === selectedEvent.id ? event : e)));
      } else {
        const newEventResponse = await createProgramacion(event);
        setEvents([...events, { ...event, id: newEventResponse.id }]);
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error saving event", error);
      alert(
        "Error al crear o actualizar la programación. Verifica los campos y vuelve a intentarlo."
      );
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await deleteProgramacion(selectedEvent.id);
        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        setShowModal(false);
      } catch (error) {
        console.error("Error deleting event", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    setNewEvent({ ...newEvent, [actionMeta.name]: selectedOption });
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
                    type="time"
                    name="startTime"
                    value={newEvent.startTime}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group controlId="eventEndTime">
                  <Form.Label>Hora de Fin</Form.Label>
                  <Form.Control
                    type="time"
                    name="endTime"
                    value={newEvent.endTime}
                    onChange={handleInputChange}
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
