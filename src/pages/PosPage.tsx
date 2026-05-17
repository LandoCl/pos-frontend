// src/pages/PosPage.tsx
import { useState, useEffect } from "react";
import { Search, ShoppingCart, Trash2, Printer } from "lucide-react";
import { Input } from "../components/ui/input";
import PageHeader from "../components/PageHeader";
import { useAuth0 } from "@auth0/auth0-react";
import type { OrderItem } from "../types";
import type { BackEndProduct } from "../forms/ProductsForm";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"}/api/product`;

export default function PosPage() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<BackEndProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          console.error("Error al traer productos:", response.status);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.code && p.code.toLowerCase().includes(term))
    );
  });

  function addToCart(product: BackEndProduct) {
    const existing = cart.find((item) => item.product === product._id);
    if (existing && existing.quantity + 1 > product.stock) {
      alert("No puedes exceder el inventario disponible.");
      return;
    }
    if (!existing && product.stock <= 0) {
      alert("No hay stock disponible de este producto.");
      return;
    }

    setCart((prev) => {
      const item = prev.find((i) => i.product === product._id);
      if (item) {
        return prev.map((i) =>
          i.product === product._id
            ? {
              ...i,
              quantity: i.quantity + 1,
              subtotal: (i.quantity + 1) * i.unitPrice,
            }
            : i
        );
      }
      return [
        ...prev,
        {
          product: product._id!,
          quantity: 1,
          unitPrice: product.sale_price,
          subtotal: product.sale_price,
        },
      ];
    });
  }

  function decrementCart(productId: string) {
    setCart((prev) => {
      const existing = prev.find((item) => item.product === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product === productId
            ? {
              ...item,
              quantity: item.quantity - 1,
              subtotal: (item.quantity - 1) * item.unitPrice,
            }
            : item
        );
      }
      return prev.filter((item) => item.product !== productId);
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
    const p = products.find((p) => p._id === productId);
    return p ? p.name : "Producto";
  }

  async function handleFinalize() {
    if (cart.length === 0) return;
    // TODO: llamar a api.post("/orders", { items: cart })
    alert(`Venta finalizada. Total: $${total.toFixed(2)}`);
    clearCart();
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);

    // Si la longitud es 13 (EAN-13), intentar agregarlo automáticamente
    if (val.length === 13) {
      const foundProduct = products.find(p => p.code === val);
      if (foundProduct) {
        addToCart(foundProduct);
        setSearch("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Ventas" />

      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden pb-4">
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 md:p-5 flex flex-col gap-4 overflow-hidden min-h-[50vh]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              autoFocus
              placeholder="Buscar productos por nombre o código..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 bg-gray-50 border-0 focus-visible:ring-1"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <p className="text-center text-gray-400 py-12">Cargando productos...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-gray-400 py-12">
                No se encontraron productos
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 content-start pb-4">
                {filteredProducts.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => addToCart(product)}
                    className={`w-full text-left border border-gray-200 rounded-xl px-4 py-4 flex flex-col justify-between h-32 hover:border-[#C4A882] hover:bg-[#FDF8F3] transition-all ${product.stock <= 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                  >
                    <div>
                      <p className="font-medium text-gray-800 line-clamp-2 leading-tight">{product.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">#{product.code}</p>
                    </div>
                    <div className="flex justify-between items-end w-full mt-2">
                      <p className="text-[#3B1F0E] font-bold text-lg">
                        ${product.sale_price.toFixed(2)}
                      </p>
                      <p className={`text-xs font-semibold ${product.stock > 0 ? "text-gray-500" : "text-red-500"}`}>
                        {product.stock > 0 ? `Stock: ${product.stock}` : "Agotado"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-80 h-[50vh] lg:h-auto bg-[#3B1F0E] rounded-2xl shadow-sm flex flex-col text-white shrink-0">

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
                      Cantidad:
                    </p>
                    <div className="flex items-center gap-3 mt-1 bg-black/20 rounded-lg w-max px-2 py-1">
                      <button
                        onClick={() => decrementCart(String(item.product))}
                        className="text-white hover:text-[#C4A882] px-1 font-bold"
                      >
                        -
                      </button>
                      <span className="text-white text-sm font-semibold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          const p = products.find(p => p._id === item.product);
                          if (p) addToCart(p);
                        }}
                        className="text-white hover:text-[#C4A882] px-1 font-bold"
                      >
                        +
                      </button>
                    </div>
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