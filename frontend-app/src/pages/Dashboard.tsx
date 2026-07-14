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
  cliente?: Cliente;
}

interface Producto {
  id: number;
  nombre: string;
  stock: number;
  precio: number;
}

export default function Dashboard() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, cliRes, venRes] = await Promise.all([
          api.get('/productos'),
          api.get('/clientes'),
          api.get('/ventas'),
        ]);
        setProductos(prodRes.data);
        setClientes(cliRes.data);
        setVentas(venRes.data);
      } catch (err) {
        console.error('Error al cargar datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalSalesAmount = ventas.reduce((acc, v) => acc + Number(v.total), 0);
  const totalProductsCount = productos.length;
  const totalStockItems = productos.reduce((acc, p) => acc + p.stock, 0);
  const totalClientsCount = clientes.length;

  // Detect low stock items
  const lowStockProducts = productos.filter(p => p.stock < 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Page Heading Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-black tracking-tight font-display-lg">Resumen General</h2>
          <p className="text-gray-500 text-sm">Información en tiempo real de Inventory Precision hoy.</p>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ventas Totales */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#86f2e4] rounded-lg text-[#006f66]">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="flex items-center text-[#006a61] font-bold text-xs">
              <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
              En línea
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Ventas Totales</h3>
            <p className="text-2xl font-bold text-black mt-1">
              ${totalSalesAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Productos en Stock */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-700">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <span className="text-gray-500 text-xs font-medium">{totalStockItems} unidades</span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider font-mono-label">Catálogo de Productos</h3>
            <p className="text-2xl font-bold text-black mt-1">{totalProductsCount} distintos</p>
          </div>
        </div>

        {/* Clientes Activos */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-slate-900 rounded-lg text-white">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="flex items-center text-[#006a61] font-bold text-xs">
              <span className="material-symbols-outlined text-xs mr-1">person_add</span>
              Activos
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Clientes Activos</h3>
            <p className="text-2xl font-bold text-black mt-1">{totalClientsCount}</p>
          </div>
        </div>

        {/* Alertas de Stock Bajo */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-all shadow-sm">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            {lowStockProducts.length > 0 && (
              <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold">Crítico</span>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Alertas de Stock</h3>
            <p className="text-2xl font-bold text-black mt-1">{lowStockProducts.length} productos bajos</p>
          </div>
        </div>
      </section>

      {/* Bento Style Chart Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-black">Estado de Ventas Recientes</h3>
              <p className="text-gray-500 text-sm">Visualización del total acumulado por ventas recientes</p>
            </div>
          </div>
          {/* Componente visual de barras dinámicas basadas en las últimas ventas */}
          <div className="h-64 flex items-end justify-around gap-4 pt-6 border-b border-gray-200">
            {ventas.length === 0 ? (
              <div className="text-center w-full pb-12 text-gray-400 text-sm">No hay ventas registradas para graficar.</div>
            ) : (
              ventas.slice(0, 7).reverse().map((v) => {
                const maxVal = Math.max(...ventas.map(ve => ve.total), 1);
                const heightPercentage = Math.max((v.total / maxVal) * 100, 10);
                return (
                  <div key={v.id} className="flex flex-col items-center flex-1 group max-w-[50px]">
                    <div 
                      className="w-full bg-[#006a61] hover:bg-teal-700 rounded-t-sm transition-all cursor-pointer relative" 
                      style={{ height: `${heightPercentage}%` }}
                      title={`Venta #${v.id}: $${v.total}`}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                        ${v.total}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-2 font-mono">V-{v.id}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-4 shadow-sm">
          <h3 className="text-lg font-bold text-black">Alertas e Historial</h3>
          <div className="flex flex-col divide-y divide-gray-100 flex-grow overflow-y-auto max-h-[280px]">
            {lowStockProducts.length === 0 && ventas.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-400">Sin alertas o actividad reciente.</p>
            ) : (
              <>
                {lowStockProducts.map(p => (
                  <div key={p.id} className="py-3 flex gap-3 align-start">
                    <span className="material-symbols-outlined text-red-500 text-xl">warning</span>
                    <div>
                      <p className="text-sm font-medium text-black">Stock bajo: {p.nombre}</p>
                      <p className="text-xs text-gray-400">Solo quedan {p.stock} unidades en el inventario.</p>
                    </div>
                  </div>
                ))}
                {ventas.slice(0, 4).map(v => (
                  <div key={v.id} className="py-3 flex gap-3 align-start">
                    <span className="material-symbols-outlined text-teal-600 text-xl font-bold">check_circle</span>
                    <div>
                      <p className="text-sm font-medium text-black">Venta registrada #${v.id}</p>
                      <p className="text-xs text-gray-400">
                        {v.cliente ? `${v.cliente.nombres} ${v.cliente.apellidos}` : 'Cliente General'} • ${v.total}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}