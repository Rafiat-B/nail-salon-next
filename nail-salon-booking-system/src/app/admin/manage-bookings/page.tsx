"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Appointment {
  _id: string;
  user_id: string;
  service_id: string;
  appointment_date: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  userName?: string;
  userEmail?: string;
}

interface IService {
  _id: string;
  name: string;
}

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getServiceName = (id: string) => {
    const service = services.find(s => s._id === id);
    return service ? service.name : "Unknown Service";
  };

  const fetchUserInfo = async (userId: string): Promise<{ name: string; email: string }> => {
    try {
      const res = await axios.get<{ name: string; email: string }>(`/api/users/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      return { name: "Unknown", email: "N/A" };
    }
  };

  const updateStatus = async (id: string, newStatus: Appointment["status"], currentStatus: string) => {
    if (currentStatus === newStatus) {
      alert(`Booking is already marked as "${newStatus}".`);
      return;
    }

    if (newStatus === "cancelled") {
      const confirmCancel = confirm("Are you sure you want to cancel this booking?");
      if (!confirmCancel) return;
    }

    try {
      const res = await axios.put(`/api/appointments`, { id, status: newStatus });
      if (res.status === 200) {
        setAppointments(prev =>
          prev.map(app => (app._id === id ? { ...app, status: newStatus } : app))
        );

        let msg = "";
        switch (newStatus) {
          case "confirmed":
            msg = "Booking confirmed successfully.";
            break;
          case "completed":
            msg = "Booking marked as completed.";
            break;
          case "cancelled":
            msg = "Booking cancelled.";
            break;
        }
        alert(msg);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status.");
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get<IService[]>("/api/services");
        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };

    const loadAppointmentsWithDetails = async () => {
      try {
        const res = await axios.get<Appointment[]>("/api/appointments");
        const appointmentData = await Promise.all(
          res.data.map(async (app) => {
            const userInfo = await fetchUserInfo(app.user_id);
            return {
              ...app,
              userName: userInfo.name,
              userEmail: userInfo.email,
            };
          })
        );
        setAppointments(appointmentData);
      } catch (err) {
        console.error("Failed to load appointments", err);
        setError("Failed to load appointments.");
      }
    };

    fetchServices();
    loadAppointmentsWithDetails();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-pink-700">Manage Appointments</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">User Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Service</th>
            <th className="p-2">Date</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(app => (
            <tr key={app._id} className="border-t">
              <td className="p-2">{app.userName}</td>
              <td className="p-2">{app.userEmail}</td>
              <td className="p-2">{getServiceName(app.service_id)}</td>
              <td className="p-2">{new Date(app.appointment_date).toLocaleString()}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => updateStatus(app._id, "confirmed", app.status)}
                >
                  Confirm
                </button>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                  onClick={() => updateStatus(app._id, "completed", app.status)}
                >
                  Complete
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  onClick={() => updateStatus(app._id, "cancelled", app.status)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
