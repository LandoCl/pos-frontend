
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "cajero";
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: Category | string;
  image?: string;
  stock: number;
  available: boolean;
}

export interface OrderItem {
  product: Product | string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: "pendiente" | "completada" | "cancelada";
  createdAt: string;
  createdBy?: User | string;
}

export interface AuthResponse {
  token: string;
  user: User;
}