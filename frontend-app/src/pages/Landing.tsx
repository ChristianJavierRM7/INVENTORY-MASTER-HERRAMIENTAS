import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="w-full min-h-screen bg-[#fcf8fa] text-[#1b1b1d] flex flex-col justify-between" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* TopAppBar - Header de tu Marca en Stitch */}
      <header className="w-full h-16 bg-white border-b border-[#c6c6cd] flex justify-between items-center px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]">inventory_2</span>
          </div>
          <div>
            <span className="font-bold text-sm text-black tracking-tight block">Inventory Precision</span>
            <span className="text-[9px] text-[#76777d] uppercase tracking-wider block font-medium">Enterprise Suite</span>
          </div>
        </div>

        <Link
          to="/login"
          className="bg-[#0F172A] text-white px-5 h-10 rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center gap-2"
        >
          <span>Ingresar</span>
          <span className="material-symbols-outlined !text-[16px]">arrow_forward</span>
        </Link>
      </header>

      {/* Hero Central - Estilo Caja Bento de Stitch */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#86f2e4] text-[#006f66] rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          <span className="material-symbols-outlined !text-[14px]">verified</span>
          <span>Sistema de Gestión de Herramientas v4.2</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight max-w-2xl leading-tight">
          Control de inventario con precisión absoluta
        </h2>

        <p className="text-[#45464d] text-base md:text-lg max-w-xl leading-relaxed">
          Optimiza las existencias del taller técnico, organiza familias de categorías, centraliza clientes y audita flujos de venta en tiempo real.
        </p>

        <div className="pt-4 flex gap-4 justify-center">
          <Link
            to="/login"
            className="bg-[#006a61] text-white px-8 h-12 rounded-xl text-sm font-bold hover:bg-[#005049] transition-colors inline-flex items-center justify-center shadow-md gap-2"
          >
            <span>Acceder al Panel</span>
            <span className="material-symbols-outlined !text-[18px]">dashboard</span>
          </Link>
        </div>
      </main>

      {/* Grid de Características Rápidas (Estilo Módulos del Dashboard) */}
      <section className="max-w-6xl mx-auto w-full px-8 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#c6c6cd] shadow-sm flex flex-col gap-2">
          <span className="material-symbols-outlined text-[#006a61] text-2xl">construction</span>
          <h4 className="font-bold text-black text-sm mt-2">Control de Herramientas</h4>
          <p className="text-xs text-[#45464d]">Gestión CRUD completa y alertas automatizadas para niveles de stock bajo mínimos.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#c6c6cd] shadow-sm flex flex-col gap-2">
          <span className="material-symbols-outlined text-[#006a61] text-2xl">category</span>
          <h4 className="font-bold text-black text-sm mt-2">Clasificación Lógica</h4>
          <p className="text-xs text-[#45464d]">Estructura de categorías limpia para un seguimiento preciso y reportes optimizados.</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#c6c6cd] shadow-sm flex flex-col gap-2">
          <span className="material-symbols-outlined text-[#006a61] text-2xl">payments</span>
          <h4 className="font-bold text-black text-sm mt-2">Histórico de Ventas</h4>
          <p className="text-xs text-[#45464d]">Auditoría de transacciones y conciliación de estados comerciales en vivo.</p>
        </div>
      </section>

      {/* Footer Fiel al Sistema de Diseño */}
      <footer className="w-full border-t border-[#c6c6cd] px-8 py-4 text-center bg-white">
        <p className="text-xs text-[#76777d]">
          © 2026 Inventory Precision S.A. - Todos los derechos reservados. Sistema versión 4.2.1-stable
        </p>
      </footer>
    </div>
  );
}