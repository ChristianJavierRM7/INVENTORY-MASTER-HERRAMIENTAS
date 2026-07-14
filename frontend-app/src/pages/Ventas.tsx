import { useEffect, useState } from 'react';
import api from '../services/api';

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  identificacion?: string;
}

interface VentaDetalle {
  id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  producto?: {
    nombre: string;
  };
}

interface Venta {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  cliente?: Cliente;
  detalles?: VentaDetalle[];
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

interface CartItem {
  productoId: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

export default function Ventas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form States for registering a sale
  const [showForm, setShowForm] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clienteId, setClienteId] = useState<number | ''>('');
  
  // Cart items
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductoId, setSelectedProductoId] = useState<number | ''>('');
  const [cantidad, setCantidad] = useState<number | ''>('');
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Detailed Modal for viewing details of an existing sale
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ventas');
      setVentas(res.data);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con la base de datos de ventas.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientsAndProducts = async () => {
    try {
      const [cliRes, prodRes] = await Promise.all([
        api.get('/clientes'),
        api.get('/productos')
      ]);
      setClientes(cliRes.data);
      setProductos(prodRes.data);
    } catch (err) {
      console.error('Error al cargar clientes/productos para el formulario:', err);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const handleOpenSaleForm = () => {
    setFormError('');
    setClienteId('');
    setCart([]);
    setSelectedProductoId('');
    setCantidad('');
    fetchClientsAndProducts();
    setShowForm(true);
  };

  const handleAddItem = () => {
    if (!selectedProductoId || !cantidad || Number(cantidad) <= 0) {
      setFormError('Seleccione un producto y digite una cantidad válida.');
      return;
    }

    const prod = productos.find(p => p.id === Number(selectedProductoId));
    if (!prod) return;

    if (prod.stock < Number(cantidad)) {
      setFormError(`Stock insuficiente para el producto ${prod.nombre}. Disponible: ${prod.stock} unidades.`);
      return;
    }

    // Check if item is already in cart
    const existingIndex = cart.findIndex(item => item.productoId === prod.id);
    if (existingIndex > -1) {
      const newQty = cart[existingIndex].cantidad + Number(cantidad);
      if (prod.stock < newQty) {
        setFormError(`Stock insuficiente acumulado para ${prod.nombre}. Disponible: ${prod.stock} unidades.`);
        return;
      }
      const updatedCart = [...cart];
      updatedCart[existingIndex].cantidad = newQty;
      setCart(updatedCart);
    } else {
      setCart([...cart, {
        productoId: prod.id,
        nombre: prod.nombre,
        cantidad: Number(cantidad),
        precio: Number(prod.precio)
      }]);
    }

    // Reset item selectors
    setSelectedProductoId('');
    setCantidad('');
    setFormError('');
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      setFormError('Seleccione un cliente para realizar la venta.');
      return;
    }
    if (cart.length === 0) {
      setFormError('El carrito debe contener al menos un producto.');
      return;
    }

    try {
      setFormLoading(true);
      setFormError('');
      
      const payload = {
        clienteId: Number(clienteId),
        detalles: cart.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad
        }))
      };

      await api.post('/ventas', payload);
      
      // Reset and close
      setShowForm(false);
      fetchVentas();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Error al procesar la venta. Verifique los stocks de los productos.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black tracking-tight">Registro de Ventas</h2>
          <p className="text-gray-500 text-sm">Visualiza el historial y registra nuevas ventas o salidas de herramientas.</p>
        </div>
        <div>
          <button 
            onClick={handleOpenSaleForm}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 transition-all flex items-center gap-2 font-medium"
          >
            <span className="material-symbols-outlined text-base">point_of_sale</span>
            Registrar Venta
          </button>
        </div>
      </div>
      
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 text-center font-medium border border-red-200">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-4">ID Venta</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Cargando ventas...</td></tr>
            ) : ventas.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">No hay ventas registradas.</td></tr>
            ) : (
              ventas.map(v => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">#VEN-{v.id}</td>
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
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedVenta(v)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">visibility</span>
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal / Formulario de Registro de Venta */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl my-8" style={{ width: '600px', maxWidth: '100%' }}>
            <header className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-black flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600">point_of_sale</span>
                Registrar Nueva Venta
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

              {/* Cliente */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" htmlFor="sale-cli">
                  Seleccionar Cliente *
                </label>
                <select
                  id="sale-cli"
                  required
                  value={clienteId}
                  onChange={e => setClienteId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                >
                  <option value="">-- Seleccione Cliente --</option>
                  {clientes.map(cli => (
                    <option key={cli.id} value={cli.id}>{cli.nombres} {cli.apellidos} ({cli.identificacion})</option>
                  ))}
                </select>
              </div>

              <hr className="border-gray-100" />

              {/* Agregar Producto al Carrito */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Añadir Herramienta a la Venta</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="md:col-span-2 space-y-1">
                    <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider" htmlFor="add-prod">
                      Herramienta
                    </label>
                    <select
                      id="add-prod"
                      value={selectedProductoId}
                      onChange={e => setSelectedProductoId(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                    >
                      <option value="">-- Seleccione Producto --</option>
                      {productos.map(prod => (
                        <option key={prod.id} value={prod.id} disabled={prod.stock <= 0}>
                          {prod.nombre} - ${prod.precio} (Stock: {prod.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider" htmlFor="add-qty">
                      Cantidad
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="add-qty"
                        type="number"
                        min="1"
                        placeholder="Uds"
                        value={cantidad}
                        onChange={e => setCantidad(e.target.value ? Number(e.target.value) : '')}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items in Cart Table */}
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                      <th className="p-3">Producto</th>
                      <th className="p-3 text-center">Cant.</th>
                      <th className="p-3 text-right">Precio</th>
                      <th className="p-3 text-right">Subtotal</th>
                      <th className="p-3 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cart.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-gray-400">El carrito de venta está vacío.</td>
                      </tr>
                    ) : (
                      cart.map((item, idx) => (
                        <tr key={item.productoId} className="hover:bg-gray-50">
                          <td className="p-3 font-medium text-black">{item.nombre}</td>
                          <td className="p-3 text-center">{item.cantidad}</td>
                          <td className="p-3 text-right">${item.precio}</td>
                          <td className="p-3 text-right font-bold">${item.precio * item.cantidad}</td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              className="text-red-500 hover:text-red-700 font-bold transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center bg-teal-50/50 p-4 rounded-lg border border-teal-100">
                <span className="text-sm font-bold text-teal-800">Total a Pagar:</span>
                <span className="text-xl font-black text-teal-900">${calculateTotal().toFixed(2)}</span>
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
                  disabled={formLoading || cart.length === 0}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {formLoading ? 'Guardando...' : 'Completar Venta'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal for viewing sale details */}
      {selectedVenta && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl" style={{ width: '500px', maxWidth: '100%' }}>
            <header className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg text-black">
                Detalle de Venta #VEN-{selectedVenta.id}
              </h3>
              <button 
                onClick={() => setSelectedVenta(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm border-b border-gray-100 pb-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Cliente</p>
                  <p className="font-medium text-black mt-0.5">
                    {selectedVenta.cliente ? `${selectedVenta.cliente.nombres} ${selectedVenta.cliente.apellidos}` : 'Cliente General'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Fecha</p>
                  <p className="font-medium text-black mt-0.5">{new Date(selectedVenta.fecha).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Productos Comprados</p>
                <div className="border border-gray-100 rounded-lg overflow-hidden max-h-[180px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                        <th className="p-3">Herramienta</th>
                        <th className="p-3 text-center">Cant.</th>
                        <th className="p-3 text-right">Unitario</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedVenta.detalles && selectedVenta.detalles.length > 0 ? (
                        selectedVenta.detalles.map(det => (
                          <tr key={det.id}>
                            <td className="p-3 font-medium text-black">{det.producto?.nombre || 'Herramienta Eliminada'}</td>
                            <td className="p-3 text-center">{det.cantidad}</td>
                            <td className="p-3 text-right">${det.precioUnitario}</td>
                            <td className="p-3 text-right font-bold">${det.subtotal}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-gray-400">Sin detalles registrados.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="text-sm font-bold text-gray-700">Total Venta:</span>
                <span className="text-lg font-black text-black">${selectedVenta.total}</span>
              </div>
            </div>

            <footer className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedVenta(null)}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Cerrar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}