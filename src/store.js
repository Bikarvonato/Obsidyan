// src/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      /* ---------- STATE ---------- */
      clients: [],
      appointments: [],

      /* ---------- CLIENTES ---------- */
      addClient: (client) =>
        set((s) => ({ clients: [...s.clients, client] })),

      updateClient: (updated) =>
        set((s) => ({
          clients: s.clients.map((c) => (c.id === updated.id ? updated : c)),
        })),

      deleteClient: (id) =>
        set((s) => ({ clients: s.clients.filter((c) => c.id !== id) })),

      /* ---------- CITAS ---------- */
      addAppointment: (appt) =>
        set((s) => ({
          appointments: [...s.appointments, appt].sort(
            (a, b) => new Date(a.fechaHora) - new Date(b.fechaHora)
          ),
        })),

      deleteAppointment: (id) =>
        set((s) => ({
          appointments: s.appointments.filter((a) => a.id !== id),
        })),
    }),
    {
      name: 'estetica-storage', // clave en localStorage
      partialize: (s) => ({
        clients: s.clients,
        appointments: s.appointments,
      }),
    }
  )
);
