import { useNavigate } from "react-router";
import { ShoppingCart, Package, Truck, Users } from "lucide-react";
import PageHeader from "../components/PageHeader";

const stats = [
  {
    label: "Ventas del día ($)",
    value: "$0.00",
    alert: false,
  },
  {
    label: "Alertas de Stock",
    value: "0 productos",
    alert: true,   
  },
  {
    label: "Proveedores activos",
    value: "0",
    alert: false,
  },
];


const shortcuts = [
  { label: "CAJA",         href: "/pos",        icon: ShoppingCart, filled: true },
  { label: "INVENTARIO",   href: "/products",   icon: Package,      filled: false },
  { label: "PROVEEDORES",  href: "/categories", icon: Truck,        filled: false },
  { label: "USUARIOS",     href: "/users",      icon: Users,        filled: false },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Inicio" />

      <p className="text-center text-sm font-semibold text-gray-500 mb-4 uppercase tracking-widest">
        Vista de estadísticas (con interacción)
      </p>
      <div className="grid grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[140px] border-2 transition-colors ${
              stat.alert
                ? "border-red-400"
                : "border-transparent hover:border-[#C4A882]"
            }`}
          >
            <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-[#3B1F0E]">{stat.value}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-sm font-semibold text-gray-500 mb-4 uppercase tracking-widest">
        Botones de acceso rápido
      </p>
      <div className="grid grid-cols-4 gap-6">
        {shortcuts.map(({ label, href, icon: Icon, filled }) => (
          <button
            key={label}
            onClick={() => navigate(href)}
            className={`rounded-2xl p-8 flex flex-col items-center justify-center gap-4 font-bold text-lg tracking-wide shadow-sm border-2 transition-all hover:scale-105 ${
              filled
                ? "bg-[#3B1F0E] text-white border-[#3B1F0E]"
                : "bg-white text-[#3B1F0E] border-[#3B1F0E]"
            }`}
          >
            <Icon size={40} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}