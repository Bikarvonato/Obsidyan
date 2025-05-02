// tailwind.config.js
const colors = require('tailwindcss/colors'); // Para acceder a la paleta por defecto de Tailwind

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Asegura que busque en los archivos React
  ],
  theme: {
    extend: {
      colors: {
        primary: { // Paleta Principal Refinada
          light: '#FADADD',
          DEFAULT: '#E596AC',
          medium: '#D9819C',
          dark: '#C36582',
        },
        accent: { // Paleta de Acento
          light: '#D9D6FF',
          DEFAULT: '#A29BFE',
          dark: '#8A81E8',
        },
        neutral: { // Neutros Mejorados
          lightest: '#FFFFFF',
          lighter: colors.gray[50],
          light: colors.gray[200],
          medium: colors.gray[500],
          dark: colors.gray[700],
          darker: colors.gray[900],
        },
        success: colors.emerald[500], // Verde para éxito
        warning: colors.amber[500],  // Ámbar para advertencia
        danger: colors.red[600],     // Rojo para peligro/error
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Fuente principal
      },
      boxShadow: { // Sombras personalizadas
        soft: '0 4px 15px rgba(0,0,0,0.06)',
        medium: '0 8px 25px rgba(0,0,0,0.08)',
        glow: '0 0 20px rgba(229, 150, 172, 0.4)',
        'glow-accent': '0 0 20px rgba(162, 155, 254, 0.4)',
      },
      keyframes: { // Animaciones (si las usas)
        fadeInUp: {
          'from': { opacity: 0, transform: 'translateY(10px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Activa el plugin de formularios
  ],
  darkMode: 'class', // <---- ASEGÚRATE DE TENER ESTA LÍNEA
}