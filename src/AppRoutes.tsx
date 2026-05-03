import { Navigate, Route, Routes } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "./layouts/Layout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PosPage from "./pages/PosPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import AuthCallBackPage from "./pages/AuthCallBackPage";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";
import UserProfilePage from "./pages/UserProfilePage";
import CreateUserPage from "./pages/CreateUserPage";
const RootRoute = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">Cargando...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth-callback" element={<AuthCallBackPage />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/create" element={<CreateUserPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
        </Route>

        <Route path="/" element={<RootRoute />} />
        <Route path="*" element={<RootRoute />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default AppRoutes;