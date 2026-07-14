import { useEffect, useState } from 'react';
import api from '../services/api';

interface Categoria {
  id: number;
  nombre: string;
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [nombre, setNombre] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categorias');
      setCategorias(res.data);
    } catch (err) {
      setError('Error al cargar categorías.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategorias(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    try {
      if (editingId) {
        await api.put(`/categorias/${editingId}`, { nombre });
      } else {
        await api.post('/categorias', { nombre });
      }
      setNombre('');
      setEditingId(null);
      fetchCategorias();
    } catch (err) {
      setError('No se pudo guardar la categoría.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar categoría?')) return;
    try {
      await api.delete(`/categorias/${id}`);
      fetchCategorias();
    } catch (err) {
      setError('Error al eliminar la categoría. Asegúrese de que no tenga productos asociados.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header e Input superior de Creación */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold mb-4">{editingId ? '📝 Editar Categoría' : '➕ Crear Nueva Categoría'}</h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end max-w-xl">
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre de la categoría (ej: Herramientas)"
            className="flex-grow h-11 px-4 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none"
            required
          />
          <button type="submit" className="h-11 bg-black text-white px-6 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
            {editingId ? 'Actualizar' : 'Guardar'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setNombre(''); }} className="h-11 bg-gray-200 px-4 rounded-lg text-sm hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Tabla con Estilo Exacto de Stitch */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-black">Listado de Categorías</h3>
        </div>

        {loading && <p className="text-center p-4">Cargando...</p>}
        {error && <p className="text-center p-4 text-red-500">{error}</p>}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nombre de Categoría</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categorias.length === 0 && !loading ? (
              <tr><td colSpan={3} className="p-4 text-center text-gray-500">No hay categorías registradas.</td></tr>
            ) : (
              categorias.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">#CAT-00{cat.id}</td>
                  <td className="px-6 py-4 font-medium text-black">{cat.nombre}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => { setEditingId(cat.id); setNombre(cat.nombre); }} className="text-teal-600 hover:underline text-sm font-medium">Editar</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline text-sm font-medium">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}