export default function Dashboard() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto w-full">
            {/* Page Heading Section */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-black tracking-tight">Dashboard Overview</h2>
                    <p className="text-gray-500 text-sm">Bienvenido de nuevo. Aquí está lo que sucede en Inventory Precision hoy.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        This Week
                    </button>
                    <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2 font-medium">
                        <span className="material-symbols-outlined text-base">download</span>
                        Export Report
                    </button>
                </div>
            </section>

            {/* KPI Cards Grid de tu Stitch */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Ventas Totales */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-[#86f2e4] rounded-lg text-[#006f66]">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="flex items-center text-[#006a61] font-bold text-xs">
                            <span className="material-symbols-outlined text-xs mr-1">trending_up</span>
                            +12.5%
                        </span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Ventas Totales</h3>
                        <p className="text-2xl font-bold text-black mt-1">$45,231.89</p>
                    </div>
                </div>

                {/* Productos en Stock */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-gray-100 rounded-lg text-black">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                        <span className="text-gray-500 text-xs font-medium">85% Capacity</span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Productos en Stock</h3>
                        <p className="text-2xl font-bold text-black mt-1">1,284</p>
                    </div>
                </div>

                {/* Clientes Activos */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-slate-900 rounded-lg text-white">
                            <span className="material-symbols-outlined">group</span>
                        </div>
                        <span className="flex items-center text-[#006a61] font-bold text-xs">
                            <span className="material-symbols-outlined text-xs mr-1">person_add</span>
                            +48
                        </span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Clientes Activos</h3>
                        <p className="text-2xl font-bold text-black mt-1">892</p>
                    </div>
                </div>

                {/* Pedidos Pendientes */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="p-2 bg-red-50 rounded-lg text-red-600">
                            <span className="material-symbols-outlined">pending_actions</span>
                        </div>
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold">Urgent</span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">Pedidos Pendientes</h3>
                        <p className="text-2xl font-bold text-black mt-1">23</p>
                    </div>
                </div>
            </section>

            {/* Bento Style Chart Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-black">Estado del Negocio</h3>
                            <p className="text-gray-500 text-sm">Visualización de ventas y stock semanal</p>
                        </div>
                        <div className="flex gap-2 items-center text-xs text-gray-500 font-medium">
                            <div className="w-3 h-3 rounded-full bg-[#006a61]"></div>
                            <span>Ventas</span>
                            <div className="w-3 h-3 rounded-full bg-slate-900 ml-2"></div>
                            <span>Stock</span>
                        </div>
                    </div>
                    {/* Componente visual de barras */}
                    <div className="h-64 flex items-end justify-between gap-2 pt-6 border-b border-gray-200">
                        {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'].map((day, idx) => (
                            <div key={day} className="flex flex-col items-center flex-1 group">
                                <div className="w-full bg-[#006a61] opacity-20 rounded-t-sm transition-opacity" style={{ height: `${30 + idx * 10}%` }}></div>
                                <div className="w-full bg-slate-900 rounded-t-sm transition-opacity" style={{ height: `${20 + idx * 5}%` }}></div>
                                <span className="text-[10px] text-gray-400 mt-2 font-mono">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-black">Actividad Reciente</h3>
                    <div className="flex flex-col divide-y divide-gray-100 flex-grow">
                        <div className="py-3 flex gap-3">
                            <span className="material-symbols-outlined text-gray-400">local_shipping</span>
                            <div><p className="text-sm font-medium text-black">Pedido #1204 enviado</p><p className="text-xs text-gray-400">Juan Pérez • Hace 15 min</p></div>
                        </div>
                        <div className="py-3 flex gap-3">
                            <span className="material-symbols-outlined text-red-500">warning</span>
                            <div><p className="text-sm font-medium text-black">Stock bajo: Llave Inglesa 12"</p><p className="text-xs text-gray-400">Quedan 2 unidades • Hace 1 hora</p></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}