// src/components/Header.jsx
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
      // Use variables for gradient colors for consistency
      className="bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg transition-all duration-300 py-3 px-4 sm:px-6 flex items-center justify-between relative z-30 animate-gradient"
    >
      {/* Left Section: Hamburger Menu (Mobile) & Logo/Title (Desktop) */}
      <div className="flex items-center gap-3">
        {/* Hamburger Button - Mobile Only */}
        {/* Hamburger Button - Visible on all screens */}
        <button
          onClick={onOpenMenu}
          // Clase lg:hidden eliminada
          className="text-white p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
          aria-label="Abrir menú"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-default">
          <CalendarDaysIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white animate-pulse" style={{ animationDuration: '2s' }}/>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-shadow-lg whitespace-nowrap">
             Estética Agenda
          </h1>
        </div>
      </div>


      {/* Right Section: View Switcher Buttons */}
      <div className="flex items-center gap-1 sm:gap-2 bg-white/15 dark:bg-black/20 rounded-full p-1 shadow-inner">
        <button
          onClick={() => onChangeView('list')}
          className={`flex items-center gap-1.5 py-1.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
            ${
              currentView === 'list'
                ? 'bg-white text-[var(--color-primary)] shadow-md transform scale-105' // Active state emphasized
                : 'text-white hover:bg-white/20'
            }
          `}
          title="Ver como Lista"
        >
          <ListBulletIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Lista</span>
        </button>
        <button
          onClick={() => onChangeView('calendar')}
          className={`flex items-center gap-1.5 py-1.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
            ${
              currentView === 'calendar'
                ? 'bg-white text-[var(--color-primary)] shadow-md transform scale-105' // Active state emphasized
                : 'text-white hover:bg-white/20'
            }
          `}
          title="Ver como Calendario"
        >
          <SmallCalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">Calendario</span>
        </button>
      </div>
    </header>
  );
}
