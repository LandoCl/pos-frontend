import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import PageHeader from "../components/PageHeader";
// Importamos tu formulario desde la ruta correcta que me pasaste
import ProductForm, { type BackEndProduct, type ProductFormData } from '../forms/ProductsForm';

// Apuntamos al puerto 4000 y a la ruta en plural "products"
const API_URL = "http://localhost:3000/api/product"; 

export default function ProductsPage() {
  // 1. Extraemos la función de Auth0 para obtener el token
  const { getAccessTokenSilently } = useAuth0();

  // Estados para manejar los datos y la UI
  const [products, setProducts] = useState<BackEndProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para manejar el modal y la edición
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BackEndProduct | null>(null);

  // 2. Función para obtener los productos del backend
  const fetchProducts = async () => {
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
        setProducts(data.products || []); 
      } else {
        console.error("Error de autorización al traer productos:", response.status);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setIsLoading(false);
    }
  };

 // Cargar productos al montar el componente
  useEffect(() => {
    // Envolvemos la llamada en una función asíncrona interna
    const loadInitialData = async () => {
      await fetchProducts();
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Función para guardar (Crear o Actualizar)
  const handleSaveProduct = async (formData: ProductFormData) => {
    try {
      const isEditing = !!editingProduct;
      const url = isEditing ? `${API_URL}/${editingProduct._id}` : API_URL;
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
        await fetchProducts(); // Refrescamos la tabla
        closeForm();
      } else {
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Ocurrió un error al guardar el producto");
    }
  };

  // 4. Función para eliminar
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

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
        await fetchProducts(); // Refrescar la tabla
      } else {
        alert("Error al eliminar el producto");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Funciones auxiliares para el Modal
  const openNewProductForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: BackEndProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="relative">
      <PageHeader title="Inventario" />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-[#3B1F0E] uppercase tracking-wide text-lg">
            Catálogo de Productos
          </h2>
          <button 
            onClick={openNewProductForm}
            className="flex items-center gap-2 bg-[#3B1F0E] text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#5a3015] transition-colors"
          >
            <Plus size={16} />
            Nuevo Producto
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 uppercase text-xs tracking-widest">
              <th className="text-left px-6 py-3">Barcode</th>
              <th className="text-left px-6 py-3">Producto</th>
              <th className="text-left px-6 py-3">Categoría</th>
              <th className="text-left px-6 py-3">Stock Actual</th>
              <th className="text-left px-6 py-3">P. Venta</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
               <tr>
                 <td colSpan={7} className="text-center py-10 text-gray-400">Cargando inventario...</td>
               </tr>
            ) : (
              products.map((product) => {
                const isAvailable = product.stock > 0;

                return (
                  <tr
                    key={product._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                      #{product.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${product.stock <= product.min_stock ? "text-red-500" : "text-gray-800"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#3B1F0E]">
                      ${product.sale_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {isAvailable ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => openEditForm(product)}
                          className="text-[#3B1F0E] font-semibold hover:underline text-xs"
                        >
                          Modificar
                        </button>
                        <button 
                          onClick={() => product._id && handleDelete(product._id)}
                          className="text-red-500 font-semibold hover:underline text-xs"
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

        {!isLoading && products.length === 0 && (
          <p className="text-center text-gray-400 py-16">
            No hay productos registrados
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
              <ProductForm 
                getProduct={editingProduct} 
                onSave={handleSaveProduct} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}