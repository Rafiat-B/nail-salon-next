import { ReactNode } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";

export default function AdminLayout({ children }:{ children: ReactNode }) {
    return (
      <div className="min-h-screen flex">
        {/* Sidebar (placed only once here) */}
        <AdminSidebar />
  
        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    );
  }
  