// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast'; // Import toast
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AppointmentList from './components/AppointmentList';
import CalendarView from './components/CalendarView';
import ClientList from './components/ClientList'; // Import ClientList
import esLocale from '@fullcalendar/core/locales/es'; // Ensure spanish locale is imported if needed by calendar

function App() {
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('citas');
      // Add validation to ensure saved data is an array
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse appointments from localStorage:', error);
      return []; // Return empty array on error
    }
  });

  const [currentView, setCurrentView] = useState('list'); // Default to 'list'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showClients, setShowClients] = useState(false); // New state for ClientList

  // Persist appointments to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('citas', JSON.stringify(appointments));
    } catch (error) {
      console.error('Failed to save appointments to localStorage:', error);
      toast.error('Hubo un problema al guardar las citas.');
    }
  }, [appointments]);

  // Function to add a new appointment
  const addAppointment = (appointmentData) => {
    // Ensure date is valid before adding
    if (!appointmentData.fechaHora || isNaN(new Date(appointmentData.fechaHora).getTime())) {
      toast.error('Fecha u hora inválida. No se pudo agregar la cita.');
      console.error('Invalid date/time format received:', appointmentData.fechaHora);
      return; // Stop execution if date is invalid
    }

    const newAppointment = {
      ...appointmentData,
      id: Date.now().toString(), // Simple unique ID
      // Store fechaHora as ISO string for consistency
      fechaHora: new Date(appointmentData.fechaHora).toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))); // Keep sorted
    toast.success(`Cita para ${appointmentData.nombre} agregada!`);
  };

  // Function to delete an appointment
  const deleteAppointment = (idToDelete) => {
    setAppointments(prev => prev.filter(app => app.id !== idToDelete));
    // No need for separate toast here, it's handled in AppointmentList
  };

  // Function to change the main view
  const changeView = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar on view change
    setShowClients(false); // Hide ClientList when changing views
  };

  // Function to show ClientList
  const handleShowClients = () => {
    setCurrentView(null); // Clear currentView to avoid conflicts
    setIsSidebarOpen(false);
    setShowClients(true);
  };

  return (
    // Use min-h-screen and flex column to ensure footer sticks to bottom if content is short
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-purple-950 text-white">
      <Toaster
        position="top-center" // Centered might look cleaner
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(51, 65, 85, 0.9)', // Darker, slightly transparent
            color: '#fff',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          },
          success: {
            iconTheme: { primary: '#2dd4bf', secondary: '#fff' }, // Teal icon
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#fff' }, // Red icon
          },
        }}
      />

      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onChangeView={changeView}
        currentView={currentView}
        onShowClients={handleShowClients} // Pass the handler
      />

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden backdrop-blur-sm cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content Area - Adjust margin based on sidebar visibility if needed */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen && false ? 'lg:ml-64' : 'lg:ml-0'
        }`}
      >
        {/* Header Component */}
        <Header
          onOpenMenu={() => setIsSidebarOpen(true)}
          currentView={currentView}
          onChangeView={changeView}
        />

        {/* Page Content */}
        <main id="content" className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {/* Conditional Rendering based on currentView */}
          {currentView === 'list' ? (
            <AppointmentList
              appointments={appointments}
              onAddAppointment={addAppointment} // Pass the function correctly
              onDeleteAppointment={deleteAppointment}
            />
          ) : currentView === 'calendar' ? (
            <CalendarView
              appointments={appointments}
              locale={esLocale} // Pass locale if needed
            />
          ) : showClients ? (
            <ClientList />
          ) : (
            <div>
              {/* You might want a more informative placeholder or landing page content */}
              <p className="text-center text-gray-400">Selecciona una opción del menú.</p>
            </div>
          )}
        </main>

        {/* Optional Footer */}
        <footer className="text-center p-4 text-xs text-gray-400/70 mt-auto">
          © {new Date().getFullYear()} Tu Clínica Estética | Hecho con por z1000
        </footer>
      </div>
    </div>
  );
}

export default App;