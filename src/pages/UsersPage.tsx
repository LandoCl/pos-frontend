import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "../components/PageHeader";
import { Plus, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import type { User } from "@/api/types";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";
import type { UserFormData } from "@/forms/user-profile-form/UserProfileForm";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/user`;

export default function UsersPage() {
  const navigate = useNavigate();
  const { user: auth0User, getAccessTokenSilently } = useAuth0();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data || []);
      } else {
        console.error("Error al traer usuarios:", response.status);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchUsers();
    }
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.")) return;

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        alert("Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleSaveUser = async (formData: UserFormData) => {
    try {
      if (!editingUser?._id) return;
      
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/${editingUser._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchUsers();
        closeForm();
      } else {
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ocurrió un error al guardar el usuario");
    }
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="relative">
      <PageHeader title="Usuarios" />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-[#3B1F0E] uppercase tracking-wide text-lg">
            Listado de Usuarios
          </h2>
          <Button
            className="bg-[#3B1F0E] hover:bg-[#5F3D1B] text-white flex items-center gap-2 rounded-xl font-semibold text-sm transition-colors"
            onClick={() => navigate('/users/create')}
          >
            <Plus className="w-4 h-4" />
            Agregar usuario
          </Button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 uppercase text-xs tracking-widest">
              <th className="text-left px-6 py-3">Nombre</th>
              <th className="text-left px-6 py-3">Usuario</th>
              <th className="text-left px-6 py-3">Email</th>
              <th className="text-left px-6 py-3">Rol</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">Cargando usuarios...</td>
              </tr>
            ) : (
              users.map((u) => {
                const isCurrentUser = auth0User?.email === u.email;

                return (
                  <tr
                    key={u._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
                        {u.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          disabled={isCurrentUser}
                          onClick={() => openEditForm(u)}
                          className={`font-semibold text-xs ${isCurrentUser ? "text-gray-300 cursor-not-allowed" : "text-[#3B1F0E] hover:underline"}`}
                        >
                          Modificar
                        </button>
                        <button
                          disabled={isCurrentUser}
                          onClick={() => u._id && handleDelete(u._id)}
                          className={`font-semibold text-xs ${isCurrentUser ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:underline"}`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {!isLoading && users.length === 0 && (
          <p className="text-center text-gray-400 py-16">
            No hay usuarios registrados
          </p>
        )}
      </div>

      {/* MODAL PARA EL FORMULARIO */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={closeForm}
              className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 z-10"
            >
              <X size={20} />
            </button>
            
            <div className="p-2">
              <UserProfileForm 
                currentUser={editingUser}
                onSave={handleSaveUser}
                title="Modificar Usuario"
                description="Edita la información y rol del usuario"
                buttonText="Guardar cambios"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}