// src/components/AppointmentList.jsx
import React from 'react';
import toast from 'react-hot-toast';
import {
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  SparklesIcon,
  ExclamationTriangleIcon, // For confirmation
} from '@heroicons/react/24/outline'; // Use outline for consistency
import AppointmentForm from './AppointmentForm';

function AppointmentList({
  appointments,
  onAddAppointment,
  onDeleteAppointment,
}) {
  // Ensure appointments is always an array
   const validAppointments = Array.isArray(appointments) ? appointments : [];


  // Filter appointments into upcoming and past based on the ISO fechaHora string
   const now = new Date();
   // Add error handling for date parsing during filter
   const upcoming = validAppointments.filter(app => {
       try {
           return new Date(app.fechaHora) >= now;
       } catch (e) { console.error("Invalid date in upcoming filter:", app.fechaHora); return false; }
   }).sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)); // Keep sorted

   const past = validAppointments.filter(app => {
       try {
           return new Date(app.fechaHora) < now;
       } catch (e) { console.error("Invalid date in past filter:", app.fechaHora); return false; }
   }).sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora)); // Sort past descending (most recent first)


  // Function to handle the deletion confirmation
  const handleDelete = (id, nombre) => {
    toast(
      (t) => (
        <div className="flex flex-col items-center text-center p-2">
           <ExclamationTriangleIcon className="h-10 w-10 text-red-400 mb-3"/>
          <p className="font-semibold mb-4 text-sm">
            ¿Estás seguro de eliminar la cita de <br/> <span className="font-bold text-[var(--color-accent)]">{nombre}</span>?
          </p>
          <div className="flex gap-3 justify-center w-full">
            <button
              onClick={() => {
                try {
                  onDeleteAppointment(id);
                  toast.success('Cita eliminada con éxito.', { id: t.id }); // Give feedback
                } catch (error) {
                  console.error("Error deleting appointment:", error);
                  toast.error('No se pudo eliminar la cita.', { id: t.id });
                }
              }}
              className="btn btn-danger px-4 py-1.5 text-xs flex-1" // Use danger button style
            >
              Sí, eliminar
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="btn btn-ghost px-4 py-1.5 text-xs flex-1" // Use ghost button style
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
         duration: 6000, // Keep toast longer for confirmation
         id: `delete-confirm-${id}`, // Unique ID to prevent duplicates if clicked fast
       }
    );
  };

  // Function to render a single appointment item
  const renderAppointmentItem = (cita, index, isPast = false) => {
    let appointmentDate;
    try {
        appointmentDate = new Date(cita.fechaHora);
        if (isNaN(appointmentDate.getTime())) throw new Error("Invalid Date");
    } catch (error) {
        console.error("Error parsing date for appointment:", cita.id, cita.fechaHora);
        // Render a fallback or skip rendering
        return (
            <li key={cita.id || index} className="appointment-item appointment-item-past p-4 text-red-500">
                Error al mostrar esta cita (fecha inválida).
            </li>
        );
    }


    const formattedDate = appointmentDate.toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = appointmentDate.toLocaleTimeString('es-ES', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });

    return (
      <li
        key={cita.id}
        // Apply stagger animation based on index
        style={{ '--stagger-index': index }}
        className={`appointment-item ${isPast ? 'appointment-item-past' : ''}`}
      >
        {/* Main Info */}
        <div className="flex-1 space-y-2 pr-4">
          <p className="flex items-center text-lg font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">
            <UserIcon className="h-5 w-5 mr-2.5 opacity-80" />
            {cita.nombre}
          </p>
          <p className="flex items-center text-sm text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
            <SparklesIcon className="h-4 w-4 mr-2.5 text-[var(--color-accent)]" />
            {cita.servicio}
          </p>
          {/* Date & Time */}
          <div className="flex flex-col sm:flex-row sm:items-center text-xs text-[var(--color-text-medium)] space-y-1 sm:space-y-0 sm:space-x-4 pt-1">
            <span className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1.5 opacity-70" />
              {formattedDate}
            </span>
            <span className="flex items-center font-medium">
              <ClockIcon className="h-4 w-4 mr-1.5 opacity-70" />
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 self-center sm:self-auto">
          <button
            onClick={() => handleDelete(cita.id, cita.nombre)}
            className="btn btn-danger btn-icon" // Use icon button style
            aria-label={`Eliminar cita de ${cita.nombre}`}
            disabled={isPast} // Disable delete for past appointments
            title={isPast ? "No se pueden eliminar citas pasadas" : "Eliminar Cita"}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </li>
    );
  };


  // Function to render a section of appointments (upcoming or past)
  const renderAppointmentsSection = (appointmentsToList, title, isPastSection = false) => (
    <section className="card p-4 md:p-6 animate-fade-in-up">
      <h2 className="text-xl font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)] mb-5 text-shadow-md">{title}</h2>
      {appointmentsToList.length === 0 ? (
        <p className="text-[var(--color-text-medium)] text-center py-8 italic">
          {isPastSection ? "No hay citas pasadas." : "No hay próximas citas programadas."}
        </p>
      ) : (
        // Apply stagger animation container
        <ul className="space-y-4 stagger-children">
          {appointmentsToList.map((cita, index) => renderAppointmentItem(cita, index, isPastSection))}
        </ul>
      )}
    </section>
  );

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Form for adding new appointments */}
      <AppointmentForm onAddAppointment={onAddAppointment} />

      {/* Upcoming Appointments Section */}
      {renderAppointmentsSection(upcoming, 'Próximas Citas')}

      {/* Past Appointments Section */}
      {renderAppointmentsSection(past, 'Historial de Citas', true)}
    </div>
  );
}

export default AppointmentList;