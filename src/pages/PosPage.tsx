// src/pages/PosPage.tsx
import { useState } from "react";
import { Search, ShoppingCart, Trash2, Printer } from "lucide-react";
import { Input } from "../components/ui/input";
import PageHeader from "../components/PageHeader";
import type { Product, OrderItem } from "../types";

//ejemplos de agregado, despues se tienen que reemplazar con la api
const MOCK_PRODUCTS: Product[] = [
  { _id: "1", name: "Café Americano",  price: 45,  stock: 20, available: true, category: "Bebidas" },
  { _id: "2", name: "Cappuccino",      price: 55,  stock: 15, available: true, category: "Bebidas" },
  { _id: "3", name: "Croissant",       price: 35,  stock: 10, available: true, category: "Panadería" },
  { _id: "4", name: "Cheesecake",      price: 65,  stock: 8,  available: true, category: "Postres" },
  { _id: "5", name: "Latte de vainilla", price: 60, stock: 12, available: true, category: "Bebidas" },
];

export default function PosPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<OrderItem[]>([]);

  const filteredProducts = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.unitPrice,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          quantity: 1,
          unitPrice: product.price,
          subtotal: product.price,
        },
      ];
    });
  }

  // Elimina un item del carrito
  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.product !== productId));
  }

  // Vacía el carrito
  function clearCart() {
    setCart([]);
  }

  // Calcula el total
  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // Obtiene el nombre del producto por id
  function getProductName(productId: string | object) {
    const p = MOCK_PRODUCTS.find((p) => p._id === productId);
    return p ? p.name : "Producto";
  }

  async function handleFinalize() {
    if (cart.length === 0) return;
    // TODO: llamar a api.post("/orders", { items: cart })
    alert(`Venta finalizada. Total: $${total.toFixed(2)}`);
    clearCart();
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Ventas" />

      <div className="flex gap-6 flex-1">
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-gray-50 border-0 focus-visible:ring-1"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-400 py-12">
                No se encontraron productos
              </p>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product._id}
                  onClick={() => addToCart(product)}
                  className="w-full text-left border border-gray-200 rounded-xl px-5 py-4 hover:border-[#C4A882] hover:bg-[#FDF8F3] transition-all"
                >
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-[#3B1F0E] font-bold mt-0.5">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Stock: {product.stock}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="w-80 bg-[#3B1F0E] rounded-2xl shadow-sm flex flex-col text-white">
         
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2 font-bold text-lg">
              <ShoppingCart size={20} />
              Cuenta
            </div>
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Vaciar carrito"
            >
              <Trash2 size={20} />
            </button>
          </div>

         
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {cart.length === 0 ? (
              <p className="text-center text-white/40 py-10 text-sm">
                Agrega productos haciendo clic en ellos
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={String(item.product)}
                  className="bg-white/10 rounded-xl px-4 py-3 flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {getProductName(item.product)}
                    </p>
                    <p className="text-[#C4A882] font-bold text-sm">
                      ${item.unitPrice.toFixed(2)}
                    </p>
                    <p className="text-white/50 text-xs">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold">
                      ${item.subtotal.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(String(item.product))}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-5 py-4 border-t border-white/10 space-y-3">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleFinalize}
              disabled={cart.length === 0}
              className="w-full bg-[#C4A882] text-[#3B1F0E] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#d4b892] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Printer size={20} />
              FINALIZAR VENTA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}