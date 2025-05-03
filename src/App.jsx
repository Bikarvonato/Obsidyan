// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AppointmentList from './components/AppointmentList';
import CalendarView from './components/CalendarView';
import ClientList from './components/ClientList';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store';           //  ←  Zustand
import esLocale from '@fullcalendar/core/locales/es';

export default function App() {
  /* ----- navegación local ----- */
  const [currentView, setCurrentView] = useState('list'); // list | calendar | null
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showClients, setShowClients] = useState(false);

  /* ----- datos globales (Zustand) ----- */
  const appointments       = useStore((s) => s.appointments);
  const addAppointment     = useStore((s) => s.addAppointment);
  const deleteAppointment  = useStore((s) => s.deleteAppointment);

  /* ----- helpers navegación ----- */
  const changeView = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
    setShowClients(false);
  };

  const handleShowClients = () => {
    setCurrentView(null);   // evita conflicto con list|calendar
    setIsSidebarOpen(false);
    setShowClients(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 text-white">
      {/* Toasts globales */}
      <Toaster position="top-center" />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onChangeView={changeView}
        currentView={currentView}
        onShowClients={handleShowClients}
      />

      {/* Overlay móvil cuando sidebar abierto */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div className="flex flex-col flex-1">
        <Header
          onOpenMenu={() => setIsSidebarOpen(true)}
          currentView={currentView}
          onChangeView={changeView}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {currentView === 'list' && (
            <AppointmentList
              appointments={appointments}
              onAddAppointment={addAppointment}
              onDeleteAppointment={deleteAppointment}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView appointments={appointments} locale={esLocale} />
          )}

          {showClients && <ClientList />}
        </main>

        <footer className="text-center p-4 text-xs text-gray-400/70 mt-auto">
          © {new Date().getFullYear()} Obsidyan | Hecho por Bika
        </footer>
      </div>
    </div>
  );
}
