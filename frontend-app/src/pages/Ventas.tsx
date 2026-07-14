import { useEffect, useState } from 'react';
import api from '../services/api';

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
}

interface Venta {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  cliente?: Cliente;
}

export default function Ventas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/ventas')
      .then(res => { 
        setVentas(res.data); 
        setLoading(false); 
      })
      .catch(err => {
        console.error(err);
        setError('Error al conectar con la base de datos de ventas.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-black tracking-tight">Registro de Ventas</h2>
      
      {error && <div className="bg-error-container text-on-error-container p-md rounded-lg mb-md text-center font-medium">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-4">ID Venta</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={5} className="p-4 text-center">Cargando...</td></tr> : 
             ventas.length === 0 ? <tr><td colSpan={5} className="p-4 text-center text-gray-500">No hay ventas registradas.</td></tr> :
             ventas.map(v => (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-xs">#VEN-{v.id}</td>
                <td className="px-6 py-4 font-medium text-black">
                  {v.cliente ? `${v.cliente.nombres} ${v.cliente.apellidos}` : 'Cliente General'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(v.fecha).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-bold text-black">${v.total}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
                    {v.estado || 'Completado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}