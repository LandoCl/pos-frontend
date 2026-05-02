import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Users,
  LogOut,
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { label: "Dashboard",    href: "/dashboard", icon: LayoutDashboard },
  { label: "Ventas",       href: "/pos",        icon: ShoppingCart },
  { label: "Inventario",   href: "/products",   icon: Package },
  { label: "Proveedores",  href: "/categories", icon: Truck },
  { label: "Usuarios",     href: "/users",      icon: Users },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <aside className="w-60 min-h-screen bg-[#3B1F0E] text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-white/10 flex flex-col items-center gap-2">
        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-3xl">
          ☕
        </div>
        <h1 className="text-base font-bold tracking-wide mt-1">Cacao & Vainilla</h1>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            to={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-[#C4A882] text-[#3B1F0E] font-semibold"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-white/10 hover:text-red-300 w-full transition-colors"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}