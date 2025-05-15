"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface IAppointment {
  _id: string;
  service_id: string;
  appointment_date: string;
  status: string;
}

interface IService {
  _id: string;
  name: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<IUser | null>(null);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get<IService[]>("/api/services");
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const getServiceName = (id: string) => {
    const service = services.find((s) => s._id === id);
    return service ? service.name : "Unknown Service";
  };

  const updateStatus = async (id: string, newStatus: string, currentStatus: string) => {
    if (currentStatus === newStatus) {
      alert(`Booking is already marked as "${newStatus}".`);
      return;
    }

    const confirmCancel = confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      const res = await axios.put(`/api/appointments`, { id, status: newStatus });
      if (res.status === 200) {
        setAppointments(prev =>
          prev.map(app => (app._id === id ? { ...app, status: newStatus } : app))
        );
        alert("Booking cancelled.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to cancel booking.");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        const res = await axios.get<IAppointment[]>("/api/appointments", {
          headers: { "user-id": user._id },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [user]);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-1/4 bg-pink-600 p-4 h-screen">
        <h2 className="text-xl font-bold text-white">Dashboard</h2>
        <nav className="mt-4">
          <Link href="/dashboard" className="block text-white py-2">
            My Appointments
          </Link>
          <Link href="/settings" className="block text-white py-2">
            Settings
          </Link>
          <Link href="/logout" className="block text-white py-2">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="w-3/4 p-6">
        {user ? (
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold text-gray-700">
              Welcome, {user.name || "User"} 👋
            </h2>
            <p className="text-gray-600">Email: {user.email}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}

        <h2 className="text-2xl font-bold text-pink-700 mt-8">Your Appointments</h2>
        {appointments.length === 0 ? (
          <p className="mt-4 text-gray-600">No appointments yet.</p>
        ) : (
          <table className="w-full border mt-4">
            <thead>
              <tr className="bg-pink-600 text-white">
                <th className="p-2">Service</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} className="border-t">
                  <td className="p-2">{getServiceName(appt.service_id)}</td>
                  <td className="p-2">{new Date(appt.appointment_date).toLocaleString()}</td>
                  <td className="p-2">{appt.status}</td>
                  <td className="p-2">
                    {appt.status !== "cancelled" && (
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => updateStatus(appt._id, "cancelled", appt.status)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
