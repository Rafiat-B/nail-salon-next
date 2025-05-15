"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="w-1/4 bg-gray-100 p-6 h-screen shadow-md">
      <h2 className="text-2xl font-bold text-pink-700 mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-4">
        <Link href="/admin" className="text-pink-600 hover:underline">Dashboard</Link>
        <Link href="/admin/manage-services" className="text-pink-600 hover:underline">Manage Services</Link>
        <Link href="/admin/manage-bookings" className="text-pink-600 hover:underline">Manage Bookings</Link>
      </nav>
      <button 
        className="mt-8 bg-pink-700 text-white px-4 py-2 rounded w-full"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
}
