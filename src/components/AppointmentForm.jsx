import React, { Fragment, useState } from 'react';
import {
  PlusCircleIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import { Listbox, Transition } from '@headlessui/react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import toast from 'react-hot-toast';
import { useStore } from '../store';      //  ←  Zustand
import Button from './ui/Button';
import Input from './ui/Input';

registerLocale('es', es);

/* Opciones */
const SERVICE_OPTIONS = ['Gel', 'Polygel', 'Lifting de pestañas'];
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0');
  const m = i % 2 === 0 ? '00' : '30';
  return `${h}:${m}`;
});

/* Validación de e‑mail */
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function AppointmentForm() {
  /* ---------- acciones del store ---------- */
  const addAppointment = useStore((s) => s.addAppointment);
  const clients        = useStore((s) => s.clients);

  /* ---------- estado de formulario ---------- */
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    servicio: '',
    fecha: null,
    hora: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [suggest, setSuggest] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  /* ---------- validación ---------- */
  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Nombre obligatorio.';
    if (!form.correo.trim()) e.correo = 'Correo obligatorio.';
    else if (!emailOk(form.correo)) e.correo = 'Correo no válido.';
    if (!form.servicio) e.servicio = 'Seleccione un servicio.';
    if (!form.fecha) e.fecha = 'Fecha obligatoria.';
    if (!form.hora) e.hora = 'Hora obligatoria.';
    setErrors(e);
    return !Object.keys(e).length;
  };

  /* ---------- handlers ---------- */
  const handleInput = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));

    if (name === 'correo') {
      const s = clients.filter((c) =>
        c.correo.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggest(s.slice(0, 5));
      setSelectedClient(null);
    }
  };

  const pickDate = (d) => {
    setForm((p) => ({ ...p, fecha: d }));
    if (errors.fecha) setErrors((p) => ({ ...p, fecha: null }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!selectedClient) {
      toast.error('Seleccione un cliente existente.');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    const [h, m] = form.hora.split(':');
    const dt = new Date(form.fecha);
    dt.setHours(+h, +m, 0, 0);

    addAppointment({
      id: Date.now().toString(),
      nombre: form.nombre.trim(),
      correo: form.correo.trim().toLowerCase(),
      servicio: form.servicio,
      fechaHora: dt.toISOString(),
    });

    setLoading(false);
    setForm({ nombre: '', correo: '', servicio: '', fecha: null, hora: '' });
    setSelectedClient(null);
    toast.success('Cita añadida');
  };

  /* ---------- UI ---------- */
  return (
    <form
      onSubmit={submit}
      noValidate
      className="card p-6 md:p-8 space-y-6 animate-fade-in-up mb-16 overflow-visible"
    >
      <h2 className="text-glass-title">Añadir Nueva Cita</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label className="block mb-1 text-sm font-medium">Nombre Cliente</label>
          <Input
            name="nombre"
            value={form.nombre}
            onChange={handleInput}
            placeholder="Ej: Ana García"
          />
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        {/* Correo */}
        <div className="relative">
          <label className="block mb-1 text-sm font-medium">Correo Electrónico</label>
          <Input
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleInput}
            placeholder="cliente@email.com"
          />
          {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
          {suggest.length > 0 && (
            <ul className="absolute z-80 mt-2 w-full bg-white/80 dark:bg-[#1e1b4b]/90 backdrop-blur-xl rounded-md shadow-lg max-h-48 overflow-auto">
              {suggest.map((c) => (
                <li
                  key={c.id}
                  className="px-4 py-2 hover:bg-white/30 cursor-pointer"
                  onClick={() => {
                    setForm({ ...form, nombre: c.nombre, correo: c.correo });
                    setSuggest([]);
                    setSelectedClient(c);
                  }}
                >
                  {c.nombre} – {c.correo}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Servicio */}
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium">Servicio</label>
          <Listbox
            value={form.servicio}
            onChange={(v) => setForm((p) => ({ ...p, servicio: v }))}
          >
            {({ open }) => (
              <div className="relative">
                <Listbox.Button className="select-glass flex w-full items-center justify-between">
                  <span>{form.servicio || 'Seleccionar servicio…'}</span>
                  <ChevronUpDownIcon className="h-5 w-5 text-[var(--color-text-light)]" />
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Listbox.Options className="listbox-panel absolute z-80 mt-2 w-full rounded-xl bg-white/10 backdrop-blur-xl shadow-xl max-h-60 overflow-auto">
                    {SERVICE_OPTIONS.map((s) => (
                      <Listbox.Option
                        key={s}
                        value={s}
                        className={({ active }) =>
                          `cursor-pointer select-none py-2 px-4 ${
                            active ? 'bg-white/20' : ''
                          }`
                        }
                      >
                        {({ selected }) => (
                          <span
                            className={`flex items-center gap-2 ${
                              selected ? 'font-semibold' : ''
                            }`}
                          >
                            {selected && <CheckIcon className="h-4 w-4" />}
                            {s}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
          {errors.servicio && <p className="text-red-500 text-xs mt-1">{errors.servicio}</p>}
        </div>

        {/* Fecha */}
        <div className="relative">
          <label className="block mb-1 text-sm font-medium">Fecha</label>
          <DatePicker
            selected={form.fecha}
            onChange={pickDate}
            dateFormat="dd/MM/yyyy"
            locale="es"
            minDate={new Date()}
            className="input-base w-full"
            placeholderText="Seleccionar fecha"
            autoComplete="off"
            popperClassName="z-80"
          />
          {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
        </div>

        {/* Hora */}
        <div>
          <label className="block mb-1 text-sm font-medium">Hora</label>
          <Listbox value={form.hora} onChange={(v) => setForm((p) => ({ ...p, hora: v }))}>
            {({ open }) => (
              <div className="relative">
                <Listbox.Button className="select-glass flex w-full items-center justify-between">
                  <span>{form.hora || 'Seleccionar hora…'}</span>
                  <ChevronUpDownIcon className="h-5 w-5 text-[var(--color-text-light)]" />
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Listbox.Options className="listbox-panel absolute z-80 mt-2 w-full rounded-xl bg-white/10 backdrop-blur-xl shadow-xl max-h-60 overflow-auto">
                    {TIME_OPTIONS.map((t) => (
                      <Listbox.Option
                        key={t}
                        value={t}
                        className={({ active }) =>
                          `cursor-pointer select-none py-2 px-4 ${
                            active ? 'bg-white/20' : ''
                          }`
                        }
                      >
                        {({ selected }) => (
                          <span
                            className={`flex items-center gap-2 ${
                              selected ? 'font-semibold' : ''
                            }`}
                          >
                            {selected && <CheckIcon className="h-4 w-4" />}
                            {t}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
          {errors.hora && <p className="text-red-500 text-xs mt-1">{errors.hora}</p>}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading || !selectedClient}
        className="w-full flex items-center justify-center gap-2"
      >
        <PlusCircleIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Agregando…' : 'Agregar Cita'}
      </Button>
    </form>
  );
}


