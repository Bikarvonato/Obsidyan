import React from 'react';
import toast from 'react-hot-toast';
import {
  TrashIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import AppointmentForm from './AppointmentForm';
import { useStore } from '../store';            //  ←  Zustand

export default function AppointmentList() {
  /* ----------- datos globales ----------- */
  const appointments       = useStore((s) => s.appointments);
  const deleteAppointment  = useStore((s) => s.deleteAppointment);

  /* ----------- separar próximas / pasadas ----------- */
  const now = new Date();

  const upcoming = appointments
    .filter((a) => new Date(a.fechaHora) >= now)
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

  const past = appointments
    .filter((a) => new Date(a.fechaHora) < now)
    .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));

  /* ----------- eliminar con confirmación ----------- */
  const confirmDelete = (id, nombre) =>
    toast((t) => (
      <div className="flex flex-col items-center text-center p-2">
        <ExclamationTriangleIcon className="h-10 w-10 text-red-400 mb-3" />
        <p className="font-semibold mb-4 text-sm">
          ¿Eliminar la cita de{' '}
          <span className="font-bold text-[var(--color-accent)]">{nombre}</span>?
        </p>
        <div className="flex gap-3 justify-center w-full">
          <button
            onClick={() => {
              deleteAppointment(id);
              toast.success('Cita eliminada', { id: t.id });
            }}
            className="btn btn-danger px-4 py-1.5 text-xs flex-1"
          >
            Sí, eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="btn btn-ghost px-4 py-1.5 text-xs flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 6000, id: `del-${id}` });

  /* ----------- render item ----------- */
  const renderItem = (cita, i, isPast = false) => {
    const d = new Date(cita.fechaHora);
    const dateStr = d.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <li
        key={cita.id}
        style={{ '--stagger-index': i }}
        className={`appointment-item ${isPast ? 'appointment-item-past' : ''}`}
      >
        <div className="flex-1 space-y-2 pr-4">
          <p className="flex items-center text-lg font-bold text-[var(--color-primary)]">
            <UserIcon className="h-5 w-5 mr-2.5 opacity-80" />
            {cita.nombre}
          </p>
          <p className="flex items-center text-sm">
            <SparklesIcon className="h-4 w-4 mr-2.5 text-[var(--color-accent)]" />
            {cita.servicio}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center text-xs text-[var(--color-text-medium)] space-y-1 sm:space-y-0 sm:space-x-4 pt-1">
            <span className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1.5 opacity-70" />
              {dateStr}
            </span>
            <span className="flex items-center font-medium">
              <ClockIcon className="h-4 w-4 mr-1.5 opacity-70" />
              {timeStr}
            </span>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 self-center">
          <button
            onClick={() => confirmDelete(cita.id, cita.nombre)}
            className="btn btn-danger btn-icon"
            aria-label={`Eliminar cita de ${cita.nombre}`}
            disabled={isPast}
            title={isPast ? 'No se puede eliminar citas pasadas' : 'Eliminar Cita'}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </li>
    );
  };

  /* ----------- render sección ----------- */
  const renderSection = (arr, title, pastSec = false) => (
    <section className="card p-4 md:p-6 animate-fade-in-up">
      <h2 className="text-xl font-semibold mb-5 text-shadow-md">{title}</h2>
      {arr.length === 0 ? (
        <p className="text-[var(--color-text-medium)] text-center py-8 italic">
          {pastSec ? 'No hay citas pasadas.' : 'No hay próximas citas.'}
        </p>
      ) : (
        <ul className="space-y-4 stagger-children">
          {arr.map((c, i) => renderItem(c, i, pastSec))}
        </ul>
      )}
    </section>
  );

  /* ----------- UI ----------- */
  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Formulario para añadir citas (usa store internamente) */}
      <AppointmentForm />

      {/* Próximas y pasadas */}
      {renderSection(upcoming, 'Próximas Citas')}
      {renderSection(past, 'Historial de Citas', true)}
    </div>
  );
}
