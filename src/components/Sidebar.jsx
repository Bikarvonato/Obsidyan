// Sidebar.jsx – glassmorphism, animaciones y diseño 10/10
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
  /* ── Modo oscuro persistente ─────────────────────────── */
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (localStorage.darkMode === 'true') return true;
    if (localStorage.darkMode === 'false') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  /* ── Estilos base del sidebar ────────────────────────── */
  const base =
    'fixed inset-y-0 left-0 z-[60] w-64 flex flex-col p-5 backdrop-blur-xl bg-white/10 dark:bg-white/5 border-r border-white/10 shadow-2xl transition-transform duration-300';
  const translate = isOpen ? 'translate-x-0' : '-translate-x-full';

  /* ── Navegación ──────────────────────────────────────── */
  const navItem = (
    label,
    view,
    Icon,
    extraClick,
    disabled = false,
  ) => {
    const active = currentView === view;
    return (
      <button
        key={label}
        onClick={() => {
          if (disabled) return;
          extraClick ? extraClick() : onChangeView(view);
        }}
        className={`group relative flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium transition-all ${
          active
            ? 'bg-[var(--color-accent)] text-white shadow-lg'
            : 'text-white/80 hover:bg-white/10'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Icon className="h-5 w-5 flex-shrink-0" />
        {label}
        {active && (
          <span className="absolute right-2 h-2 w-2 rounded-full bg-white animate-ping" />
        )}
      </button>
    );
  };

  return (
    <aside className={`${base} ${translate}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-fuchsia-500 bg-clip-text text-transparent select-none">
          Menú
        </span>
        <button
          onClick={onClose}
          className="text-white/80 p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 space-y-1">
        {navItem('Lista de Citas', 'list', ClipboardDocumentListIcon)}
        {navItem('Calendario', 'calendar', CalendarIcon)}
        {navItem('Clientes', 'clients', UserGroupIcon, onShowClients)}
        {navItem('Ajustes', 'settings', Cog6ToothIcon, null, true)}
      </nav>

      {/* Dark mode toggle */}
      <div className="mt-auto pt-4 border-t border-white/10 space-y-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center gap-3 w-full rounded-lg px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition"
        >
          {isDarkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
          Modo {isDarkMode ? 'Claro' : 'Oscuro'}
        </button>
        <p className="text-xs text-white/50 text-center select-none">
          © {new Date().getFullYear()} Obsidyan
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
