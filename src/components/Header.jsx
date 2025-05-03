// Header.jsx – versión 10/10 con glassmorphism, sticky y animaciones
import React from 'react';
import {
  Bars3Icon,
  CalendarDaysIcon,
  ListBulletIcon,
  CalendarIcon as SmallCalendarIcon,
} from '@heroicons/react/24/outline';

export default function Header({ onOpenMenu, currentView, onChangeView }) {
  return (
    <header
      className="sticky top-0 z-50 w-full bg-white/10 dark:bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Botón menú hamburguesa */}
        <button
          onClick={onOpenMenu}
          className="text-white/90 hover:text-white p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Logo + título */}
        <div className="flex items-center gap-3 select-none">
          <CalendarDaysIcon className="h-8 w-8 text-pink-400 animate-pulse" style={{ animationDuration: '2s' }} />
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent text-shadow-md animate-gradient">
            Obsidyan
          </h1>
        </div>

        {/* Botones de cambio de vista */}
        <div className="flex items-center gap-1 sm:gap-2 bg-white/10 dark:bg-black/20 rounded-full p-1 shadow-inner backdrop-blur-md">
          <button
            onClick={() => onChangeView('list')}
            className={`flex items-center gap-1.5 py-1.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent ${
              currentView === 'list'
                ? 'bg-white text-[var(--color-primary)] shadow-md scale-105'
                : 'text-white/90 hover:bg-white/20'
            }`}
            title="Ver como Lista"
          >
            <ListBulletIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Lista</span>
          </button>
          <button
            onClick={() => onChangeView('calendar')}
            className={`flex items-center gap-1.5 py-1.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent ${
              currentView === 'calendar'
                ? 'bg-white text-[var(--color-primary)] shadow-md scale-105'
                : 'text-white/90 hover:bg-white/20'
            }`}
            title="Ver como Calendario"
          >
            <SmallCalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Calendario</span>
          </button>
        </div>
      </div>
    </header>
  );
}

