import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Función útil para marcar cuál pestaña del menú lateral está activa visualmente
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="bg-[#fcf8fa] text-[#1b1b1d] min-h-screen flex">
            {/* ----------------- ASIDE / SIDEBAR DE STITCH ----------------- */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#c6c6cd] flex flex-col py-6 px-4 z-50">
                {/* Brand Header */}
                <div className="px-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-base">inventory_2</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-sm text-black leading-tight">Inventory Precision</h1>
                            <p className="text-[10px] text-[#76777d] font-medium tracking-wider uppercase">Management System</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs - Enlazados correctamente con react-router-dom */}
                <nav className="flex-1 space-y-1">
                    <Link
                        to="/admin"
                        className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm ${isActive('/admin')
                            ? 'bg-[#86f2e4] text-[#006f66] font-bold'
                            : 'text-[#45464d] hover:bg-[#eae7e9]'
                            }`}
                    >
                        <span className="material-symbols-outlined">home</span>
                        <span>Home</span>
                    </Link>

                    <Link
                        to="/admin/productos"
                        className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm ${isActive('/admin/productos')
                            ? 'bg-[#86f2e4] text-[#006f66] font-bold'
                            : 'text-[#45464d] hover:bg-[#eae7e9]'
                            }`}
                    >
                        <span className="material-symbols-outlined">inventory_2</span>
                        <span>Products</span>
                    </Link>

                    <Link
                        to="/admin/categorias"
                        className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm ${isActive('/admin/categorias')
                            ? 'bg-[#86f2e4] text-[#006f66] font-bold'
                            : 'text-[#45464d] hover:bg-[#eae7e9]'
                            }`}
                    >
                        <span className="material-symbols-outlined">category</span>
                        <span>Categories</span>
                    </Link>

                    <Link
                        to="/admin/clientes"
                        className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm ${isActive('/admin/clientes')
                            ? 'bg-[#86f2e4] text-[#006f66] font-bold'
                            : 'text-[#45464d] hover:bg-[#eae7e9]'
                            }`}
                    >
                        <span className="material-symbols-outlined">group</span>
                        <span>Customers</span>
                    </Link>

                    <Link
                        to="/admin/ventas"
                        className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm ${isActive('/admin/ventas')
                            ? 'bg-[#86f2e4] text-[#006f66] font-bold'
                            : 'text-[#45464d] hover:bg-[#eae7e9]'
                            }`}
                    >
                        <span className="material-symbols-outlined">payments</span>
                        <span>Sales</span>
                    </Link>
                </nav>

                {/* Footer Tabs & Logout */}
                <div className="mt-auto border-t border-[#c6c6cd] pt-4 space-y-1">
                    <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-[#45464d] hover:bg-[#eae7e9] transition-colors cursor-pointer text-sm">
                        <span className="material-symbols-outlined">settings</span>
                        <span>Settings</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* ----------------- MAIN CONTENT CONTAINER ----------------- */}
            <div className="ml-64 flex-1 flex flex-col min-h-screen">
                {/* Top Navigation Bar / Header de Stitch */}
                <header className="h-16 bg-white border-b border-[#c6c6cd] flex justify-between items-center px-6 sticky top-0 z-40">
                    <div className="flex items-center flex-1 max-w-xl">
                        <div className="relative w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-base">
                                search
                            </span>
                            <input
                                className="w-full pl-10 pr-4 py-1.5 bg-[#f6f3f5] border border-[#c6c6cd] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all"
                                placeholder="Buscar productos, órdenes o SKU..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative text-[#76777d] hover:text-black transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
                        </button>
                        <button className="text-[#76777d] hover:text-black transition-colors">
                            <span className="material-symbols-outlined">help_outline</span>
                        </button>
                        <div className="h-8 w-[1px] bg-[#c6c6cd] mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs text-black font-bold">Admin Usuario</p>
                                <p className="text-[10px] text-[#76777d] font-medium tracking-tight">Super Administrador</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 border border-[#c6c6cd] flex items-center justify-center font-bold text-xs">
                                AU
                            </div>
                        </div>
                    </div>
                </header>

                {/* Canvas Dinámico: Aquí se inyecta el contenido de cada página */}
                <main className="p-6 flex-grow">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}