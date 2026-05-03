import { Button } from "@/components/ui/button";
import PageHeader from "../components/PageHeader";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

export default function UsersPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Usuarios" />

      <div className="flex justify-end mb-6">
        <Button
          className="bg-[#3B1F0E] hover:bg-[#5F3D1B] text-white flex items-center gap-2"
          onClick={() => navigate('/users/create')}
        >
          <Plus className="w-4 h-4" />
          Agregar usuario
        </Button>
      </div>

      <p className="text-gray-500">Aquí irá el listado de usuarios...</p>
    </div>
  );
}