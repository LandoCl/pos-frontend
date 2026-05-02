import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";
import type { Product } from "../types";

// Estos datos tambien son de ejmplo, se remplazan con la api
const MOCK_PRODUCTS: Product[] = [
  { _id: "1", name: "Café Americano",   price: 45, stock: 20, available: true,  category: "Bebidas" },
  { _id: "2", name: "Cappuccino",       price: 55, stock: 2,  available: true,  category: "Bebidas" },
  { _id: "3", name: "Croissant",        price: 35, stock: 10, available: true,  category: "Panadería" },
  { _id: "4", name: "Cheesecake",       price: 65, stock: 0,  available: false, category: "Postres" },
];

export default function ProductsPage() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);

  return (
    <div>
      <PageHeader title="Inventario" />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-[#3B1F0E] uppercase tracking-wide text-lg">
            Catálogo de Productos
          </h2>
          <button className="flex items-center gap-2 bg-[#3B1F0E] text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#5a3015] transition-colors">
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
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                  #{product._id.padStart(6, "0")}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {String(product.category)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`font-semibold ${
                      product.stock <= 3
                        ? "text-red-500"
                        : "text-gray-800"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-[#3B1F0E]">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      product.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.available ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button className="text-[#3B1F0E] font-semibold hover:underline text-xs">
                      Modificar
                    </button>
                    <button className="text-red-500 font-semibold hover:underline text-xs">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center text-gray-400 py-16">
            No hay productos registrados
          </p>
        )}
      </div>
    </div>
  );
}