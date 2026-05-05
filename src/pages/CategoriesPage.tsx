import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import PageHeader from "../components/PageHeader";
// Ajusta la ruta de importación según dónde guardaste el formulario
import ProviderForm, { type BackEndProvider, type ProviderFormData } from '../forms/ProviderForms';

// Ajusta el puerto y la ruta según tu backend (asumiendo que es /api/providers)
const API_URL = "http://localhost:3000/api/provider"; 

export default function ProvidersPage() {
  // 1. Extraemos la función de Auth0 para obtener el token
  const { getAccessTokenSilently } = useAuth0();

  // Estados para manejar los datos y la UI
  const [providers, setProviders] = useState<BackEndProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para manejar el modal y la edición
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<BackEndProvider | null>(null);

  // 2. Función para obtener los proveedores del backend
  const fetchProviders = async () => {
    try {
      // Pedimos el token a Auth0
      const token = await getAccessTokenSilently();

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // <-- Enviamos el token
        }
      });

      if (response.ok) {
        const data = await response.json();
        // El backend devuelve { providers: [...] }
        setProviders(data.providers || []); 
      } else {
        console.error("Error de autorización al traer proveedores:", response.status);
      }
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar proveedores al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchProviders();
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Función para guardar (Crear o Actualizar)
  const handleSaveProvider = async (formData: ProviderFormData) => {
    try {
      const isEditing = !!editingProvider;
      const url = isEditing ? `${API_URL}/${editingProvider._id}` : API_URL;
      const method = isEditing ? "PUT" : "POST";

      // Pedimos el token a Auth0 antes de guardar
      const token = await getAccessTokenSilently();

      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // <-- Enviamos el token
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchProviders(); // Refrescamos la tabla
        closeForm();
      } else {
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ocurrió un error al guardar el proveedor");
    }
  };

  // 4. Función para eliminar (Asegúrate de tener esta ruta en tu Node.js)
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proveedor?")) return;

    try {
      // Pedimos el token a Auth0 antes de eliminar
      const token = await getAccessTokenSilently();

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}` // <-- Enviamos el token
        }
      });

      if (response.ok) {
        await fetchProviders(); // Refrescar la tabla
      } else {
        alert("Error al eliminar el proveedor");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Funciones auxiliares para el Modal
  const openNewProviderForm = () => {
    setEditingProvider(null);
    setIsFormOpen(true);
  };

  const openEditForm = (provider: BackEndProvider) => {
    setEditingProvider(provider);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProvider(null);
  };

  return (
    <div className="relative">
      <PageHeader title="Directorio de Proveedores" />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-[#3B1F0E] uppercase tracking-wide text-lg">
            Lista de Proveedores
          </h2>
          <button 
            onClick={openNewProviderForm}
            className="flex items-center gap-2 bg-[#3B1F0E] text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#5a3015] transition-colors"
          >
            <Plus size={16} />
            Nuevo Proveedor
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 uppercase text-xs tracking-widest bg-gray-50/50">
              <th className="text-left px-6 py-4">Empresa / Nombre</th>
              <th className="text-left px-6 py-4">Teléfono</th>
              <th className="text-left px-6 py-4">Correo Electrónico</th>
              <th className="text-left px-6 py-4">Dirección</th>
              <th className="text-left px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr>
                 <td colSpan={5} className="text-center py-10 text-gray-400">Cargando proveedores...</td>
               </tr>
            ) : (
              providers.map((provider) => (
                <tr
                  key={provider._id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {provider.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                    {provider.phone}
                  </td>
                  <td className="px-6 py-4 text-blue-600 hover:underline">
                    <a href={`mailto:${provider.email}`}>{provider.email}</a>
                  </td>
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate" title={provider.address}>
                    {provider.address}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => openEditForm(provider)}
                        className="text-[#3B1F0E] font-semibold hover:underline text-xs"
                      >
                        Modificar
                      </button>
                      <button 
                        onClick={() => provider._id && handleDelete(provider._id)}
                        className="text-red-500 font-semibold hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!isLoading && providers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">No hay proveedores registrados en el sistema.</p>
          </div>
        )}
      </div>

      {/* MODAL PARA EL FORMULARIO */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={closeForm}
              className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 z-10 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="p-2">
              <ProviderForm 
                getProvider={editingProvider} 
                onSave={handleSaveProvider} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}