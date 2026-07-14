import { useEffect, useState } from 'react';
import api from '../services/api';

interface Categoria {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId?: number;
  categoria?: Categoria;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Form States
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [nombre, setNombre] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [precio, setPrecio] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');

  // Load inventory from real API
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/productos');
      setProductos(response.data);
      setError('');
    } catch (err) {
      setError('Error al conectar con la base de datos de Inventory Precision.');
    } finally {
      setLoading(false);
    }
  };

  // Load categories
  const fetchCategorias = async () => {
    try {
      const response = await api.get('/categorias');
      setCategorias(response.data);
    } catch (err) {
      console.error('Error al cargar las categorías', err);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const handleAddClick = () => {
    setEditingProduct(null);
    setNombre('');
    setDescripcion('');
    setPrecio('');
    setStock('');
    setCategoriaId('');
    setShowForm(true);
  };

  const handleEditClick = (prod: Producto) => {
    setEditingProduct(prod);
    setNombre(prod.nombre);
    setDescripcion(prod.descripcion || '');
    setPrecio(prod.precio);
    setStock(prod.stock);
    setCategoriaId(prod.categoriaId || '');
    setShowForm(true);
  };

  // Delete product
  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Deseas eliminar este producto de forma permanente?')) return;
    try {
      await api.delete(`/productos/${id}`);
      fetchProductos();
    } catch (err) {
      setError('No se pudo eliminar el artículo.');
    }
  };

  // Form submission (POST & PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || precio === '' || stock === '') return;

    const payload = {
      nombre,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      categoriaId: categoriaId === '' ? null : Number(categoriaId),
    };

    try {
      if (editingProduct) {
        await api.put(`/productos/${editingProduct.id}`, payload);
      } else {
        await api.post('/productos', payload);
      }
      setShowForm(false);
      fetchProductos();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar el producto. Asegúrese de que el nombre sea único.');
    }
  };

  return (
    <div className="p-xl flex-1 max-w-7xl mx-auto w-full">
      {/* Page Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
        <div>
          <nav className="flex items-center gap-xs text-outline mb-xs">
            <span className="text-[11px] font-medium tracking-wide uppercase">Inventario</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[11px] font-medium tracking-wide uppercase text-primary">Productos</span>
          </nav>
          <h2 className="font-display-lg text-display-lg text-primary">Gestión de Productos</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Visualiza, edita y organiza el catálogo completo de existencias.</p>
        </div>
        <div className="flex gap-sm">
          <button 
            onClick={fetchProductos}
            className="flex items-center gap-sm px-lg py-md bg-surface border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-body-md">refresh</span>
            Actualizar
          </button>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-sm px-lg py-md bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-body-md">add</span>
            + Agregar Producto
          </button>
        </div>
      </div>

      {/* Controladores visuales de Carga y Errores */}
      {loading && <div className="text-center p-lg text-secondary font-bold">Cargando inventario activo...</div>}
      {error && <div className="bg-error-container text-on-error-container p-md rounded-lg mb-md text-center font-medium border border-error/15">{error}</div>}

      {/* Table Container */}
      {!loading && !error && (
        <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
          <div className="px-lg py-md border-b border-outline-variant flex flex-wrap items-center justify-between gap-md bg-surface-container-low">
            <div className="flex items-center gap-md">
              <div className="flex border border-outline-variant rounded-lg overflow-hidden bg-surface">
                <button className="px-lg py-sm text-label-md font-label-md bg-primary text-on-primary">Todos</button>
              </div>
            </div>
            <div className="text-label-md text-outline">
              Mostrando {productos.length} productos registrados
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest text-outline font-label-md text-label-md uppercase tracking-wider border-b border-outline-variant">
                  <th className="px-lg py-md font-bold">ID</th>
                  <th className="px-lg py-md font-bold">Nombre</th>
                  <th className="px-lg py-md font-bold">Descripción</th>
                  <th className="px-lg py-md font-bold">Categoría</th>
                  <th className="px-lg py-md font-bold text-right">Precio</th>
                  <th className="px-lg py-md font-bold text-center">Stock</th>
                  <th className="px-lg py-md font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-lg py-md text-center text-on-surface-variant opacity-60">
                      No hay productos registrados en el sistema.
                    </td>
                  </tr>
                ) : (
                  productos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-lg py-md font-mono-label text-mono-label text-outline">#{prod.id}</td>
                      <td className="px-lg py-md">
                        <p className="font-body-md text-body-md text-primary font-bold">{prod.nombre}</p>
                      </td>
                      <td className="px-lg py-md text-sm text-on-surface-variant max-w-xs truncate" title={prod.descripcion}>
                        {prod.descripcion || 'Sin descripción'}
                      </td>
                      <td className="px-lg py-md">
                        <span className="px-sm py-xs rounded bg-surface-container-high text-on-surface-variant text-[11px] font-bold uppercase tracking-wide">
                          {prod.categoria ? prod.categoria.nombre : 'General'}
                        </span>
                      </td>
                      <td className="px-lg py-md text-right font-medium text-primary">${prod.precio}</td>
                      <td className="px-lg py-md text-center">
                        <span className={`font-medium ${prod.stock <= 5 ? 'text-error font-bold' : 'text-primary'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="px-lg py-md text-right">
                        <div className="flex items-center justify-end gap-sm">
                          <button 
                            onClick={() => handleEditClick(prod)}
                            className="p-sm text-outline hover:text-primary hover:bg-primary-container rounded-lg transition-all" 
                            title="Editar"
                          >
                            <span className="material-symbols-outlined text-body-md">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(prod.id)}
                            className="p-sm text-outline hover:text-error hover:bg-error-container rounded-lg transition-all" 
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined text-body-md">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal / Formulario de Producto (CRUD Completo) */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-2xl" style={{ width: '500px', maxWidth: '100%' }}>
            <header className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                {editingProduct ? '📝 Editar Producto' : '➕ Agregar Producto'}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <form onSubmit={handleSubmit} className="p-lg space-y-md">
              {/* Nombre */}
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="prod-nombre">
                  Nombre del Producto *
                </label>
                <input
                  id="prod-nombre"
                  type="text"
                  required
                  placeholder="Nombre de la herramienta (ej: Martillo de bola)"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className="w-full px-sm py-xs bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                />
              </div>

              {/* Descripcion */}
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="prod-desc">
                  Descripción
                </label>
                <textarea
                  id="prod-desc"
                  placeholder="Detalles sobre el estado, tamaño o material..."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  className="w-full px-sm py-xs bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all min-h-[80px]"
                />
              </div>

              {/* Categoria select dropdown */}
              <div className="space-y-xs">
                <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="prod-cat">
                  Categoría
                </label>
                <select
                  id="prod-cat"
                  value={categoriaId}
                  onChange={e => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-sm py-xs bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                >
                  <option value="">Ninguna / General</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Fila Precio y Stock */}
              <div className="grid grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="prod-precio">
                    Precio ($) *
                  </label>
                  <input
                    id="prod-precio"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="25.50"
                    value={precio}
                    onChange={e => setPrecio(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-sm py-xs bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="prod-stock">
                    Stock inicial *
                  </label>
                  <input
                    id="prod-stock"
                    type="number"
                    min="0"
                    required
                    placeholder="10"
                    value={stock}
                    onChange={e => setStock(e.target.value !== '' ? Number(e.target.value) : '')}
                    className="w-full px-sm py-xs bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <footer className="pt-md border-t border-outline-variant flex justify-end gap-sm">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-lg py-md bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg font-label-md text-label-md text-on-surface"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-lg py-md bg-black hover:opacity-90 transition-opacity rounded-lg font-label-md text-label-md font-bold text-white"
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}