// src/components/CalendarView.jsx
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Ensure Spanish locale for moment

// Setup the localizer by providing the moment Object
// to the correct localizer.
moment.locale('es'); // Set Spanish locale globally for moment
const localizer = momentLocalizer(moment);

function CalendarView({ appointments, locale }) { // Receive locale prop if needed elsewhere
  // Convert appointment data to the format required by react-big-calendar
   const events = Array.isArray(appointments) ? appointments.map((appointment) => {
       let startDate, endDate;
       try {
           // Ensure fechaHora is a valid date string before converting
           const dateObj = new Date(appointment.fechaHora);
           if (isNaN(dateObj.getTime())) {
               throw new Error("Invalid date format");
           }
           startDate = dateObj;
           // Assuming appointments are instantaneous or have a default duration (e.g., 1 hour)
           // If you store duration, calculate endDate accordingly.
           endDate = moment(startDate).add(1, 'hour').toDate(); // Example: 1-hour duration
       } catch (error) {
           console.error("Error processing appointment for calendar:", appointment.id, appointment.fechaHora, error);
           // Return a placeholder or null to avoid crashing the map function
           return null;
       }


       return {
           id: appointment.id,
           title: `${appointment.nombre} - ${appointment.servicio}`, // More descriptive title
           start: startDate,
           end: endDate,
           allDay: false, // Assuming these are timed appointments
           resource: appointment, // Include original data if needed for onSelectEvent
       };
   }).filter(event => event !== null) : []; // Filter out any null entries from errors


  // Customize event styling
  const eventStyleGetter = (event, start, end, isSelected) => {
    const style = {
      // Use variables from index.css
      backgroundColor: 'var(--color-secondary)',
      borderRadius: '5px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      transition: 'all 0.2s ease',
    };
    // Add hover effect or selected style if needed
     if (isSelected) {
         style.backgroundColor = 'var(--color-accent)';
         style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
         style.opacity = 1;
     }

    return {
      style: style
    };
  };

  // Optional: Handle clicking on an event
  const handleSelectEvent = (event) => {
    // Example: Show details in a toast or modal
    toast(`Cita seleccionada:\n${event.title}\n${moment(event.start).format('lll')}`);
    console.log("Selected Event:", event);
  };

   // Optional: Handle clicking on a day/time slot
   const handleSelectSlot = ({ start, end }) => {
     // Example: Open the add appointment form pre-filled with the date/time
     // You might need to switch view or open a modal here.
     console.log('Selected slot:', start, end);
     toast(`Slot seleccionado: ${moment(start).format('lll')}`);
     // Example: (if form was a modal) openModalWithDateTime(start);
   };


  return (
    // Apply card styling and animation to the container
    <div className="card p-2 md:p-4 animate-fade-in-up h-[75vh] md:h-[80vh]"> {/* Adjust height as needed */}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: '100%' }} // Ensure calendar fills the container
        culture='es' // Set culture for calendar localization (relies on moment.locale)
        views={['month', 'week', 'day']} // Specify available views
        defaultView="week" // Set default view
        step={30} // Time slot interval (in minutes)
        timeslots={2} // Number of slots per step (e.g., 2 slots per 30 mins = 15 min increments shown)
        selectable={true} // Allow selecting time slots
        onSelectEvent={handleSelectEvent} // Handle event click
        onSelectSlot={handleSelectSlot} // Handle slot click
        eventPropGetter={eventStyleGetter} // Apply custom styles to events
        messages={{ // Optional: Translate calendar buttons/labels if needed beyond locale
             next: "Sig >",
             previous: "< Ant",
             today: "Hoy",
             month: "Mes",
             week: "Semana",
             day: "Día",
             agenda: "Agenda",
             date: "Fecha",
             time: "Hora",
             event: "Evento",
             noEventsInRange: "No hay citas en este rango.",
             // Add other messages as needed
           }}
      />
    </div>
  );
}

export default CalendarView;