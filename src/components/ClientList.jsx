import React, { useState, useEffect } from 'react';
 import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
 import toast from 'react-hot-toast';
 
 const countryCodes = [
  { name: 'Andorra', code: '+376' },
  { name: 'España', code: '+34' },
  { name: 'Francia', code: '+33' },
  { name: 'Portugal', code: '+351' },
  // ... más países
 ];
 
 const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
   nombre: '',
   apellido: '',
   documento: '',
   pais: '+376', // Valor por defecto: Andorra
   telefono: '',
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
 
  useEffect(() => {
   const storedClients = localStorage.getItem('clients');
   if (storedClients) {
    setClients(JSON.parse(storedClients));
   }
  }, []);
 
  useEffect(() => {
   localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);
 
  const handleInputChange = (e) => {
   const { name, value } = e.target;
   setNewClient((prevClient) => ({
    ...prevClient,
    [name]: value,
   }));
  };
 
  const handleAddClient = () => {
   if (
    newClient.nombre &&
    newClient.apellido &&
    newClient.documento &&
    newClient.pais &&
    newClient.telefono
   ) {
    const isDocumentoDuplicado = clients.some(
     (client) => client.documento === newClient.documento
    );
 
    if (isDocumentoDuplicado) {
     toast.error('Ya existe un cliente con ese número de documento.');
     return;
    }
 
    const newClientId = Date.now();
    setClients((prevClients) => [
     ...prevClients,
     { ...newClient, id: newClientId },
    ]);
    setNewClient({
     nombre: '',
     apellido: '',
     documento: '',
     pais: '+376',
     telefono: '',
    });
    setIsFormVisible(false);
    toast.success('Cliente añadido correctamente');
   } else {
    toast.error('Por favor, rellene todos los campos.');
   }
  };
 
  const handleDeleteClient = (id) => {
   toast((t) => (
    <div className="text-center">
     <p className="font-semibold mb-3">¿Eliminar a este cliente?</p>
     <div className="flex justify-center gap-4">
      <button
       className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
       onClick={() => {
        setClients((prevClients) =>
         prevClients.filter((client) => client.id !== id)
        );
        toast.success('Cliente eliminado', { id: t.id });
        toast.dismiss(t.id);
       }}
      >
       Sí, eliminar
      </button>
      <button
       className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded"
       onClick={() => toast.dismiss(t.id)}
      >
       Cancelar
      </button>
     </div>
    </div>
   ));
  };
 
  const filteredClients = clients.filter((client) => {
   const search = searchTerm.toLowerCase();
   return (
    client.nombre.toLowerCase().includes(search) ||
    client.apellido.toLowerCase().includes(search) ||
    client.documento.toLowerCase().includes(search) ||
    client.telefono.toLowerCase().includes(search)
   );
  });
 
  // Function to get country name from code
  const getCountryName = (code) => {
   const country = countryCodes.find((c) => c.code === code);
   return country ? country.name : 'Unknown';
  };
 
  return (
   <div className="card p-4 md:p-6">
    <h2 className="text-xl font-semibold text-center mb-6 text-[var(--color-text-dark)] dark:text-[var(--color-text-light)]">
     Lista de Clientes
    </h2>
 
    <input
     type="text"
     placeholder="Buscar cliente..."
     value={searchTerm}
     onChange={(e) => setSearchTerm(e.target.value)}
     className="input-base mb-4 w-full md:w-1/2"
    />
 
    <button
     onClick={() => setIsFormVisible(!isFormVisible)}
     className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mb-4"
    >
     {isFormVisible ? 'Ocultar Formulario' : 'Añadir Nuevo Cliente'}
    </button>
 
    {isFormVisible && (
     <div className="mb-4 p-4 bg-white rounded-md shadow-md dark:bg-neutral-darker">
      <h3 className="text-lg font-semibold mb-3 dark:text-neutral-lighter">
       Añadir Cliente
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <div>
        <label
         htmlFor="nombre"
         className="block text-sm font-medium text-gray-700 dark:text-neutral-lighter"
        >
         Nombre
        </label>
        <input
         type="text"
         id="nombre"
         name="nombre"
         value={newClient.nombre}
         onChange={handleInputChange}
         className="input-base mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-neutral-dark dark:text-neutral-lighter"
         required
        />
       </div>
       <div>
        <label
         htmlFor="apellido"
         className="block text-sm font-medium text-gray-700 dark:text-neutral-lighter"
        >
         Apellido
        </label>
        <input
         type="text"
         id="apellido"
         name="apellido"
         value={newClient.apellido}
         onChange={handleInputChange}
         className="input-base mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-neutral-dark dark:text-neutral-lighter"
         required
        />
       </div>
       <div>
        <label
         htmlFor="documento"
         className="block text-sm font-medium text-gray-700 dark:text-neutral-lighter"
        >
         Documento
        </label>
        <input
         type="text"
         id="documento"
         name="documento"
         value={newClient.documento}
         onChange={handleInputChange}
         className="input-base mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-neutral-dark dark:text-neutral-lighter"
         required
        />
       </div>
       <div className="flex gap-2">
        <div>
         <label
          htmlFor="pais"
          className="block text-sm font-medium text-gray-700 dark:text-neutral-lighter"
         >
          País
         </label>
         <select
          id="pais"
          name="pais"
          value={newClient.pais}
          onChange={handleInputChange}
          className="input-base mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-neutral-dark dark:text-neutral-lighter"
         >
          {countryCodes.map((country) => (
           <option key={country.code} value={country.code}>
            {country.name} ({country.code})
           </option>
          ))}
         </select>
        </div>
        <div className="flex-grow">
         <label
          htmlFor="telefono"
          className="block text-sm font-medium text-gray-700 dark:text-neutral-lighter"
         >
          Teléfono
         </label>
         <input
          type="tel"
          id="telefono"
          name="telefono"
          value={newClient.telefono}
          onChange={handleInputChange}
          className="input-base mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-neutral-dark dark:text-neutral-lighter"
          required
         />
        </div>
       </div>
      </div>
      <button
       onClick={handleAddClient}
       className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded mt-4"
      >
       <PlusIcon className="h-4 w-4 mr-2 inline-block" />
       Añadir Cliente
      </button>
     </div>
    )}
 
    <div className="overflow-x-auto">
     <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-darker">
      <thead className="bg-gray-50 dark:bg-neutral-dark">
       <tr>
        <th
         scope="col"
         className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-light uppercase tracking-wider"
        >
         Nombre
        </th>
        <th
         scope="col"
         className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-light uppercase tracking-wider"
        >
         Apellido
        </th>
        <th
         scope="col"
         className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-light uppercase tracking-wider"
        >
         Documento
        </th>
        <th
         scope="col"
         className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-light uppercase tracking-wider"
        >
         País
        </th>
        <th
         scope="col"
         className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-neutral-light uppercase tracking-wider"
        >
         Teléfono
        </th>
        <th scope="col" className="relative py-3">
         <span className="sr-only">Eliminar</span>
        </th>
       </tr>
      </thead>
      <tbody className="bg-white dark:bg-neutral-darker divide-y divide-gray-200 dark:divide-neutral-dark">
       {filteredClients.map((client) => (
        <tr
         key={client.id}
         className="hover:bg-gray-100 dark:hover:bg-neutral-dark"
        >
         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-neutral-lighter">
          {client.nombre}
         </td>
         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-light">
          {client.apellido}
         </td>
         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-light">
          {client.documento}
         </td>
         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-light">
          {getCountryName(client.pais)}
         </td>
         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-neutral-light">
          {`${client.pais} ${client.telefono}`}
         </td>
         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
           onClick={() => handleDeleteClient(client.id)}
           className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100"
          >
           <TrashIcon className="h-5 w-5" />
          </button>
         </td>
        </tr>
       ))}
      </tbody>
     </table>
    </div>
   </div>
  );
 };
 
 export default ClientList;