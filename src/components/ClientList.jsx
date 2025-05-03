// src/components/ClientList.jsx – fixed toggle bug, Zustand version
import React, { useState } from 'react';
import { TrashIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useStore } from '../store';
import Button from './ui/Button';
import Input from './ui/Input';

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function ClientList() {
  const clients        = useStore((s) => s.clients);
  const addClient      = useStore((s) => s.addClient);
  const updateClient   = useStore((s) => s.updateClient);
  const deleteClient   = useStore((s) => s.deleteClient);

  const [newClient, setNewClient] = useState({ nombre: '', apellido: '', correo: '', telefono: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleInput = (e) => setNewClient((p) => ({ ...p, [e.target.name]: e.target.value }));

  const clearFields = () => setNewClient({ nombre: '', apellido: '', correo: '', telefono: '' });

  const resetForm = () => {
    clearFields();
    setIsEditing(false);
    setEditId(null);
  };

  const save = () => {
    if (Object.values(newClient).some((v) => !v.trim())) {
      return toast.error('Complete todos los campos.');
    }
    if (!emailOk(newClient.correo)) return toast.error('Correo inválido.');

    const email = newClient.correo.toLowerCase();

    if (isEditing) {
      updateClient({ ...newClient, id: email });
      toast.success('Cliente actualizado');
    } else {
      if (clients.some((c) => c.correo.toLowerCase() === email)) {
        return toast.error('Correo duplicado.');
      }
      addClient({ ...newClient, id: email });
      toast.success('Cliente añadido');
    }
    resetForm();
    setIsFormVisible(false);  // ocultamos tras guardar
  };

  const remove = (id) => toast((t) => (
    <div className="text-center space-y-3">
      <p className="font-semibold">¿Eliminar cliente?</p>
      <div className="flex justify-center gap-3">
        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
          deleteClient(id);
          toast.success('Eliminado', { id: t.id });
          toast.dismiss(t.id);
        }}>Sí</Button>
        <Button onClick={() => toast.dismiss(t.id)} className="btn-ghost">Cancelar</Button>
      </div>
    </div>
  ));

  const edit = (c) => {
    setNewClient({ nombre: c.nombre, apellido: c.apellido, correo: c.correo, telefono: c.telefono });
    setIsEditing(true);
    setEditId(c.id);
    setIsFormVisible(true);
  };

  const list = clients.filter((c) => (
    [c.nombre, c.apellido, c.correo, c.telefono].join(' ').toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <div className="card p-6 space-y-6 animate-fade-in-up">
      <h2 className="text-glass-title">Lista de Clientes</h2>

      {/* Search + button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Input
          type="text"
          placeholder="Buscar cliente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:flex-1"
        />
        <Button
          onClick={() => {
            if (!isFormVisible) {
              // Se va a mostrar => limpiar campos / modo edición off
              resetForm();
            }
            setIsFormVisible(!isFormVisible);
          }}
          className="md:flex-shrink-0 self-start md:self-auto"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {isFormVisible ? 'Ocultar Formulario' : 'Añadir Cliente'}
        </Button>
      </div>

      {isFormVisible && (
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="nombre" value={newClient.nombre} onChange={handleInput} placeholder="Nombre" />
            <Input name="apellido" value={newClient.apellido} onChange={handleInput} placeholder="Apellido" />
            <Input name="correo" type="email" value={newClient.correo} onChange={handleInput} placeholder="Correo" />
            <Input name="telefono" type="tel" value={newClient.telefono} onChange={handleInput} placeholder="Teléfono" />
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={save}>
              <PlusIcon className="h-4 w-4 mr-2" />
              {isEditing ? 'Guardar' : 'Añadir'}
            </Button>
            {isEditing && <Button onClick={resetForm} className="btn-danger">Cancelar</Button>}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-darker">
          <thead className="bg-gray-50 dark:bg-neutral-dark">
            <tr>
              {['Nombre','Apellido','Correo','Teléfono',''].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-light">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white/5 dark:bg-white/5 divide-y divide-gray-200 dark:divide-neutral-dark">
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-white/10 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{c.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{c.apellido}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{c.correo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{c.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm flex gap-2 justify-end">
                  <button onClick={() => edit(c)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400" title="Editar"><PencilSquareIcon className="h-5 w-5" /></button>
                  <button onClick={() => remove(c.id)} className="text-red-600 hover:text-red-800 dark:text-red-400" title="Eliminar"><TrashIcon className="h-5 w-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



