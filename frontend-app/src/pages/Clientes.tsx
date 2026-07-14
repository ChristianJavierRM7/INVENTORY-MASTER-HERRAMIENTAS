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

  // Form States for creating a client
  const [showForm, setShowForm] = useState(false);
  const [identificacion, setIdentificacion] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clientes');
      setClientes(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar la base de datos de clientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identificacion || !nombres || !apellidos || !email || !telefono || !direccion) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');
      await api.post('/clientes', {
        identificacion,
        nombres,
        apellidos,
        email,
        telefono,
        direccion
      });
      
      // Reset form states
      setIdentificacion('');
      setNombres('');
      setApellidos('');
      setEmail('');
      setTelefono('');
      setDireccion('');
      setShowForm(false);
      
      // Refresh list
      fetchClientes();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Error al crear el cliente. La identificación o email podrían ya existir.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black tracking-tight">Gestión de Clientes</h2>
          <p className="text-gray-500 text-sm">Visualiza y administra la base de datos completa de clientes.</p>
        </div>
        <div>
          <button 
            onClick={() => {
              setFormError('');
              setShowForm(true);
            }}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 transition-all flex items-center gap-2 font-medium"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            Agregar Cliente
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 text-center font-medium border border-red-200">{error}</div>}

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
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Cargando clientes...</td></tr>
            ) : clientes.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">No hay clientes registrados.</td></tr>
            ) : (
              clientes.map(cli => (
                <tr key={cli.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">#CL-{cli.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono">{cli.identificacion}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 text-teal-800 rounded-full flex items-center justify-center text-xs font-bold uppercase">
                        {((cli.nombres?.slice(0, 1) || '') + (cli.apellidos?.slice(0, 1) || '')).toUpperCase()}
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

      {/* Modal / Formulario de Cliente */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl" style={{ width: '500px', maxWidth: '100%' }}>
            <header className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-black flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">person_add</span>
                Agregar Nuevo Cliente
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200 font-medium">
                  {formError}
                </div>
              )}

              {/* Identificación */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" htmlFor="cli-ident">
                  Identificación (DNI / Cédula) *
                </label>
                <input
                  id="cli-ident"
                  type="text"
                  required
                  placeholder="Ej: 172635489"
                  value={identificacion}
                  onChange={e => setIdentificacion(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                />
              </div>

              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" htmlFor="cli-nombres">
                    Nombres *
                  </label>
                  <input
                    id="cli-nombres"
                    type="text"
                    required
                    placeholder="Ej: Juan Carlos"
                    value={nombres}
                    onChange={e => setNombres(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" htmlFor="cli-apell">
                    Apellidos *
                  </label>
                  <input
                    id="cli-apell"
                    type="text"
                    required
                    placeholder="Ej: Pérez Gómez"
                    value={apellidos}
                    onChange={e => setApellidos(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" htmlFor="cli-email">
                  Correo Electrónico *
                </label>
                <input
                  id="cli-email"
                  type="email"
                  required
                  placeholder="Ej: juan.perez@correo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" htmlFor="cli-tel">
                  Teléfono *
                </label>
                <input
                  id="cli-tel"
                  type="text"
                  required
                  placeholder="Ej: +593 999 999 999"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                />
              </div>

              {/* Dirección */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" htmlFor="cli-dir">
                  Dirección de Domicilio *
                </label>
                <input
                  id="cli-dir"
                  type="text"
                  required
                  placeholder="Ej: Av. Amazonas N24-10"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                />
              </div>

              {/* Footer Actions */}
              <footer className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {formLoading ? 'Guardando...' : 'Crear Cliente'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}