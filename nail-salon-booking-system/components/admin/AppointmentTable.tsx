'use client';
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Appointment } from "../../appointment";

export default function AppointmentTable({ refreshTrigger }: { refreshTrigger: number }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async (userId: string): Promise<{ name: string; email: string }> => {
    try {
      const res = await axios.get<{ name: string; email: string }>(`/api/users/${userId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      return { name: "Unknown", email: "N/A" };
    }
  };

  const loadAppointments = useCallback(async () => {
    try {
      const [appointmentRes, servicesRes] = await Promise.all([
        axios.get<Appointment[]>("/api/appointments"),
        axios.get<{ _id: string; name: string }[]>("/api/services"),
      ]);

      const serviceMap = new Map(servicesRes.data.map(s => [s._id, s.name]));

      const enrichedData = await Promise.all(
        appointmentRes.data.map(async (app) => {
          const userInfo = await fetchUserInfo(app.user_id);
          return {
            ...app,
            userName: userInfo.name,
            userEmail: userInfo.email,
            serviceName: serviceMap.get(app.service_id) || "Unknown Service",
          };
        })
      );

      setAppointments(enrichedData);
    } catch (err) {
      console.error("Error loading appointments", err);
      setError("Failed to load appointment list.");
    }
  }, [fetchUserInfo]);

  useEffect(() => {
    loadAppointments();
  }, [refreshTrigger, loadAppointments]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl text-black">
      <h2 className="text-2xl font-semibold mb-4">Booking List</h2>
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">User Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Service</th>
            <th className="p-2">Date & Time</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app._id} className="border-t border-gray-200">
              <td className="p-2">{app.userName}</td>
              <td className="p-2">{app.userEmail}</td>
              <td className="p-2">{app.serviceName}</td>
              <td className="p-2">
                {new Date(app.appointment_date).toLocaleString()}
              </td>
              <td className="p-2">{app.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
