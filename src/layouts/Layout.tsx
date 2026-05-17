import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F5F0EB] overflow-hidden">
      {/* Botón menú hamburguesa para móviles */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white rounded-lg shadow-sm text-gray-700 hover:bg-gray-50"
      >
        <Menu size={24} />
      </button>

      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Contenedor del Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 w-full p-4 md:p-6 overflow-x-hidden overflow-y-auto mt-14 md:mt-0">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
