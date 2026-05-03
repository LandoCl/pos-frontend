import { useGetUser } from "@/api/UserApi";

interface Props {
  title: string;
}

export default function PageHeader({ title }: Props) {
  const today = new Date().toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const { data: user, isLoading } = useGetUser();

  const userName = isLoading ? "Cargando..." : (user?.name || user?.username || "Usuario Activo");
  const role = isLoading ? "..." : (user?.rol === "admin" ? "Administrador" : "Cajero");

  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-4xl font-black text-[#3B1F0E] uppercase tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {userName} — {role}
        </p>
      </div>
      <span className="bg-white border border-gray-200 shadow-sm rounded-lg px-4 py-2 text-sm font-semibold text-gray-700">
        {today}
      </span>
    </div>
  );
}