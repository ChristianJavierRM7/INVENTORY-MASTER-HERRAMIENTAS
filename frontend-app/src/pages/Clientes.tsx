import { useEffect, useState } from 'react';
import api from '../services/api';

interface Cliente {
  id: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/clientes')
      .then(res => { 
        setClientes(res.data); 
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setError('Error al cargar la base de datos de clientes.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black tracking-tight">Gestión de Clientes</h2>
          <p className="text-gray-500 text-sm">Visualiza y administra la base de datos completa de clientes.</p>
        </div>
      </div>

      {error && <div className="bg-error-container text-on-error-container p-md rounded-lg mb-md text-center font-medium">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Identificación</th>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">Dirección</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center">Cargando...</td></tr>
            ) : clientes.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">No hay clientes registrados.</td></tr>
            ) : (
              clientes.map(cli => (
                <tr key={cli.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">#CL-{cli.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{cli.identificacion}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                        {(cli.nombres.slice(0, 1) + cli.apellidos.slice(0, 1)).toUpperCase()}
                      </div>
                      <span className="font-medium text-black">{cli.nombres} {cli.apellidos}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{cli.email}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{cli.telefono}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{cli.direccion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}