'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppointmentForm from "../../../components/admin/AppointmentForm";
import AppointmentTable from "../../../components/admin/AppointmentTable";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role === "admin") {
      setIsAdmin(true);
    } else {
      router.push("/login");
    }
  }, []);

  const handleBookingSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (!isAdmin) return <div>Loading...</div>;

  return (
    <div className="w-full bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 p-10 min-h-screen text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Nail Store Admin Dashboard</h1>

      <div className="bg-white p-6 rounded-2xl shadow-xl text-black">
        <h2 className="text-2xl font-semibold mb-4">Add Booking</h2>
        <AppointmentForm onSuccess={handleBookingSuccess} /> {/* Pass the function to handle booking success */}
      </div>

      <div className="mt-8">
        <AppointmentTable refreshTrigger={refreshTrigger} /> {/* Pass the refresh trigger to the table */}
      </div>
    </div>
  );
}
