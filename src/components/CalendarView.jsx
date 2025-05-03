// src/components/CalendarView.jsx – glass + colores por servicio + tooltips
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

/* Mapear servicio a color (usa vars añadidas en index.css) */
const SERVICE_COLORS = {
  Gel: 'var(--svc-gel)',
  Polygel: 'var(--svc-polygel)',
  'Lifting de pestañas': 'var(--svc-lifting)',
};

export default function CalendarView({ appointments }) {
  /* Formateo a eventos de react-big-calendar */
  const events = (appointments || []).map((a) => {
    const start = new Date(a.fechaHora);
    return {
      ...a,
      title: `${a.nombre} – ${a.servicio}`,
      start,
      end: moment(start).add(1, 'hour').toDate(),
      allDay: false,
    };
  });

  /* Estilo dinámico según servicio */
  const eventStyleGetter = (event) => {
    const base = {
      backgroundColor: SERVICE_COLORS[event.servicio] || 'var(--color-accent)',
      border: 'none',
      color: '#fff',
      borderRadius: '6px',
      boxShadow: '0 2px 6px rgba(0,0,0,.25)',
      padding: '2px 6px',
      fontSize: '0.75rem',
    };
    return { style: base };
  };

  return (
    <div className="card animate-fade-in-up h-[75vh] md:h-[80vh] overflow-hidden">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        style={{ height: '100%' }}
        culture="es"
        views={["month", "week", "day"]}
        defaultView="week"
        step={30}
        timeslots={2}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={(event) =>
          `${moment(event.start).format('DD/MM HH:mm')}\n${event.nombre}\n${event.servicio}`
        }
        messages={{
          next: 'Sig >',
          previous: '< Ant',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          noEventsInRange: 'No hay citas en este rango.'
        }}
      />
    </div>
  );
}
