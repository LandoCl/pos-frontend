import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#F5F0EB]">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
