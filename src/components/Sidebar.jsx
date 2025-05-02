// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  MoonIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

function Sidebar({ isOpen, onClose, onChangeView, currentView, onShowClients }) {
  // Estado para controlar el modo oscuro (simplified logic)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (localStorage.darkMode === 'true') return true;
    if (localStorage.darkMode === 'false') return false;
    // If no preference saved, check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Effect to apply dark mode class and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Base classes for the sidebar
  const baseClasses = `fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-bg-light)] dark:bg-gray-900 text-[var(--color-text-dark)] dark:text-[var(--color-text-light)] transform transition-transform duration-300 ease-in-out shadow-2xl p-5 flex flex-col border-r border-black/10 dark:border-white/10`;
  const translateClass = isOpen ? 'translate-x-0' : '-translate-x-full';

  // Common classes for navigation links/buttons
  // Define common styles here to avoid repetition
  const commonLinkClasses = `relative flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out group overflow-hidden`; // Added group for hover effects
  const inactiveLinkClasses = `text-[var(--color-text-medium)] hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] hover:bg-[var(--color-primary)]/10 dark:hover:bg-[var(--color-primary)]/20`;
  const activeLinkClasses = `sidebar-link-active`; // Use utility class for active effect

  // Handle navigation click
  const handleNavigate = (view) => {
    onChangeView(view);
    // Optionally close sidebar on mobile after navigation
    // if (window.innerWidth < 1024) { onClose(); }
  };

  // Shared link/button component for consistency
  const NavLink = ({ view, icon: Icon, label, isDisabled = false, onClick }) => { // Added onClick
    const isActive = currentView === view;
    const linkClasses = `${commonLinkClasses} ${
      isActive ? activeLinkClasses : inactiveLinkClasses
    } ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`;

    return (
      <button
        onClick={() => !isDisabled && (onClick ? onClick() : handleNavigate(view))} // Use onClick if provided
        className={linkClasses}
        aria-current={isActive ? 'page' : undefined}
        disabled={isDisabled}
        title={isDisabled ? `${label} (Próximamente)` : label}
      >
        <Icon
          className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${
            isActive
              ? 'text-white'
              : 'text-[var(--color-text-medium)] group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary-light)]'
          }`}
        />
        <span className={`transition-colors ${isActive ? 'text-white font-semibold' : ''}`}>{label}</span>
        {/* Active indicator (optional, alternative to background animation) */}
        {/* {isActive && <span className="absolute right-0 top-1/2 transform -translate-y-1/2 h-2 w-2 bg-white rounded-full mr-2"></span>} */}
      </button>
    );
  };

  return (
    <aside id="menu-lateral" className={`${baseClasses} ${translateClass}`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10 dark:border-white/10">
        <span className="text-lg font-semibold text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
          Menú Principal
        </span>
        <button
          onClick={onClose}
          className="text-[var(--color-text-medium)] p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          aria-label="Cerrar menú"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-2">
        <NavLink view="list" icon={ClipboardDocumentListIcon} label="Lista de Citas" />
        <NavLink view="calendar" icon={CalendarIcon} label="Calendario de Citas" />
        <NavLink view="clients" icon={UserGroupIcon} label="Clientes" onClick={onShowClients} />
        <NavLink view="settings" icon={Cog6ToothIcon} label="Ajustes" isDisabled={true} />
      </nav>

      {/* Sidebar Footer & Dark Mode Toggle */}
      <div className="mt-auto pt-4 border-t border-black/10 dark:border-white/10 space-y-4">
        {/* Dark Mode Button */}
        <button
          onClick={toggleDarkMode}
          className={`${commonLinkClasses} ${inactiveLinkClasses} w-full`}
          title={`Cambiar a Modo ${isDarkMode ? 'Claro' : 'Oscuro'}`}
        >
          {isDarkMode ? (
            <SunIcon className="h-5 w-5 mr-3 flex-shrink-0" />
          ) : (
            <MoonIcon className="h-5 w-5 mr-3 flex-shrink-0" />
          )}
          <span>Modo {isDarkMode ? 'Claro' : 'Oscuro'}</span>
        </button>

        {/* Copyright Text */}
        <p className="text-center text-xs text-[var(--color-text-medium)] opacity-70">
          © {new Date().getFullYear()} Tu Clínica Estética
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
