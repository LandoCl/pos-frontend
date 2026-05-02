import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
      <Outlet />
    </div>
  );
}