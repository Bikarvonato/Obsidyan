import React, { useState, useEffect } from 'react';
 import { PlusCircleIcon } from '@heroicons/react/24/solid';
 import DatePicker, { registerLocale } from 'react-datepicker';
 import 'react-datepicker/dist/react-datepicker.css';
 import es from 'date-fns/locale/es';
 registerLocale('es', es);
 
 export default function AppointmentForm({ onAddAppointment }) {
  const [formData, setFormData] = useState({
  nombre: '',
  documento: '',
  servicio: '',
  fecha: null,
  hora: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [clientList, setClientList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
 
  useEffect(() => {
  const storedClients = localStorage.getItem('clients');
  if (storedClients) {
  setClientList(JSON.parse(storedClients));
  }
  }, []);
 
  const validateForm = () => {
  const newErrors = {};
  if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
  if (!formData.documento.trim()) newErrors.documento = 'El documento es obligatorio.';
  if (!formData.servicio.trim()) newErrors.servicio = 'El servicio es obligatorio.';
  if (!formData.fecha) newErrors.fecha = 'La fecha es obligatoria.';
  if (!formData.hora) newErrors.hora = 'La hora es obligatoria.';
  else if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(formData.hora)) {
  newErrors.hora = 'Formato de hora inválido (HH:mm).';
  }
 
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
  };
 
  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  if (errors[name]) {
  setErrors(prev => ({ ...prev, [name]: null }));
  }
 
  if (name === 'documento') {
  const filteredClients = clientList.filter(client =>
  client.documento.toLowerCase().startsWith(value.toLowerCase())
  );
  setSuggestions(filteredClients.slice(0, 5));
  setSelectedClient(null);
  }
  };
 
  const handleDateChange = (date) => {
  setFormData((prev) => ({ ...prev, fecha: date }));
  if (errors.fecha) {
  setErrors(prev => ({ ...prev, fecha: null }));
  }
  };
 
  const selectSuggestion = (client) => {
  setFormData(prev => ({
  ...prev,
  nombre: client.nombre,
  documento: client.documento
  }));
  setSuggestions([]);
  setSelectedClient(client);
  };
 
  const handleSubmit = (e) => {
  e.preventDefault();
 
  if (!selectedClient) {
  setErrors(prev => ({
  ...prev,
  form: "Cliente no encontrado. Por favor, cree el cliente primero."
  }));
  return;
  }
 
  if (!validateForm()) {
  return;
  }
 
  if (formData.fecha && formData.hora) {
  setIsLoading(true);
 
  const [hours, minutes] = formData.hora.split(':');
  const combinedDateTime = new Date(formData.fecha);
  combinedDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
 
  if (isNaN(combinedDateTime.getTime())) {
  setErrors(prev => ({ ...prev, fecha: 'Fecha u hora inválida.' }));
  setIsLoading(false);
  return;
  }
 
  onAddAppointment({
  nombre: formData.nombre.trim(),
  documento: formData.documento.trim(),
  servicio: formData.servicio.trim(),
  fechaHora: combinedDateTime.toISOString(),
  });
 
  setFormData({
  nombre: '',
  documento: '',
  servicio: '',
  fecha: null,
  hora: '',
  });
  setErrors({});
  setIsLoading(false);
  } else {
  setErrors({ form: "Por favor complete todos los campos requeridos." });
  console.error("Form validation failed unexpectedly or date/time missing.");
  }
  };
 
  const getMinTime = (date) => {
  if (!date) return new Date().setHours(0, 0, 0, 0);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
  return new Date(now.getTime() + 30 * 60000);
  }
  return new Date(date).setHours(9, 0, 0, 0);
  };
 
  const getMaxTime = (date) => {
  if (!date) return new Date().setHours(23, 59, 0, 0);
  return new Date(date).setHours(18, 0, 0, 0);
  };
 
  return (
  <form
  onSubmit={handleSubmit}
  className="card p-6 md:p-8 space-y-6 animate-fade-in-up mb-8"
  noValidate
  >
  <h2 className="text-xl font-semibold text-center mb-6 text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
  Añadir Nueva Cita
  </h2>
 
  {/* Nombre y Documento */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
  <label htmlFor="nombre" className="block mb-1.5 text-sm font-medium text-[var(--color-text-medium)]">
  Nombre Cliente
  </label>
  <input
  type="text"
  name="nombre"
  id="nombre"
  value={formData.nombre}
  onChange={handleChange}
  required
  className={`input-base ${errors.nombre ? 'border-red-500 focus:ring-red-500' : ''}`}
  placeholder="Ej: Ana García"
  />
  {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
  </div>
 
  <div className="relative">
  <label htmlFor="documento" className="block mb-1.5 text-sm font-medium text-[var(--color-text-medium)]">
  DNI/NIE/Pasaporte
  </label>
  <input
  type="text"
  name="documento"
  id="documento"
  value={formData.documento}
  onChange={handleChange}
  required
  className={`input-base ${errors.documento ? 'border-red-500 focus:ring-red-500' : ''}`}
  placeholder="Ej: 12345678Z"
  />
  {errors.documento && <p className="text-red-500 text-xs mt-1">{errors.documento}</p>}
  {suggestions.length > 0 && (
  <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
  {suggestions.map((client) => (
  <li
  key={client.documento}
  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
  onClick={() => selectSuggestion(client)}
  >
  {client.nombre} {client.apellido} - {client.documento}
  </li>
  ))}
  </ul>
  )}
  </div>
  </div>
 
  {/* Servicio */}
  <div>
  <label htmlFor="servicio" className="block mb-1.5 text-sm font-medium text-[var(--color-text-medium)]">
  Servicio Solicitado
  </label>
  <input
  type="text"
  name="servicio"
  id="servicio"
  value={formData.servicio}
  onChange={handleChange}
  required
  className={`input-base ${errors.servicio ? 'border-red-500 focus:ring-red-500' : ''}`}
  placeholder="Ej: Manicura Completa"
  />
  {errors.servicio && <p className="text-red-500 text-xs mt-1">{errors.servicio}</p>}
  </div>
 
  {/* Fecha y Hora */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Fecha */}
  <div className="relative">
  <label htmlFor="fecha" className="block mb-1.5 text-sm font-medium text-[var(--color-text-medium)]">
  Fecha
  </label>
  <DatePicker
  selected={formData.fecha}
  onChange={handleDateChange}
  dateFormat="dd/MM/yyyy"
  locale="es"
  minDate={new Date()}
  required
  className={`input-base ${errors.fecha ? 'border-red-500 focus:ring-red-500' : ''}`}
  placeholderText="Seleccionar fecha"
  autoComplete="off"
  id="fecha"
  />
  {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
  </div>
 
  {/* Hora */}
  <div>
  <label htmlFor="hora" className="block mb-1.5 text-sm font-medium text-[var(--color-text-medium)]">
  Hora
  </label>
  <input
  type="time"
  name="hora"
  id="hora"
  value={formData.hora}
  onChange={handleChange}
  required
  className={`input-base ${errors.hora ? 'border-red-500 focus:ring-red-500' : ''}`}
  step="1800"
  />
  {errors.hora && <p className="text-red-500 text-xs mt-1">{errors.hora}</p>}
  </div>
  </div>
  {errors.form && <p className="text-red-500 text-xs text-center">{errors.form}</p>}
 
  {/* Submit Button */}
  <div className="pt-4">
  <button
  type="submit"
  className="btn btn-primary w-full flex items-center justify-center gap-2"
  disabled={isLoading || !selectedClient}
  >
  <PlusCircleIcon
  className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
  />
  {isLoading ? 'Agregando Cita...' : 'Agregar Cita'}
  </button>
  </div>
  </form>
  );
 }